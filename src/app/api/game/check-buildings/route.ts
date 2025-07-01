// src/app/api/game/check-buildings/route.ts (nouveau endpoint optimisé)
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST() {
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

    const now = new Date();

    // Trouver uniquement les constructions terminées pour cet utilisateur
    const completedBuildings = await db.buildingQueue.findMany({
      where: {
        status: 'in_progress',
        completesAt: {
          lte: now,
        },
        city: {
          userId: user.id,
        },
      },
      include: {
        city: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (completedBuildings.length === 0) {
      return NextResponse.json({ 
        success: true, 
        hasCompletedBuildings: false,
        processed: { buildings: 0 }
      });
    }

    console.log(`🎯 Vérification utilisateur: ${completedBuildings.length} constructions à finaliser`);

    // Déclencher le tick complet seulement s'il y a des constructions à finaliser
    const tickResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/game/tick`, {
      method: 'POST',
    });

    if (tickResponse.ok) {
      const tickResult = await tickResponse.json();
      return NextResponse.json({ 
        success: true, 
        hasCompletedBuildings: true,
        processed: tickResult.processed || { buildings: completedBuildings.length }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Erreur lors du traitement'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification des constructions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}