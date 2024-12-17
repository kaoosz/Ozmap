import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { STATUS } from '../utils/status';

export const ValidateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(STATUS.BAD_REQUEST).json({
        error: result.error.errors.map((err) => err.message),
      });
      return;
    }
    req.query = result.data;
    next();
  };
};
