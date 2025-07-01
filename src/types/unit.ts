// types/unit.ts - Types unités (simplifié pour MVP)
import { z } from 'zod';

export const unitTypeSchema = z.enum([
  'swordsman',
  'spearman', 
  'archer',
]);

export type UnitType = z.infer<typeof unitTypeSchema>;