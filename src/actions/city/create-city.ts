// src/actions/city/create-city.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { createCitySchema } from '@/types';
import type { UserWithCities, CityWithBasicInfo } from '@/types/database';

export async function createCity(data: unknown) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      throw new Error('Non authentifié');
    }

    // Validation des données
    const validatedData = createCitySchema.parse(data);

    // Récupérer l'utilisateur
    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        cities: {
          select: {
            id: true,
            name: true,
          },
        },
        gameProfile: true,
      },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier le nombre maximum de cités (10 pour le MVP)
    if (user.cities.length >= 10) {
      throw new Error('Limite de cités atteinte (10 maximum)');
    }

    // Vérifier que le nom n'est pas déjà utilisé par cet utilisateur
    const existingCity = user.cities.find((city: CityWithBasicInfo) => 
      city.name.toLowerCase() === validatedData.name.toLowerCase()
    );

    if (existingCity) {
      throw new Error('Vous avez déjà une cité avec ce nom');
    }

    // Générer des coordonnées aléatoires
    let x: number, y: number;
    let attempts = 0;
    let isValidPosition = false;

    do {
      x = Math.floor(Math.random() * 1000);
      y = Math.floor(Math.random() * 1000);
      attempts++;

      // Vérifier qu'il n'y a pas déjà une cité à ces coordonnées
      const cityAtPosition = await db.city.findFirst({
        where: { x, y },
      });

      isValidPosition = !cityAtPosition;
    } while (!isValidPosition && attempts < 100);

    if (!isValidPosition) {
      throw new Error('Impossible de trouver une position libre');
    }

    // Créer la nouvelle cité
    const newCity = await db.city.create({
      data: {
        name: validatedData.name,
        userId: user.id,
        x,
        y,
        isCapital: user.cities.length === 0, // Première cité = capitale
        wood: 1000,
        stone: 800,
        silver: 500,
        population: 120,
        populationUsed: 0,
      },
    });

    // Créer le sénat automatiquement
    await db.building.create({
      data: {
        type: 'senate',
        level: 1,
        cityId: newCity.id,
      },
    });

    // Mettre à jour le profil de jeu
    if (user.gameProfile) {
      await db.gameProfile.update({
        where: { userId: user.id },
        data: {
          citiesCount: user.cities.length + 1,
        },
      });
    }

    // Revalider les pages
    revalidatePath('/city');
    revalidatePath('/world');

    return {
      success: true,
      data: newCity,
      message: `La cité ${validatedData.name} a été fondée avec succès !`,
    };
  } catch (error) {
    console.error('Erreur createCity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}