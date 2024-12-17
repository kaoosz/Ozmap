import { Router } from 'express';
import { RegionRepository } from '../repository/region.repository';
import { RegionService } from '../service/region.service';
import { RegionController } from '../controller/region.controller';
import { validateCreateRegions } from '../middleware/create.regions';
import { ValidateQuery } from '../middleware/query.regions';
import { nearPointSchema, pointSchema } from '../validation/regions.validation';
import { jwtAuthentication } from '../middleware/jwt.authenticate';

const router = Router();

const regionRepository = new RegionRepository();
const regionService = new RegionService(regionRepository);
const regionController = new RegionController(regionService);

router.post('/regions', validateCreateRegions, jwtAuthentication, (req, res) =>
  regionController.create(req, res),
);

router.get('/regions/contains', ValidateQuery(pointSchema), (req, res) =>
  regionController.listContainingPoint(req, res),
);

router.get('/regions/near', ValidateQuery(nearPointSchema), (req, res) =>
  regionController.listNearPoint(req, res),
);

export default router;
