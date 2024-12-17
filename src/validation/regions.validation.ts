import { z } from 'zod';
import { invalidTypeMessage, requiredMessage } from './validation.functions';

export const coordinatePairSchema = z.tuple([z.number(), z.number()]);

export const ringSchema = z.array(coordinatePairSchema).min(4);

const polygonCoordinatesSchema = z
  .array(ringSchema)
  .min(1)
  .refine((rings) => {
    return rings.every((ring) => {
      const first = ring[0];
      const last = ring[ring.length - 1];
      return first[0] === last[0] && first[1] === last[1];
    });
  }, `Each linear ring must start and end with the same coordinate pair`);

export const geometrySchema = z.object({
  type: z.literal('Polygon', {
    message: 'Value of Type always should be defined Polygon',
  }),
  coordinates: polygonCoordinatesSchema,
});

export const createRegionSchema = z.object({
  name: z.string({
    required_error: requiredMessage('name'),
    invalid_type_error: invalidTypeMessage('name', 'string'),
  }),
  geometry: geometrySchema,
});

export const pointSchema = z.object({
  lng: z
    .string({
      required_error: requiredMessage('lng'),
      invalid_type_error: invalidTypeMessage('lng', 'number'),
    })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'lng must be a valid number',
    }),
  lat: z
    .string({
      required_error: requiredMessage('lat'),
      invalid_type_error: invalidTypeMessage('lat', 'number'),
    })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'lat must be a valid number',
    }),
});

export const nearPointSchema = z.object({
  lng: z
    .string({
      required_error: requiredMessage('lng'),
      invalid_type_error: invalidTypeMessage('lng', 'number'),
    })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'lng must be a valid number',
    }),
  lat: z
    .string({
      required_error: requiredMessage('lat'),
      invalid_type_error: invalidTypeMessage('lat', 'number'),
    })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'lat must be a valid number',
    }),
  km: z
    .string({
      required_error: requiredMessage('km'),
      invalid_type_error: invalidTypeMessage('km', 'number'),
    })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'km must be valid integer number not negative numbers',
    }),
  excludeUserId: z.string().optional(),
});
