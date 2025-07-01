import { getBuildingConfig } from "@/lib/constants";
import { db } from "@/lib/db";

// src/actions/building/complete-buildings.ts
export async function completeBuildings() {
  try {
    const now = new Date();

    // Trouver toutes les constructions terminées
    const completedBuildings = await db.buildingQueue.findMany({
      where: {
        status: 'in_progress',
        completesAt: {
          lte: now,
        },
      },
    });

    for (const buildingQueue of completedBuildings) {
      await db.$transaction(async (tx) => {
        if (buildingQueue.action === 'build') {
          // Créer le nouveau bâtiment
          await tx.building.create({
            data: {
              type: buildingQueue.buildingType,
              level: 1,
              cityId: buildingQueue.cityId,
            },
          });
        } else if (buildingQueue.action === 'upgrade') {
          // Améliorer le bâtiment existant
          await tx.building.updateMany({
            where: {
              cityId: buildingQueue.cityId,
              type: buildingQueue.buildingType,
            },
            data: {
              level: buildingQueue.targetLevel,
            },
          });
        }

        // Marquer la queue comme terminée
        await tx.buildingQueue.update({
          where: { id: buildingQueue.id },
          data: { status: 'completed' },
        });

        // Mettre à jour la production de la cité
        await updateCityProduction(buildingQueue.cityId, tx);
      });
    }

    return {
      success: true,
      completed: completedBuildings.length,
    };

  } catch (error) {
    console.error('Erreur completeBuildings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

async function updateCityProduction(cityId: string, tx: any) {
  const city = await tx.city.findUnique({
    where: { id: cityId },
    include: { buildings: true },
  });

  if (!city) return;

  let woodProduction = 0;
  let stoneProduction = 0;
  let silverProduction = 0;
  let populationCapacity = 100; // Base

  city.buildings.forEach((building: any) => {
    const config = getBuildingConfig(building.type);
    if (!config) return;

    config.effects.forEach(effect => {
      const value = Math.floor(effect.value * Math.pow(1.2, building.level - 1));
      
      switch (effect.type) {
        case 'resource_production':
          if (effect.resourceType === 'wood') woodProduction += value;
          if (effect.resourceType === 'stone') stoneProduction += value;
          if (effect.resourceType === 'silver') silverProduction += value;
          break;
        case 'population_increase':
          populationCapacity += value;
          break;
      }
    });
  });

  await tx.city.update({
    where: { id: cityId },
    data: {
      woodProduction,
      stoneProduction,
      silverProduction,
      populationCapacity,
    },
  });
}