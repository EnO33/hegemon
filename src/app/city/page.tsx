// src/app/city/page.tsx
'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Castle,
  Hammer,
  Coins,
  Users,
  Sword,
  Shield,
  Settings,
  Crown
} from 'lucide-react';

export default function CityPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center">
            <Castle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
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
            <Badge variant="secondary" className="flex items-center gap-2">
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
        <div className="max-w-6xl mx-auto">
          {/* Bienvenue */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue dans votre Empire !
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Félicitations, {user?.firstName || user?.username} ! Votre règne commence maintenant.
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              🚧 Interface en développement - Fonctionnalités à venir
            </Badge>
          </div>

          {/* Vue d'ensemble rapide */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Castle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">1</div>
                <div className="text-sm text-gray-600">Cités</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">1,000</div>
                <div className="text-sm text-gray-600">Ressources</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">100</div>
                <div className="text-sm text-gray-600">Population</div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <Sword className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Armée</div>
              </CardContent>
            </Card>
          </div>

          {/* Prochaines étapes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-amber-600" />
                  Prochaines étapes
                </CardTitle>
                <CardDescription>
                  Commencez à développer votre empire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <div className="font-medium">Construire le Sénat</div>
                      <div className="text-sm text-gray-600">Centre administratif de votre cité</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">2</span>
                    </div>
                    <div>
                      <div className="font-medium">Développer les ressources</div>
                      <div className="text-sm text-gray-600">Camps de bûcherons et carrières</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">3</span>
                    </div>
                    <div>
                      <div className="font-medium">Recruter une armée</div>
                      <div className="text-sm text-gray-600">Caserne et unités militaires</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" disabled>
                  <Hammer className="w-4 h-4 mr-2" />
                  Commencer la construction (Bientôt)
                </Button>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Fonctionnalités en développement
                </CardTitle>
                <CardDescription>
                  Ce qui arrive prochainement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Système de construction</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Gestion des ressources</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Recrutement d'unités</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Système de combat</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Alliances</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Carte du monde</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}