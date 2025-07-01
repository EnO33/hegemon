// src/app/city/[cityId]/page.tsx (mise à jour avec queue)
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResourceDisplay } from '@/components/game/resources/resource-display';
import { BuildingsList } from '@/components/game/buildings/buildings-list';
import { BuildingQueue } from '@/components/game/buildings/building-queue';
import { 
  Castle,
  Crown,
  Loader2,
  ArrowLeft,
  MapPin,
  Settings,
  BarChart3,
  Hammer
} from 'lucide-react';
import { useCityStore, useCityResources, useCityProduction, useCityLoading, useCityError } from '@/stores/city-store';
import { useResourceUpdater } from '@/hooks/use-resource-updater';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CityManagementPage() {
  const params = useParams();
  const cityId = params.cityId as string;
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'units' | 'research'>('overview');

  const { currentCity, actions } = useCityStore();
  const resources = useCityResources();
  const production = useCityProduction();
  const isLoading = useCityLoading();
  const error = useCityError();

  // Hook pour la mise à jour automatique des ressources
  useResourceUpdater(cityId);

  useEffect(() => {
    if (cityId) {
      actions.loadCity(cityId);
    }

    return () => {
      actions.reset();
    };
  }, [cityId, actions]);

  // Notifications de construction
  useEffect(() => {
    // Simuler des notifications de construction terminée
    const checkCompletedBuildings = async () => {
      try {
        const response = await fetch('/api/game/tick', { method: 'POST' });
        if (response.ok) {
          const result = await response.json();
          if (result.processed.buildings > 0) {
            toast.success(`${result.processed.buildings} construction(s) terminée(s) !`);
            // Recharger la cité pour voir les nouveaux bâtiments
            actions.refreshCity();
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des constructions:', error);
      }
    };

    // Vérifier toutes les 2 minutes
    const interval = setInterval(checkCompletedBuildings, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [actions]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && !currentCity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Castle className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Chargement de la cité...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-2">
              <Button onClick={() => actions.loadCity(cityId)} variant="outline">
                Réessayer
              </Button>
              <Button asChild>
                <Link href="/city">Retour aux cités</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-gray-400 text-4xl mb-4">🏛️</div>
            <h2 className="text-xl font-semibold mb-2">Cité non trouvée</h2>
            <p className="text-gray-600 mb-4">Cette cité n'existe pas ou ne vous appartient pas.</p>
            <Button asChild>
              <Link href="/city">Retour aux cités</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/city" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </Link>
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Castle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {currentCity.name}
                    {currentCity.isCapital && (
                      <Crown className="w-5 h-5 text-yellow-600" />
                    )}
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    ({currentCity.x}, {currentCity.y}) • {formatNumber(currentCity.points)} points
                  </p>
                </div>
              </div>
            </div>

            {/* User */}
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden sm:flex items-center gap-2">
                <Crown className="w-4 h-4" />
                {user?.username}
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
        </div>
      </header>

      {/* Ressources en temps réel */}
      <div className="container mx-auto px-4 py-4">
        <ResourceDisplay 
          resources={resources} 
          production={production}
        />
      </div>

      {/* Navigation tabs */}
      <div className="container mx-auto px-4">
        <div className="border-b bg-white rounded-t-lg">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'buildings', label: 'Bâtiments', icon: Castle },
              { id: 'units', label: 'Unités', icon: Settings },
              { id: 'research', label: 'Recherche', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-b-lg min-h-[600px]">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Vue d'ensemble de {currentCity.name}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de la cité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Position:</span>
                        <div className="font-medium">({currentCity.x}, {currentCity.y})</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Points:</span>
                        <div className="font-medium">{formatNumber(currentCity.points)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Bâtiments:</span>
                        <div className="font-medium">{currentCity.buildings.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Unités:</span>
                        <div className="font-medium">{currentCity.units.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Production */}
                <Card>
                  <CardHeader>
                    <CardTitle>Production horaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-600">🌲 Bois</span>
                        <span className="font-bold">+{production.woodProduction}/h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">🗻 Pierre</span>
                        <span className="font-bold">+{production.stoneProduction}/h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-600">🪙 Argent</span>
                        <span className="font-bold">+{production.silverProduction}/h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Queue de construction */}
                <div>
                  <BuildingQueue cityId={cityId} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buildings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Gestion des bâtiments</h2>
              <BuildingsList />
            </div>
          )}

          {activeTab === 'units' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Gestion des unités</h2>
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 text-4xl mb-4">⚔️</div>
                  <h3 className="text-xl font-semibold mb-2">Bientôt disponible</h3>
                  <p className="text-gray-600">La gestion des unités militaires sera implémentée prochainement.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Centre de recherche</h2>
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 text-4xl mb-4">🔬</div>
                  <h3 className="text-xl font-semibold mb-2">Bientôt disponible</h3>
                  <p className="text-gray-600">Le système de recherche et technologies sera implémenté prochainement.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}