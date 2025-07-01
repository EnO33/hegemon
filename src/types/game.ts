// types/game.ts - Types généraux du jeu
import { z } from 'zod';

// Coordonnées monde
export const coordinatesSchema = z.object({
  x: z.number().int().min(0).max(1000),
  y: z.number().int().min(0).max(1000),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;

// Ressources
export const resourcesSchema = z.object({
  wood: z.number().int().min(0),
  stone: z.number().int().min(0),
  silver: z.number().int().min(0),
  population: z.number().int().min(0),
  populationUsed: z.number().int().min(0),
});

export type Resources = z.infer<typeof resourcesSchema>;

// Production de ressources
export const productionSchema = z.object({
  wood: z.number().min(0),
  stone: z.number().min(0),
  silver: z.number().min(0),
  population: z.number().int().min(0),
});

export type Production = z.infer<typeof productionSchema>;