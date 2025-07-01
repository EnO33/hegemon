// lib/constants/buildings.ts
import { BuildingType } from '@/types';
import { BUILDING_CATEGORIES, GAME_CONFIG } from '.';

interface BuildingConfig {
  type: BuildingType;
  name: string;
  description: string;
  category: string;
  maxLevel: number;
  baseCost: {
    wood: number;
    stone: number;
    silver: number;
  };
  baseConstructionTime: number; // secondes
  requirements: Array<{
    buildingType: BuildingType;
    level: number;
  }>;
  effects: Array<{
    type: 'resource_production' | 'population_increase' | 'storage_increase';
    value: number;
    resourceType?: 'wood' | 'stone' | 'silver' | 'population';
  }>;
}

export const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig> = {
  senate: {
    type: 'senate',
    name: 'Sénat',
    description: 'Centre administratif de votre cité. Requis pour tous les autres bâtiments.',
    category: BUILDING_CATEGORIES.ESSENTIAL,
    maxLevel: 30,
    baseCost: { wood: 150, stone: 200, silver: 0 },
    baseConstructionTime: 600, // 10 minutes
    requirements: [],
    effects: [
      { type: 'population_increase', value: 10 }
    ],
  },
  timber_camp: {
    type: 'timber_camp',
    name: 'Camp de bûcherons',
    description: 'Produit du bois, ressource essentielle pour la construction.',
    category: BUILDING_CATEGORIES.PRODUCTION,
    maxLevel: 40,
    baseCost: { wood: 100, stone: 50, silver: 0 },
    baseConstructionTime: 300, // 5 minutes
    requirements: [{ buildingType: 'senate', level: 1 }],
    effects: [
      { type: 'resource_production', value: 100, resourceType: 'wood' }
    ],
  },
  quarry: {
    type: 'quarry',
    name: 'Carrière de pierre',
    description: 'Produit de la pierre pour les bâtiments défensifs.',
    category: BUILDING_CATEGORIES.PRODUCTION,
    maxLevel: 40,
    baseCost: { wood: 80, stone: 120, silver: 0 },
    baseConstructionTime: 300,
    requirements: [{ buildingType: 'senate', level: 1 }],
    effects: [
      { type: 'resource_production', value: 80, resourceType: 'stone' }
    ],
  },
  silver_mine: {
    type: 'silver_mine',
    name: 'Mine d\'argent',
    description: 'Produit de l\'argent pour recruter des unités.',
    category: BUILDING_CATEGORIES.PRODUCTION,
    maxLevel: 40,
    baseCost: { wood: 150, stone: 100, silver: 0 },
    baseConstructionTime: 450,
    requirements: [{ buildingType: 'senate', level: 2 }],
    effects: [
      { type: 'resource_production', value: 50, resourceType: 'silver' }
    ],
  },
  farm: {
    type: 'farm',
    name: 'Ferme',
    description: 'Augmente la population disponible pour recruter des unités.',
    category: BUILDING_CATEGORIES.PRODUCTION,
    maxLevel: 45,
    baseCost: { wood: 200, stone: 150, silver: 0 },
    baseConstructionTime: 480,
    requirements: [{ buildingType: 'senate', level: 1 }],
    effects: [
      { type: 'population_increase', value: 50 }
    ],
  },
  barracks: {
    type: 'barracks',
    name: 'Caserne',
    description: 'Permet de recruter des unités d\'infanterie.',
    category: BUILDING_CATEGORIES.MILITARY,
    maxLevel: 25,
    baseCost: { wood: 300, stone: 400, silver: 100 },
    baseConstructionTime: 900, // 15 minutes
    requirements: [{ buildingType: 'senate', level: 3 }],
    effects: [],
  },
  harbor: {
    type: 'harbor',
    name: 'Port',
    description: 'Permet de construire des navires et d\'explorer les océans.',
    category: BUILDING_CATEGORIES.MILITARY,
    maxLevel: 20,
    baseCost: { wood: 500, stone: 300, silver: 200 },
    baseConstructionTime: 1200, // 20 minutes
    requirements: [{ buildingType: 'senate', level: 5 }],
    effects: [],
  },
  academy: {
    type: 'academy',
    name: 'Académie',
    description: 'Centre de recherche pour débloquer de nouvelles technologies.',
    category: BUILDING_CATEGORIES.ESSENTIAL,
    maxLevel: 30,
    baseCost: { wood: 400, stone: 500, silver: 300 },
    baseConstructionTime: 1800, // 30 minutes
    requirements: [{ buildingType: 'senate', level: 8 }],
    effects: [],
  },
  temple: {
    type: 'temple',
    name: 'Temple',
    description: 'Permet d\'invoquer les pouvoirs des dieux.',
    category: BUILDING_CATEGORIES.ESSENTIAL,
    maxLevel: 25,
    baseCost: { wood: 600, stone: 800, silver: 500 },
    baseConstructionTime: 2400, // 40 minutes
    requirements: [{ buildingType: 'academy', level: 1 }],
    effects: [],
  },
  wall: {
    type: 'wall',
    name: 'Muraille',
    description: 'Protège votre cité contre les attaques ennemies.',
    category: BUILDING_CATEGORIES.DEFENSIVE,
    maxLevel: 25,
    baseCost: { wood: 200, stone: 500, silver: 0 },
    baseConstructionTime: 900,
    requirements: [{ buildingType: 'senate', level: 5 }],
    effects: [],
  },
  warehouse: {
    type: 'warehouse',
    name: 'Entrepôt',
    description: 'Augmente la capacité de stockage des ressources.',
    category: BUILDING_CATEGORIES.PRODUCTION,
    maxLevel: 30,
    baseCost: { wood: 300, stone: 200, silver: 0 },
    baseConstructionTime: 600,
    requirements: [{ buildingType: 'senate', level: 2 }],
    effects: [
      { type: 'storage_increase', value: 1000 }
    ],
  },
};

// Fonctions utilitaires pour les bâtiments
export const getBuildingConfig = (type: BuildingType): BuildingConfig => {
  return BUILDING_CONFIGS[type];
};

export const calculateBuildingCost = (
  config: BuildingConfig, 
  level: number
): { wood: number; stone: number; silver: number } => {
  const multiplier = Math.pow(GAME_CONFIG.BUILDING_UPGRADE_MULTIPLIER, level - 1);
  return {
    wood: Math.floor(config.baseCost.wood * multiplier),
    stone: Math.floor(config.baseCost.stone * multiplier),
    silver: Math.floor(config.baseCost.silver * multiplier),
  };
};

export const calculateConstructionTime = (
  config: BuildingConfig,
  level: number
): number => {
  const multiplier = Math.pow(GAME_CONFIG.BUILDING_UPGRADE_MULTIPLIER, level - 1);
  return Math.floor(config.baseConstructionTime * multiplier);
};