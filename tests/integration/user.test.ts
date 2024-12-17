import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { connectTestDb, disconnectTestDb } from '../test.configs';
import { app } from '../../src/app';
import { STATUS } from '../../src/utils/status';
import { createTestUserInDb, generateMockJwt } from '../helper.tester';
import { UserModel } from '../../src/models/user.model';

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

  describe('User Create', () => {
    test('should create a new user', async () => {
      const result = await supertest(app).post('/users').send({
        name: 'Test User',
        email: 'shouldcreate@example.com',
        address: 'Avenida Agenor Alves dos Santos',
        password: 'gui123',
      });

      const { id, email } = result.body;

      expect(id).toBeDefined();
      expect(email).toBe('shouldcreate@example.com');

      expect(result.status).toBe(STATUS.CREATED);
    });

    test('should create fails to new user', async () => {
      const result = await supertest(app).post('/users').send({
        name: 'Test User',
        email: 'test@example.com',
        address: '123 Test St',
      });

      expect(result.status).toBe(400);
      expect(result.text).toBe('{"error":["the field password is required"]}');
    });
  });

  describe('User Update ', () => {
    test('should update a user and test jwt', async () => {
      const user = await createTestUserInDb();

      const dbUser = await UserModel.findById(user._id);
      expect(dbUser).toBeTruthy();

      const token = generateMockJwt(user);

      const result = await supertest(app)
        .put(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'changed name test',
        });

      expect(result.status).toBe(STATUS.UPDATED);
      expect(result.body.email).toBe('test@example.com');
    });

    test('should fail to update email invalid format', async () => {
      const user = await createTestUserInDb();

      const dbUser = await UserModel.findById(user._id);
      expect(dbUser).toBeTruthy();

      const token = generateMockJwt(user);

      const result = await supertest(app)
        .put(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'changed name test',
        });

      expect(result.status).toBe(STATUS.BAD_REQUEST);

      // Validate the error response body
      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toContain('invalid email format');
    });
  });
});
