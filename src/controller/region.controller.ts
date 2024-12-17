import { Request, Response } from 'express';
import { RegionService } from '../service/region.service';
import { STATUS } from '../utils/status';
import { AppError } from '../utils/errors';
import { logger } from '../service/logger.service';

export class RegionController {
  constructor(private regionService: RegionService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !('id' in req.user)) {
        throw new AppError('User is not authenticated', STATUS.UNAUTHORIZED);
      }

      const createRegionDto = {
        ...req.body,
        user: req.user.id,
      };

      const region = await this.regionService.create(createRegionDto);
      logger.info('User created successfully', { region: region.id });
      res.status(STATUS.CREATED).json(region);
    } catch (error: any) {
      logger.error('Failed to create Regions', { error: error });
      const status = error.statusCode || STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal Server Error';
      res.status(status).json({ error: message });
    }
  }

  async listContainingPoint(req: Request, res: Response): Promise<void> {
    try {
      const { lng, lat } = req.query;

      const lngNum = parseFloat(lng as string);
      const latNum = parseFloat(lat as string);

      const regions = await this.regionService.listRegionsContainingPoint(
        lngNum,
        latNum,
      );
      res.status(STATUS.OK).json(regions);
    } catch (error: any) {
      logger.error('Failed to list regions containing point', { error: error });
      const status = error.statusCode || STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal Server Error';
      res.status(status).json({ error: message });
    }
  }

  async listNearPoint(req: Request, res: Response): Promise<void> {
    try {
      const { lng, lat, km, excludeUserId } = req.query;
      const lngNum = parseFloat(lng as string);
      const latNum = parseFloat(lat as string);
      const kmNum = parseFloat(km as string);

      const regions = await this.regionService.listRegionsNearPoint(
        lngNum,
        latNum,
        kmNum,
        excludeUserId as string,
      );
      res.status(STATUS.OK).json(regions);
    } catch (error: any) {
      logger.error('Failed to list regions near a point', { error: error });
      const status = error.statusCode || STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal Server Error';
      res.status(status).json({ error: message });
    }
  }
}
