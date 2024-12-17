import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import supertest from 'supertest';
import { connectTestDb, disconnectTestDb } from '../test.configs';
import { app } from '../../src/app';
import { STATUS } from '../../src/utils/status';
import { createTestUserInDb, generateMockJwt } from '../helper.tester';
import { UserModel } from '../../src/models/user.model';
import { RegionModel } from '../../src/models/region.model';

describe('User API Integration Tests ', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb(mongoServer);
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  describe('Regio Create', () => {
    test('should create a new regio', async () => {
      const user = await createTestUserInDb();

      const dbUser = await UserModel.findById(user._id);
      expect(dbUser).toBeTruthy();
      const token = generateMockJwt(user);
      const result = await supertest(app)
        .post('/regions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Rio Grande',
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
        });
      const { id } = result.body;

      expect(id).toBeDefined();
      expect(result.body.user).not.toBeNull();
      expect(result.status).toBe(STATUS.CREATED);
    });
  });

  describe('GET /regions/contains', () => {
    test('should create and check if exists the contains', async () => {
      const user = await createTestUserInDb();

      const dbUser = await UserModel.findById(user._id);
      expect(dbUser).toBeTruthy();
      const token = generateMockJwt(user);
      const create = await supertest(app)
        .post('/regions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Rio Grande',
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
        });

      const result = await supertest(app).get(
        '/regions/contains?lng=-46.624130&lat=-23.532500',
      );
      const { id } = create.body;

      expect(result.status).toBe(STATUS.OK);
      expect(result.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: id,
            name: 'Rio Grande',
          }),
        ]),
      );
    });

    test('should return array empty of contains', async () => {
      const result = await supertest(app).get(
        '/regions/contains?lng=-46.624130&lat=-23.532500',
      );

      expect(result.status).toBe(STATUS.OK);
      expect(result.body).toEqual([]);
    });

    test('should return error validation', async () => {
      const result = await supertest(app).get(
        `/regions/contains?lng=${'abc'}&lat=-23.532500`,
      );

      const responseBody = JSON.parse(result.text);

      expect(result.status).toBe(STATUS.BAD_REQUEST);
      expect(responseBody).toHaveProperty('error');
      expect(Array.isArray(responseBody.error)).toBe(true);
      expect(responseBody.error).toContain('lng must be a valid number');
    });
  });

  describe('GET /regions/near', () => {
    test('should create and check if exists the near', async () => {
      const user = await createTestUserInDb();

      const dbUser = await UserModel.findById(user._id);
      expect(dbUser).toBeTruthy();
      const token = generateMockJwt(user);
      const create = await supertest(app)
        .post('/regions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Rio Grande',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-52.3837968, -28.2661364],
                [-53.8132932, -29.6869985],
                [-54.4775663, -27.867736],
                [-52.3837968, -28.2661364],
              ],
            ],
          },
        });

      const result = await supertest(app).get(
        '/regions/near?&km=3100&lng=-54.4775663&lat=-27.867736',
      );

      const [responseRegion] = result.body;

      expect(result.status).toBe(STATUS.OK);
      expect(result).toHaveProperty('body');
      expect(responseRegion.id).toEqual(create.body.id);
    });
  });
});
