// src/app/api/game/completed-buildings/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Trouver les constructions récemment terminées (dans les 5 dernières minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const completedBuildings = await db.buildingQueue.findMany({
      where: {
        city: {
          userId: user.id,
        },
        status: 'completed',
        completesAt: {
          gte: fiveMinutesAgo,
        },
      },
      include: {
        city: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        completesAt: 'desc',
      },
    });

    // Transformer les données pour l'affichage
    const formattedBuildings = completedBuildings.map(building => ({
      id: building.id,
      buildingType: building.buildingType,
      action: building.action,
      targetLevel: building.targetLevel,
      cityName: building.city.name,
      completedAt: building.completesAt,
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedBuildings 
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des constructions terminées:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}