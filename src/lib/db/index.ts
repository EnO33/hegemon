// src/lib/db/index.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// Utilitaires pour la synchronisation des ressources
export const updateCityResources = async (cityId: string) => {
  const city = await db.city.findUnique({
    where: { id: cityId },
    include: { buildings: true }
  });

  if (!city) return null;

  const now = new Date();
  const lastUpdate = city.lastResourceUpdate;
  const timeDifferenceHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  if (timeDifferenceHours < 0.001) return city; // Moins d'une seconde

  // Calculer la production basée sur les bâtiments
  const production = calculateCityProduction(city.buildings);
  
  const newResources = {
    wood: Math.floor(city.wood + (production.wood * timeDifferenceHours)),
    stone: Math.floor(city.stone + (production.stone * timeDifferenceHours)),
    silver: Math.floor(city.silver + (production.silver * timeDifferenceHours)),
  };

  // Mettre à jour la cité
  return await db.city.update({
    where: { id: cityId },
    data: {
      ...newResources,
      lastResourceUpdate: now,
    },
    include: { buildings: true, units: true }
  });
};

// Calculer la production d'une cité
const calculateCityProduction = (buildings: any[]) => {
  let production = { wood: 0, stone: 0, silver: 0, population: 0 };

  buildings.forEach(building => {
    switch (building.type) {
      case 'timber_camp':
        production.wood += Math.floor(100 * Math.pow(1.2, building.level - 1));
        break;
      case 'quarry':
        production.stone += Math.floor(80 * Math.pow(1.2, building.level - 1));
        break;
      case 'silver_mine':
        production.silver += Math.floor(50 * Math.pow(1.2, building.level - 1));
        break;
      case 'farm':
        production.population += Math.floor(50 * Math.pow(1.1, building.level - 1));
        break;
    }
  });

  return production;
};

// Fonction pour créer la première cité d'un utilisateur
export const createUserFirstCity = async (userId: string, cityName: string) => {
  // Générer des coordonnées aléatoires dans une zone de débutant
  const x = Math.floor(Math.random() * 100) + 450; // Zone centrale 450-550
  const y = Math.floor(Math.random() * 100) + 450;

  const city = await db.city.create({
    data: {
      name: cityName,
      userId,
      x,
      y,
      isCapital: true,
      // Ressources de départ généreuses pour le MVP
      wood: 1500,
      stone: 1500,
      silver: 800,
      population: 150,
      populationUsed: 0,
    },
  });

  // Créer le sénat automatiquement (obligatoire)
  await db.building.create({
    data: {
      type: 'senate',
      level: 1,
      cityId: city.id,
    },
  });

  return city;
};