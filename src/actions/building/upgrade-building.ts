import { calculateBuildingCost, calculateConstructionTime, getBuildingConfig } from "@/lib/constants";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// src/actions/building/upgrade-building.ts
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
      },
    });

    if (!city) {
      throw new Error('Cité non trouvée');
    }

    const building = city.buildings.find(b => b.id === buildingId);
    if (!building) {
      throw new Error('Bâtiment non trouvé');
    }

    // Récupérer la configuration du bâtiment
    const buildingConfig = getBuildingConfig(building.type as any);
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

    // Vérifier qu'il n'y a pas déjà une construction en cours
    const existingQueue = await db.buildingQueue.findFirst({
      where: {
        cityId,
        status: 'in_progress',
      },
    });

    if (existingQueue) {
      throw new Error('Une construction est déjà en cours dans cette cité');
    }

    const now = new Date();
    const completesAt = new Date(now.getTime() + constructionTime * 1000);

    // Transaction
    const result = await db.$transaction(async (tx) => {
      // Déduire les ressources
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
          startedAt: now,
          completesAt,
          status: 'in_progress',
        },
      });

      return buildingQueue;
    });

    revalidatePath('/city');
    revalidatePath(`/city/${cityId}`);

    return {
      success: true,
      data: result,
      message: `Amélioration de ${buildingConfig.name} vers le niveau ${nextLevel} commencée !`,
    };

  } catch (error) {
    console.error('Erreur upgradeBuilding:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}