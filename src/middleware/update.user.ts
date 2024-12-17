import { NextFunction, Request, Response } from 'express';
import { userSchema } from '../validation/user.validation';

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parsed = userSchema
    .partial()
    .strip()
    .refine(
      (data) => {
        if (!data.address && !data.coordinates) return true;
        return (
          (data.address && !data.coordinates) ||
          (!data.address && data.coordinates)
        );
      },
      {
        message: 'Provide either address or coordinates, but not both.',
      },
    )
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.errors.map((err) => err.message),
    });
    return;
  }
  if (Object.keys(parsed.data).length == 0) {
    res.status(400).json({
      error: 'you most provide some field to update',
    });
    return;
  }
  req.body = parsed.data;
  next();
};
