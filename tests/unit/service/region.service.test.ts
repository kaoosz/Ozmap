import { Types } from 'mongoose';
import { CreateRegionDto } from '../../../src/dto/create.region.dto';
import { IRegionRepository } from '../../../src/interfaces/IRegion.repository';
import { IRegion } from '../../../src/models/IRegion.interface';
import { RegionService } from '../../../src/service/region.service';

interface MockRegionRepository extends IRegionRepository {
  create: jest.Mock<Promise<IRegion>, [CreateRegionDto]>;
  findRegionsContainingPoint: jest.Mock<Promise<IRegion[]>, [[number, number]]>;
  findRegionsNearPoint: jest.Mock<
    Promise<IRegion[]>,
    [[number, number], number, string?]
  >;
}

describe('RegioService', () => {
  let regioRepository: MockRegionRepository;
  let regioService: RegionService;

  beforeAll(() => {
    regioRepository = {
      create: jest.fn(),
      findRegionsContainingPoint: jest.fn(),
      findRegionsNearPoint: jest.fn(),
    };
    regioService = new RegionService(regioRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a new Region', async () => {
      const createRegioDto: CreateRegionDto = {
        name: 'Paraiba',
        user: new Types.ObjectId().toHexString(),
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.62529, -23.533773],
              [-46.62413, -23.533773],
              [-46.62413, -23.5325],
              [-46.62529, -23.5325],
              [-46.62529, -23.533773],
            ],
          ],
        },
      };

      const mockRegion: IRegion = {
        _id: new Types.ObjectId(),
        ...createRegioDto,
        created_at: new Date(),
      };

      regioRepository.create.mockResolvedValueOnce(mockRegion);

      const result = await regioService.create(createRegioDto);
      expect(regioRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(createRegioDto),
      );

      expect(result.id).toBeDefined();
      expect(result.name).toBe(mockRegion.name);
      expect(result.geometry).toBe(mockRegion.geometry);
      expect(result.created_by).toBe(mockRegion.created_by);
      expect(result.user).toBe(mockRegion.user);
    });

    test('should fail create a new Region', async () => {
      const createRegioDto: CreateRegionDto = {
        name: '',
        user: new Types.ObjectId().toHexString(),
        // user: idFixed,
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.62529, -23.533773],
              [-46.62413, -23.533773],
              [-46.62413, -23.5325],
              [-46.62529, -23.5325],
              [-46.62528, -23.533772],
            ],
          ],
        },
      };
      await expect(regioService.create(createRegioDto)).rejects.toThrow(
        `Cannot read properties of undefined (reading '_id')`,
      );
    });

    test('find regions containing a defined point', async () => {
      const point: [number, number] = [-52.5, 28.3];
      const mockRegions: IRegion[] = [
        {
          _id: new Types.ObjectId(),
          name: 'Region1',
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
        },
        {
          _id: new Types.ObjectId(),
          name: 'Region2',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [2, 2],
                [3, 3],
                [2, 3],
              ],
            ],
          },
          user: new Types.ObjectId().toHexString(),
        },
      ];

      regioRepository.findRegionsContainingPoint.mockResolvedValueOnce(
        mockRegions,
      );

      const result = await regioService.listRegionsContainingPoint(
        point[0],
        point[1],
      );
      expect(regioRepository.findRegionsContainingPoint).toHaveBeenCalledWith(
        point,
      );
      expect(result[0].id).toBeDefined();
      expect(result[1].id).toBeDefined();
      expect(result[0].name).toBe(mockRegions[0].name);
      expect(result[0].geometry).toBe(mockRegions[0].geometry);
      expect(result[0].user).toBe(mockRegions[0].user);
      expect(result[1].user).toBe(mockRegions[1].user);

      // expect(result).toEqual(mockRegions);
    });

    test('find region near a point', async () => {
      const point: [number, number] = [-29, -55];
      const km = 100;
      const mockRegions: IRegion[] = [
        {
          _id: new Types.ObjectId(),
          name: 'São Jośe Dos Campos',
          user: new Types.ObjectId().toHexString(),
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [1, 1],
                [22, 22],
                [33, 33],
              ],
            ],
          },
        },
      ];

      regioRepository.findRegionsNearPoint.mockResolvedValueOnce(mockRegions);
      const result = await regioService.listRegionsNearPoint(
        point[0],
        point[1],
        km,
      );
      expect(regioRepository.findRegionsNearPoint).toHaveBeenCalledTimes(1);
      expect(result[0].name).toEqual(mockRegions[0].name);
      expect(result[0].geometry).toEqual(mockRegions[0].geometry);
    });
  });
});
