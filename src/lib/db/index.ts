// src/lib/db/index.ts (version corrigée)
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
    include: { 
      buildings: true,
      units: true // Inclure les unités
    }
  });

  if (!city) return null;

  const now = new Date();
  const lastUpdate = city.lastResourceUpdate;
  const timeDifferenceHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  if (timeDifferenceHours < 0.001) return city; // Moins d'une seconde

  // Calculer la production basée sur les bâtiments
  const newResources = {
    wood: Math.min(999999999, Math.floor(city.wood + (city.woodProduction * timeDifferenceHours))),
    stone: Math.min(999999999, Math.floor(city.stone + (city.stoneProduction * timeDifferenceHours))),
    silver: Math.min(999999999, Math.floor(city.silver + (city.silverProduction * timeDifferenceHours))),
  };

  // Mettre à jour la cité
  return await db.city.update({
    where: { id: cityId },
    data: {
      ...newResources,
      lastResourceUpdate: now,
    },
    include: { 
      buildings: true, 
      units: true // Inclure les unités
    }
  });
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
      // Production de base (sera recalculée quand des bâtiments seront ajoutés)
      woodProduction: 100,
      stoneProduction: 80,
      silverProduction: 50,
      populationCapacity: 150,
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