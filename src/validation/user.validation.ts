import { z } from 'zod';
import { invalidTypeMessage, requiredMessage } from './validation.functions';

export const userSchema = z.object({
  name: z.string({
    required_error: requiredMessage('name'),
    invalid_type_error: invalidTypeMessage('name', 'string'),
  }),
  email: z
    .string({
      required_error: requiredMessage('email'),
      invalid_type_error: invalidTypeMessage('email', 'email'),
    })
    .email('invalid email format'),
  address: z.string().optional(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  password: z.string({
    required_error: requiredMessage('password'),
    invalid_type_error: invalidTypeMessage('password', 'string'),
  }),
});
