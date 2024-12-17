import { UserController } from '../../../src/controller/user.controller';
import { UserService } from '../../../src/service/user.service';
import { CreateUserDto, UpdateUserDto } from '../../../src/dto/create.user.dto';
import { Request, Response } from 'express';
import { STATUS } from '../../../src/utils/status';
import { AppError } from '../../../src/utils/errors';
import { RegionController } from '../../../src/controller/region.controller';
import { RegionService } from '../../../src/service/region.service';
import { CreateRegionDto, RegionDto } from '../../../src/dto/create.region.dto';
import { Types } from 'mongoose';
import { IRegion } from '../../../src/models/IRegion.interface';

describe('RegioController', () => {
  let regionController: RegionController;
  let regionService: jest.Mocked<RegionService>;

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Mock the UserService
    regionService = {
      create: jest.fn(),
      listRegionsContainingPoint: jest.fn(),
      listRegionsNearPoint: jest.fn(),
    } as unknown as jest.Mocked<RegionService>;

    // Initialize UserController with the mocked UserService
    regionController = new RegionController(regionService);

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as unknown as jest.Mock;

    mockRequest = { body: {}, query: {} };
    mockResponse = { status: statusMock, json: jsonMock };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a region and return 201 status', async () => {
      const userId = new Types.ObjectId();
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        address: 'sao joao',
        coordinates: [0, 0] as [number, number],
        regions: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      const createRegionDto: CreateRegionDto = {
        name: 'Floripa',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
        user: userId.toHexString(),
      };

      const createdRegion: RegionDto = {
        id: new Types.ObjectId().toHexString(),
        name: 'Floripa',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
        user: userId.toHexString(),
        created_at: new Date(),
      };

      mockRequest.body = createRegionDto;
      mockRequest.user = mockUser;

      regionService.create.mockResolvedValueOnce(createdRegion);

      await regionController.create(
        mockRequest as Request,
        mockResponse as Response,
      );

      const result = jsonMock.mock.calls[0][0];

      expect(result.id).toBeDefined();
      expect(result.user).toEqual(createdRegion.user);
      expect(statusMock).toHaveBeenCalledWith(STATUS.CREATED);
      expect(jsonMock).toHaveBeenCalledWith(createdRegion);
    });

    test('User is not authenticated', async () => {
      const createRegionDto: CreateRegionDto = {
        name: 'Test Region',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
        user: 'mockUserId',
      };

      const creationError = new AppError(
        'User is not authenticated',
        STATUS.UNAUTHORIZED,
      );

      regionService.create.mockRejectedValueOnce(creationError);

      mockRequest.body = createRegionDto;

      await regionController.create(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User is not authenticated',
      });

      await expect(regionService.create).rejects.toThrow(
        'User is not authenticated',
      );
    });
  });

  describe('listContainingPoint', () => {
    test('should return regions containing a given point', async () => {
      const mockRegions: IRegion[] = [
        {
          name: 'Ceara',
          _id: new Types.ObjectId(),
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [1, 1],
                [0, 1],
              ],
            ],
          },
          user: new Types.ObjectId().toHexString(),
          // created_at: new Date(),
        },
      ];

      const mockRegionDtos: RegionDto[] = mockRegions.map((region) => ({
        id: region._id.toHexString(),
        name: region.name,
        geometry: region.geometry,
        user: region.user,
        created_at: new Date(),
      }));

      mockRequest.query = { lng: '-45.7728598', lat: '-23.1384991' };

      regionService.listRegionsContainingPoint.mockResolvedValueOnce(
        mockRegionDtos,
      );

      await regionController.listContainingPoint(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(regionService.listRegionsContainingPoint).toHaveBeenCalledWith(
        -45.7728598,
        -23.1384991,
      );
      expect(statusMock).toHaveBeenCalledWith(STATUS.OK);
      expect(jsonMock).toHaveBeenCalledWith(mockRegionDtos);
    });

    test('should handle errors during fetching regions containing a point', async () => {
      const error = {
        statusCode: STATUS.BAD_REQUEST,
        message: 'Invalid coordinates',
      };
      mockRequest.query = { lng: 'invalid', lat: 'invalid' };
      regionService.listRegionsContainingPoint.mockRejectedValueOnce(error);
      await regionController.listContainingPoint(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(regionService.listRegionsContainingPoint).toHaveBeenCalledWith(
        NaN,
        NaN,
      );
      expect(statusMock).toHaveBeenCalledWith(STATUS.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid coordinates',
      });
    });
  });
  describe('listNearPoint', () => {
    test('should return regions near a given point', async () => {
      const mockRegions: RegionDto[] = [
        {
          id: 'new Types.ObjectId()',
          name: 'São Jośe Dos Campos',
          user: 'new Types.ObjectId()',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-52.3837967, -28.2661363],
                [-53.8132931, -29.6869984],
                [-54.4775662, -27.867735],
                [-52.3837967, -28.2661363],
              ],
            ],
          },
          created_at: new Date(),
        },
      ];

      mockRequest.query = {
        lng: '-52.3837968',
        lat: '-28.2661364',
        km: '100',
        excludeUserId: 'mockUserId',
      };

      regionService.listRegionsNearPoint.mockResolvedValueOnce(mockRegions);

      await regionController.listNearPoint(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(regionService.listRegionsNearPoint).toHaveBeenCalledWith(
        -52.3837968,
        -28.2661364,
        100,
        'mockUserId',
      );
      expect(statusMock).toHaveBeenCalledWith(STATUS.OK);
      expect(jsonMock).toHaveBeenCalledWith(mockRegions);
    });

    test('should handle errors during fetching regions near a point', async () => {
      const error = {
        statusCode: STATUS.NOT_FOUND,
        message: 'Failed to fetch regions',
      };

      mockRequest.query = {
        lng: '-45.0',
        lat: '-23.0',
        km: 'invalid',
        excludeUserId: 'mockUserId',
      };

      regionService.listRegionsNearPoint.mockRejectedValueOnce(error);

      await regionController.listNearPoint(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(regionService.listRegionsNearPoint).toHaveBeenCalledWith(
        -45.0,
        -23.0,
        NaN,
        'mockUserId',
      );
      expect(statusMock).toHaveBeenCalledWith(STATUS.NOT_FOUND);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch regions',
      });
    });
  });
});
