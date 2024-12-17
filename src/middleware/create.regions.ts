import { NextFunction, Request, Response } from 'express';
import { STATUS } from '../utils/status';
import { createRegionSchema } from '../validation/regions.validation';

export const validateCreateRegions = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const region = createRegionSchema.strip().safeParse(req.body);

  if (!region.success) {
    res.status(STATUS.BAD_REQUEST).json({
      error: region.error.errors.map((err) => err.message),
    });
    return;
  }
  req.body = region.data;
  next();
};
