// src/app/api/game/building-queue/route.ts
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

    const buildingQueues = await db.buildingQueue.findMany({
      where: {
        city: {
          userId: user.id,
        },
        status: 'in_progress',
      },
      include: {
        city: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        completesAt: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: buildingQueues });

  } catch (error) {
    console.error('Erreur lors de la récupération de la queue:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}