import { IRegion } from '../models/IRegion.interface';

export interface IRegionRepository {
  create(data: any): Promise<IRegion>;
  findRegionsContainingPoint(point: [number, number]): Promise<IRegion[]>;
  findRegionsNearPoint(
    point: [number, number],
    kilometer: number,
    user?: string,
  ): Promise<IRegion[]>;
}
