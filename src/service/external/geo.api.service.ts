import axios from 'axios';
import { BASE_GEO_API_URL, GEO_API_KEY } from '../../config/config';
import { AppError } from '../../utils/errors';
import { STATUS } from '../../utils/status';

export class GeoApiService {
  constructor(
    private baseUrl: string = BASE_GEO_API_URL,
    private apiKey: string = GEO_API_KEY,
  ) {}

  async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    const encodeAddress = encodeURIComponent(address);
    const url = `${this.baseUrl}/search?text=${encodeAddress}&format=json&apiKey=${this.apiKey}`;

    const apiCall = await axios.get(url);
    const data = apiCall.data;

    if (data?.results && data.results.length > 0) {
      const { lat, lon } = data.results[0];
      return { lat, lng: lon };
    }

    throw new AppError('Region not found', STATUS.DEFAULT_ERROR);
  }

  async getAddressFromCoordinates(
    coordinates: [number, number],
  ): Promise<string> {
    const [lng, lat] = coordinates;
    const url = `${this.baseUrl}/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${this.apiKey}`;

    const result = await axios.get(url);
    const data = result.data;

    if (data?.results && data.results.length > 0) {
      return data.results[0].formatted;
    }
    throw new AppError('Region not found', STATUS.DEFAULT_ERROR);
  }
}
