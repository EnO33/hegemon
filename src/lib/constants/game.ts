// lib/constants/game.ts
export const GAME_CONFIG = {
  MAX_CITIES_PER_PLAYER: 10,
  RESOURCE_PRODUCTION_INTERVAL: 60000, // 1 minute
  BUILDING_UPGRADE_MULTIPLIER: 1.26,
  WORLD_SIZE: {
    WIDTH: 1000,
    HEIGHT: 1000,
  },
} as const;

export const RESOURCE_TYPES = ['wood', 'stone', 'silver', 'population'] as const;

export const BUILDING_CATEGORIES = {
  ESSENTIAL: 'essential',
  PRODUCTION: 'production', 
  MILITARY: 'military',
  DEFENSIVE: 'defensive',
} as const;