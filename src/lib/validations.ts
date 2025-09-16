import { z } from 'zod';

export const dimensionSchema = z.object({
  width: z.number().min(1).max(160),
  height: z.number().min(10)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^(\+52)?\d{10}$/),
  message: z.string().optional()
});