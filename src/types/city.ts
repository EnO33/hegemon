// types/city.ts - Types cité
import { z } from 'zod';
import { coordinatesSchema, resourcesSchema, productionSchema } from './game';

export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  userId: z.string().uuid(),
  coordinates: coordinatesSchema,
  resources: resourcesSchema,
  production: productionSchema,
  buildings: z.array(z.string().uuid()),
  units: z.array(z.string().uuid()),
  isCapital: z.boolean().default(false),
  points: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastResourceUpdate: z.date(),
});

export type City = z.infer<typeof citySchema>;

// Input création de cité
export const createCitySchema = z.object({
  name: z.string()
    .min(1, 'Nom requis')
    .max(50, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères invalides'),
  coordinates: coordinatesSchema.optional(),
});

export type CreateCityInput = z.infer<typeof createCitySchema>;