import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UserModel } from '../src/models/user.model';
import jwt from 'jsonwebtoken';

export const createTestUserInDb = async () => {
  // Hash a test password
  const hashedPassword = await bcrypt.hash('testPassword123', 10);

  // Create a user object
  const user = new UserModel({
    _id: new Types.ObjectId(), // Optionally provide an ID
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    // address: '123 Test St',
    coordinates: [-23.1379888, -45.7730633],
    created_at: new Date(),
    updated_at: new Date(),
  });

  const savedUser = await user.save();
  return savedUser;
};

export const generateMockJwt = (user: any) => {
  const payload = { id: user._id, email: user.email };
  const secret = process.env.JWT_SECRET || 'test-secret';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};
