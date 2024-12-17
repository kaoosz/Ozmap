import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS } from '../utils/status';

export const jwtAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(STATUS.UNAUTHORIZED).json({
      message: 'Authorization header is missing or invalid',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    if (typeof decoded === 'object' && 'id' in decoded) {
      req.user = decoded as Express.User;
      next();
    } else {
      res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: 'Invalid or expired token' });
    }
  } catch (err: any) {
    res
      .status(STATUS.UNAUTHORIZED)
      .json({ message: 'Invalid or expired token' });
  }
};
