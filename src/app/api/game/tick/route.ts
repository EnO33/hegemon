// src/app/api/game/tick/route.ts (version corrigée avec debug)
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getBuildingConfig } from '@/lib/constants/buildings';

export async function POST() {
  try {
    const now = new Date();
    console.log(`🎮 Tick de jeu démarré à ${now.toISOString()}`);

    // 1. Finaliser les constructions terminées
    const completedBuildings = await db.buildingQueue.findMany({
      where: {
        status: 'in_progress',
        completesAt: {
          lte: now,
        },
      },
      include: {
        city: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`🔍 Trouvé ${completedBuildings.length} constructions à finaliser:`);
    completedBuildings.forEach(building => {
      console.log(`  - ${building.buildingType} dans ${building.city.name} (terminé à ${building.completesAt})`);
    });

    // Traiter chaque construction terminée
    for (const buildingQueue of completedBuildings) {
      console.log(`⚡ Finalisation de ${buildingQueue.buildingType} dans ${buildingQueue.city.name}`);
      
      try {
        await db.$transaction(async (tx) => {
          if (buildingQueue.action === 'build') {
            // Créer le nouveau bâtiment
            const newBuilding = await tx.building.create({
              data: {
                type: buildingQueue.buildingType,
                level: 1,
                cityId: buildingQueue.cityId,
              },
            });
            console.log(`✅ Bâtiment ${buildingQueue.buildingType} créé avec l'ID ${newBuilding.id}`);
          } else if (buildingQueue.action === 'upgrade') {
            // Améliorer le bâtiment existant
            const updatedBuilding = await tx.building.updateMany({
              where: {
                cityId: buildingQueue.cityId,
                type: buildingQueue.buildingType,
              },
              data: {
                level: buildingQueue.targetLevel,
              },
            });
            console.log(`📈 Bâtiment ${buildingQueue.buildingType} amélioré au niveau ${buildingQueue.targetLevel} (${updatedBuilding.count} bâtiment(s) modifié(s))`);
          }

          // Marquer la queue comme terminée
          await tx.buildingQueue.update({
            where: { id: buildingQueue.id },
            data: { 
              status: 'completed',
              completesAt: now, // S'assurer que la date est cohérente
            },
          });
          console.log(`✅ Queue ${buildingQueue.id} marquée comme terminée`);

          // Mettre à jour la production de la cité
          await updateCityProductionInTransaction(buildingQueue.cityId, tx);
          console.log(`📊 Production mise à jour pour la cité ${buildingQueue.cityId}`);

          // Démarrer la construction suivante en attente pour cette cité
          await startNextQueuedBuilding(buildingQueue.cityId, tx);
        });
      } catch (error) {
        console.error(`❌ Erreur lors de la finalisation de ${buildingQueue.buildingType}:`, error);
        // Continuer avec les autres constructions même si une échoue
      }
    }

    // 2. Mettre à jour les ressources de toutes les cités actives
    const cities = await db.city.findMany({
      select: {
        id: true,
        name: true,
        wood: true,
        stone: true,
        silver: true,
        woodProduction: true,
        stoneProduction: true,
        silverProduction: true,
        lastResourceUpdate: true,
      },
    });

    console.log(`💰 Mise à jour des ressources pour ${cities.length} cités`);

    let updatedCitiesCount = 0;
    for (const city of cities) {
      const lastUpdate = new Date(city.lastResourceUpdate);
      const timeDiffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (timeDiffHours > 0.01) { // Plus de 36 secondes
        const newWood = Math.min(999999999, Math.floor(city.wood + (city.woodProduction * timeDiffHours)));
        const newStone = Math.min(999999999, Math.floor(city.stone + (city.stoneProduction * timeDiffHours)));
        const newSilver = Math.min(999999999, Math.floor(city.silver + (city.silverProduction * timeDiffHours)));

        await db.city.update({
          where: { id: city.id },
          data: {
            wood: newWood,
            stone: newStone,
            silver: newSilver,
            lastResourceUpdate: now,
          },
        });
        updatedCitiesCount++;
      }
    }

    console.log(`✅ Tick terminé - ${completedBuildings.length} constructions finalisées, ${updatedCitiesCount} cités mises à jour`);

    return NextResponse.json({ 
      success: true, 
      processed: {
        buildings: completedBuildings.length,
        cities: updatedCitiesCount,
      },
      timestamp: now.toISOString(),
      debug: {
        completedBuildings: completedBuildings.map(b => ({
          id: b.id,
          type: b.buildingType,
          action: b.action,
          cityName: b.city.name,
          completesAt: b.completesAt,
        })),
      }
    });

  } catch (error) {
    console.error('❌ Erreur critique lors du tick de jeu:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Démarrer la construction suivante en attente
async function startNextQueuedBuilding(cityId: string, tx: any) {
  // Trouver la prochaine construction en attente pour cette cité
  const nextBuilding = await tx.buildingQueue.findFirst({
    where: {
      cityId,
      status: 'pending'
    },
    orderBy: {
      startedAt: 'asc' // Le plus ancien en premier
    }
  });

  if (nextBuilding) {
    const now = new Date();
    const newCompletesAt = new Date(now.getTime() + nextBuilding.duration * 1000);
    
    // Démarrer cette construction
    await tx.buildingQueue.update({
      where: { id: nextBuilding.id },
      data: {
        status: 'in_progress',
        startedAt: now,
        completesAt: newCompletesAt,
      },
    });

    console.log(`🚀 Construction suivante démarrée: ${nextBuilding.buildingType} (ID: ${nextBuilding.id}) dans la cité ${cityId}`);
    console.log(`   ⏰ Démarrage: ${now.toISOString()}, Fin prévue: ${newCompletesAt.toISOString()}`);
  } else {
    console.log(`ℹ️ Aucune construction en attente pour la cité ${cityId}`);
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

  console.log(`📈 Production mise à jour pour ${city.name}: Bois +${woodProduction}/h, Pierre +${stoneProduction}/h, Argent +${silverProduction}/h`);
}