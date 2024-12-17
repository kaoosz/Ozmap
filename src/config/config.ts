import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3008;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
export const GEO_API_KEY = process.env.GEO_API_KEY || '';
export const BASE_GEO_API_URL =
  process.env.BASE_GEO_API_URL || 'https://api.geoapify.com/v1/geocode';
