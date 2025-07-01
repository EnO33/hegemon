// src/app/city/page.tsx
'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';
import { CityOverview } from '@/components/game/city/city-overview';
import { 
  Castle,
  Crown,
  Loader2
} from 'lucide-react';

export default function CityPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Chargement de votre empire...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
              <Castle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hegemon</h1>
              <p className="text-sm text-gray-600">Votre Empire</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Empereur {user?.username}
            </Badge>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Titre de bienvenue */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gestion de l'Empire
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Gérez vos cités, ressources et développez votre civilisation
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              🚀 Données en temps réel avec Railway PostgreSQL
            </Badge>
          </div>

          {/* Vue d'ensemble des cités */}
          <CityOverview />
        </div>
      </main>
    </div>
  );
}