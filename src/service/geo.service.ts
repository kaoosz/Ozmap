import { GeoApiService } from './external/geo.api.service';

export class GeoLib {
  constructor(private geoApiService: GeoApiService = new GeoApiService()) {}

  public async getAddressFromCoordinates(
    coordinates: [number, number],
  ): Promise<string> {
    return this.geoApiService.getAddressFromCoordinates(coordinates);
  }

  public async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    return this.geoApiService.getCoordinatesFromAddress(address);
  }
}
