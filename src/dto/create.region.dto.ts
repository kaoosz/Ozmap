export interface CreateRegionDto {
  name: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  user: string;
}

export interface RegionDto {
  id: string;
  name: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  user: string;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}
