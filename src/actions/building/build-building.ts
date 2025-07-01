// src/actions/building/build-building.ts (version file d'attente séquentielle)
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db, updateCityResources } from '@/lib/db';
import { getBuildingConfig, calculateBuildingCost, calculateConstructionTime } from '@/lib/constants/buildings';
import { z } from 'zod';
import type { BuildingType } from '@/types/building';

const buildBuildingSchema = z.object({
  buildingType: z.string(),
  cityId: z.string().uuid(),
});

// Configuration : nombre maximum de constructions en queue
const MAX_BUILDING_QUEUE = 2;

export async function buildBuilding(data: unknown) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      throw new Error('Non authentifié');
    }

    const validatedData = buildBuildingSchema.parse(data);
    const { buildingType, cityId } = validatedData;

    // Récupérer l'utilisateur et vérifier qu'il possède la cité
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const city = await db.city.findFirst({
      where: {
        id: cityId,
        userId: user.id,
      },
      include: {
        buildings: true,
        buildingQueue: {
          where: {
            status: { in: ['in_progress', 'pending'] }
          },
          orderBy: {
            startedAt: 'asc'
          }
        }
      },
    });

    if (!city) {
      throw new Error('Cité non trouvée');
    }

    // Vérifier que le bâtiment n'existe pas déjà
    const existingBuilding = city.buildings.find(b => b.type === buildingType);
    if (existingBuilding) {
      throw new Error('Ce bâtiment existe déjà dans cette cité');
    }

    // Vérifier qu'il n'y a pas déjà une construction/amélioration de ce type en cours
    const existingQueueForType = city.buildingQueue.find(q => q.buildingType === buildingType);
    if (existingQueueForType) {
      throw new Error('Une construction/amélioration de ce bâtiment est déjà en queue');
    }

    // Vérifier le nombre de constructions en queue
    if (city.buildingQueue.length >= MAX_BUILDING_QUEUE) {
      throw new Error(`Maximum ${MAX_BUILDING_QUEUE} constructions en queue autorisées`);
    }

    // Récupérer la configuration du bâtiment
    const buildingConfig = getBuildingConfig(buildingType as BuildingType);
    if (!buildingConfig) {
      throw new Error('Type de bâtiment invalide');
    }

    // Vérifier les prérequis
    for (const requirement of buildingConfig.requirements) {
      const requiredBuilding = city.buildings.find(b => b.type === requirement.buildingType);
      if (!requiredBuilding || requiredBuilding.level < requirement.level) {
        throw new Error(`Prérequis non rempli: ${requirement.buildingType} niveau ${requirement.level}`);
      }
    }

    // Calculer les coûts
    const cost = calculateBuildingCost(buildingConfig, 1);
    const constructionTime = calculateConstructionTime(buildingConfig, 1);

    // Vérifier les ressources
    if (city.wood < cost.wood || city.stone < cost.stone || city.silver < cost.silver) {
      throw new Error('Ressources insuffisantes');
    }

    const now = new Date();
    
    // Calculer quand cette construction peut commencer
    let startTime = now;
    let status = 'in_progress';
    
    // Si il y a déjà une construction en cours, cette nouvelle construction doit attendre
    const activeConstruction = city.buildingQueue.find(q => q.status === 'in_progress');
    if (activeConstruction) {
      startTime = new Date(activeConstruction.completesAt);
      status = 'pending';
    }
    
    const completesAt = new Date(startTime.getTime() + constructionTime * 1000);

    // Transaction pour créer la queue et déduire les ressources
    const result = await db.$transaction(async (tx) => {
      // Déduire les ressources immédiatement
      await tx.city.update({
        where: { id: cityId },
        data: {
          wood: city.wood - cost.wood,
          stone: city.stone - cost.stone,
          silver: city.silver - cost.silver,
        },
      });

      // Créer la queue de construction
      const buildingQueue = await tx.buildingQueue.create({
        data: {
          cityId,
          buildingType,
          action: 'build',
          targetLevel: 1,
          woodCost: cost.wood,
          stoneCost: cost.stone,
          silverCost: cost.silver,
          duration: constructionTime,
          startedAt: startTime,
          completesAt,
          status,
        },
      });

      return buildingQueue;
    });

    // Revalider les chemins
    revalidatePath('/city');
    revalidatePath(`/city/${cityId}`);

    const queuePosition = city.buildingQueue.length + 1;
    const statusText = status === 'pending' ? 
      ` (Position ${queuePosition} - démarrera quand la construction précédente sera terminée)` : 
      ` (Construction démarrée immédiatement)`;

    return {
      success: true,
      data: result,
      message: `Construction de ${buildingConfig.name} ajoutée à la queue !${statusText}`,
    };

  } catch (error) {
    console.error('Erreur buildBuilding:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

export async function upgradeBuilding(data: unknown) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      throw new Error('Non authentifié');
    }

    const upgradeBuildingSchema = z.object({
      buildingId: z.string().uuid(),
      cityId: z.string().uuid(),
    });

    const validatedData = upgradeBuildingSchema.parse(data);
    const { buildingId, cityId } = validatedData;

    // Récupérer l'utilisateur
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const city = await db.city.findFirst({
      where: {
        id: cityId,
        userId: user.id,
      },
      include: {
        buildings: true,
        buildingQueue: {
          where: {
            status: { in: ['in_progress', 'pending'] }
          },
          orderBy: {
            startedAt: 'asc'
          }
        }
      },
    });

    if (!city) {
      throw new Error('Cité non trouvée');
    }

    const building = city.buildings.find(b => b.id === buildingId);
    if (!building) {
      throw new Error('Bâtiment non trouvé');
    }

    // Vérifier qu'il n'y a pas déjà une amélioration de ce bâtiment en cours
    const existingQueueForType = city.buildingQueue.find(q => 
      q.buildingType === building.type && q.action === 'upgrade'
    );
    if (existingQueueForType) {
      throw new Error('Une amélioration de ce bâtiment est déjà en queue');
    }

    // Vérifier le nombre de constructions en queue
    if (city.buildingQueue.length >= MAX_BUILDING_QUEUE) {
      throw new Error(`Maximum ${MAX_BUILDING_QUEUE} constructions en queue autorisées`);
    }

    // Récupérer la configuration du bâtiment
    const buildingConfig = getBuildingConfig(building.type as BuildingType);
    if (!buildingConfig) {
      throw new Error('Configuration de bâtiment introuvable');
    }

    // Vérifier le niveau maximum
    if (building.level >= buildingConfig.maxLevel) {
      throw new Error('Niveau maximum atteint');
    }

    // Calculer les coûts pour le niveau suivant
    const nextLevel = building.level + 1;
    const cost = calculateBuildingCost(buildingConfig, nextLevel);
    const constructionTime = calculateConstructionTime(buildingConfig, nextLevel);

    // Vérifier les ressources
    if (city.wood < cost.wood || city.stone < cost.stone || city.silver < cost.silver) {
      throw new Error('Ressources insuffisantes');
    }

    const now = new Date();
    
    // Calculer quand cette amélioration peut commencer
    let startTime = now;
    let status = 'in_progress';
    
    // Si il y a déjà une construction en cours, cette amélioration doit attendre
    const activeConstruction = city.buildingQueue.find(q => q.status === 'in_progress');
    if (activeConstruction) {
      startTime = new Date(activeConstruction.completesAt);
      status = 'pending';
    }
    
    const completesAt = new Date(startTime.getTime() + constructionTime * 1000);

    // Transaction
    const result = await db.$transaction(async (tx) => {
      // Déduire les ressources immédiatement
      await tx.city.update({
        where: { id: cityId },
        data: {
          wood: city.wood - cost.wood,
          stone: city.stone - cost.stone,
          silver: city.silver - cost.silver,
        },
      });

      // Créer la queue d'amélioration
      const buildingQueue = await tx.buildingQueue.create({
        data: {
          cityId,
          buildingType: building.type,
          action: 'upgrade',
          targetLevel: nextLevel,
          woodCost: cost.wood,
          stoneCost: cost.stone,
          silverCost: cost.silver,
          duration: constructionTime,
          startedAt: startTime,
          completesAt,
          status,
        },
      });

      return buildingQueue;
    });

    revalidatePath('/city');
    revalidatePath(`/city/${cityId}`);

    const queuePosition = city.buildingQueue.length + 1;
    const statusText = status === 'pending' ? 
      ` (Position ${queuePosition} - démarrera quand la construction précédente sera terminée)` : 
      ` (Amélioration démarrée immédiatement)`;

    return {
      success: true,
      data: result,
      message: `Amélioration de ${buildingConfig.name} vers le niveau ${nextLevel} ajoutée à la queue !${statusText}`,
    };

  } catch (error) {
    console.error('Erreur upgradeBuilding:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}