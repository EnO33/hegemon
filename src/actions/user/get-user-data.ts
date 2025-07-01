// src/actions/user/get-user-data.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { db, updateCityResources } from '@/lib/db';
import type { UserDataResponse, DbCity } from '@/types/database';

export async function getUserData() {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      throw new Error('Non authentifié');
    }

    // Récupérer l'utilisateur avec ses données de jeu
    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        gameProfile: true,
        cities: {
          include: {
            buildings: true,
            units: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Mettre à jour les ressources de toutes les cités
    const updatedCities = await Promise.all(
      user.cities.map((city: DbCity) => updateCityResources(city.id))
    );

    const responseData: UserDataResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
      gameProfile: user.gameProfile,
      cities: updatedCities.filter((city): city is DbCity => city !== null),
    };

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error('Erreur getUserData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

export async function getUserCity(cityId: string) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      throw new Error('Non authentifié');
    }

    // Vérifier que la cité appartient à l'utilisateur
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
        units: true,
      },
    });

    if (!city) {
      throw new Error('Cité non trouvée');
    }

    // Mettre à jour les ressources
    const updatedCity = await updateCityResources(cityId);

    return {
      success: true,
      data: updatedCity,
    };
  } catch (error) {
    console.error('Erreur getUserCity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}