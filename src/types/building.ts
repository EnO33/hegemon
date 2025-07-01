// types/building.ts - Types bâtiments
import { z } from 'zod';

export const buildingTypeSchema = z.enum([
  'senate',
  'timber_camp',
  'quarry', 
  'silver_mine',
  'farm',
  'barracks',
  'harbor',
  'academy',
  'temple',
  'wall',
  'warehouse',
]);

export type BuildingType = z.infer<typeof buildingTypeSchema>;

export const buildingSchema = z.object({
  id: z.string().uuid(),
  type: buildingTypeSchema,
  level: z.number().int().min(1),
  cityId: z.string().uuid(),
  isUpgrading: z.boolean().default(false),
  upgradeCompletesAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Building = z.infer<typeof buildingSchema>;