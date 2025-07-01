// src/app/api/game/force-tick/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // En développement seulement, permettre un tick forcé
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // Appeler l'API de tick
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/game/tick`, {
      method: 'POST',
    });

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({
        success: true,
        message: 'Tick forcé exécuté',
        data: result,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Erreur lors du tick forcé',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors du tick forcé:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}