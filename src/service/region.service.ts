import { CreateRegionDto, RegionDto } from '../dto/create.region.dto';
import { IRegionRepository } from '../interfaces/IRegion.repository';
import { IRegion } from '../models/IRegion.interface';

export class RegionService {
  constructor(private regionRepository: IRegionRepository) {}

  async create(createRegionDto: CreateRegionDto): Promise<RegionDto> {
    const region: Partial<IRegion> = {
      name: createRegionDto.name,
      geometry: createRegionDto.geometry,
      user: createRegionDto.user,
      created_at: new Date(),
    };

    const createRegion = await this.regionRepository.create(region);
    const resulz = this.mapToRegionDto(createRegion, true);
    return resulz;
  }

  async listRegionsContainingPoint(
    lng: number,
    lat: number,
  ): Promise<RegionDto[]> {
    const regions = await this.regionRepository.findRegionsContainingPoint([
      lng,
      lat,
    ]);
    return regions.map((region) => this.mapToRegionDto(region, false));
  }

  async listRegionsNearPoint(
    lng: number,
    lat: number,
    km: number,
    excludeUserId?: string,
  ): Promise<RegionDto[]> {
    const regions = await this.regionRepository.findRegionsNearPoint(
      [lng, lat],
      km,
      excludeUserId,
    );
    return regions.map((region) => this.mapToRegionDto(region, false));
  }

  private mapToRegionDto(region: IRegion, excludeUpdatedAt = false): RegionDto {
    const regionDto: RegionDto = {
      id: region._id.toString(),
      name: region.name,
      geometry: region.geometry,
      user: region.user.toString(),
      created_at: region.created_at || new Date(),
      updated_at: region.updated_at,
    };

    if (excludeUpdatedAt) {
      delete regionDto.updated_at;
    }

    return regionDto;
  }
}
