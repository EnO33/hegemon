// src/app/city/[cityId]/page.tsx (version corrigée)
'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { getUserCity } from '@/actions/user/get-user-data';
import { formatNumber } from '@/lib/utils';
import type { DbCity } from '@/types/database';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CityManagementPage() {
  const params = useParams();
  const cityId = params.cityId as string;
  const { user, isLoaded } = useUser();
  
  // État local simplifié
  const [city, setCity] = useState<DbCity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'units' | 'research'>('overview');

  // Fonction de chargement de la cité
  const loadCity = useCallback(async () => {
    if (!cityId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getUserCity(cityId);
      
      if (result.success && result.data) {
        setCity(result.data);
      } else {
        setError(result.error || 'Erreur de chargement');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  // Charger la cité au montage
  useEffect(() => {
    loadCity();
  }, [loadCity]);

  // Mise à jour des ressources en temps réel (simplifiée)
  useEffect(() => {
    if (!city) return;

    const updateResources = () => {
      setCity(prevCity => {
        if (!prevCity) return null;
        
        const now = Date.now();
        const lastUpdate = new Date(prevCity.lastResourceUpdate).getTime();
        const timeDiffHours = (now - lastUpdate) / (1000 * 60 * 60);

        if (timeDiffHours < 0.0003) return prevCity; // Moins d'une seconde

        return {
          ...prevCity,
          wood: Math.min(999999999, Math.floor(prevCity.wood + (prevCity.woodProduction * timeDiffHours))),
          stone: Math.min(999999999, Math.floor(prevCity.stone + (prevCity.stoneProduction * timeDiffHours))),
          silver: Math.min(999999999, Math.floor(prevCity.silver + (prevCity.silverProduction * timeDiffHours))),
          lastResourceUpdate: new Date(),
        };
      });
    };

    // Mettre à jour toutes les 5 secondes (moins fréquent)
    const interval = setInterval(updateResources, 5000);
    return () => clearInterval(interval);
  }, [city?.id]); // Dépendance sur l'ID uniquement

  // Synchronisation serveur (moins fréquente)
  useEffect(() => {
    if (!cityId) return;

    const syncInterval = setInterval(() => {
      loadCity();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(syncInterval);
  }, [cityId, loadCity]);

  // Vérification des constructions terminées
  useEffect(() => {
    const checkBuildings = async () => {
      try {
        const response = await fetch('/api/game/tick', { method: 'POST' });
        if (response.ok) {
          const result = await response.json();
          if (result.processed?.buildings > 0) {
            toast.success(`${result.processed.buildings} construction(s) terminée(s) !`);
            loadCity(); // Recharger après construction
          }
        }
      } catch (error) {
        console.error('Erreur tick:', error);
      }
    };

    // Vérifier toutes les 3 minutes
    const interval = setInterval(checkBuildings, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadCity]);

  // États de chargement et d'erreur
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
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
              <Button onClick={loadCity} variant="outline">
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

  if (!city) {
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
                    {city.name}
                    {city.isCapital && (
                      <Crown className="w-5 h-5 text-yellow-600" />
                    )}
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    ({city.x}, {city.y}) • {formatNumber(city.points)} points
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

      {/* Ressources */}
      <div className="container mx-auto px-4 py-4">
        <ResourceDisplay 
          resources={{
            wood: city.wood,
            stone: city.stone,
            silver: city.silver,
            population: city.population,
            populationUsed: city.populationUsed,
          }} 
          production={{
            woodProduction: city.woodProduction,
            stoneProduction: city.stoneProduction,
            silverProduction: city.silverProduction,
          }}
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
              <h2 className="text-2xl font-bold">Vue d'ensemble de {city.name}</h2>
              
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
                        <div className="font-medium">({city.x}, {city.y})</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Points:</span>
                        <div className="font-medium">{formatNumber(city.points)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Bâtiments:</span>
                        <div className="font-medium">{city.buildings.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Unités:</span>
                        <div className="font-medium">{city.units?.length || 0}</div>
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
                        <span className="font-bold">+{city.woodProduction}/h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">🗻 Pierre</span>
                        <span className="font-bold">+{city.stoneProduction}/h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-600">🪙 Argent</span>
                        <span className="font-bold">+{city.silverProduction}/h</span>
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
              <div className="mb-4">
                <Button onClick={loadCity} variant="outline" size="sm">
                  Actualiser
                </Button>
              </div>
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