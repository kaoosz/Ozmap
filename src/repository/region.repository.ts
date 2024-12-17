import { Types } from 'mongoose';
import { IRegionRepository } from '../interfaces/IRegion.repository';
import { IRegion, RegionQuery } from '../models/IRegion.interface';
import { RegionModel } from '../models/region.model';

export class RegionRepository implements IRegionRepository {
  async create(data: Partial<IRegion>): Promise<IRegion> {
    const region = new RegionModel(data);
    const regionData = await region.save();
    return regionData.toObject<IRegion>();
  }

  async findRegionsNearPoint(
    point: [number, number],
    kilometer: number,
    user?: string,
  ): Promise<IRegion[]> {
    const radius = (kilometer * 1000) / 6378137; // transform in kilometers.
    let query: RegionQuery = {
      geometry: {
        $geoWithin: {
          $centerSphere: [[point[0], point[1]], radius],
        },
      },
    };
    if (user) {
      query.user = new Types.ObjectId(user);
    }
    const findRegions = await RegionModel.find(query).lean<IRegion[]>();
    return findRegions;
  }

  async findRegionsContainingPoint(
    point: [number, number],
  ): Promise<IRegion[]> {
    const findRegions = await RegionModel.find({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: point,
          },
        },
      },
    }).lean<IRegion[]>();
    return findRegions;
  }
}
