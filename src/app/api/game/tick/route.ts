// src/app/api/game/tick/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getBuildingConfig } from '@/lib/constants/buildings';

export async function POST() {
  try {
    const now = new Date();

    // 1. Finaliser les constructions terminées
    const completedBuildings = await db.buildingQueue.findMany({
      where: {
        status: 'in_progress',
        completesAt: {
          lte: now,
        },
      },
    });

    console.log(`Finalisation de ${completedBuildings.length} constructions`);

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
        await updateCityProductionInTransaction(buildingQueue.cityId, tx);
      });
    }

    // 2. Mettre à jour les ressources de toutes les cités actives
    const cities = await db.city.findMany({
      select: {
        id: true,
        wood: true,
        stone: true,
        silver: true,
        woodProduction: true,
        stoneProduction: true,
        silverProduction: true,
        lastResourceUpdate: true,
      },
    });

    console.log(`Mise à jour des ressources pour ${cities.length} cités`);

    for (const city of cities) {
      const lastUpdate = new Date(city.lastResourceUpdate);
      const timeDiffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (timeDiffHours > 0.01) { // Plus de 36 secondes
        const newWood = Math.floor(city.wood + (city.woodProduction * timeDiffHours));
        const newStone = Math.floor(city.stone + (city.stoneProduction * timeDiffHours));
        const newSilver = Math.floor(city.silver + (city.silverProduction * timeDiffHours));

        await db.city.update({
          where: { id: city.id },
          data: {
            wood: newWood,
            stone: newStone,
            silver: newSilver,
            lastResourceUpdate: now,
          },
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: {
        buildings: completedBuildings.length,
        cities: cities.length,
      },
      timestamp: now.toISOString(),
    });

  } catch (error) {
    console.error('Erreur lors du tick de jeu:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}

async function updateCityProductionInTransaction(cityId: string, tx: any) {
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