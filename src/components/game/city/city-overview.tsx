// src/components/game/city/city-overview.tsx (version mise à jour)
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserData } from '@/actions/user/get-user-data';
import { createCity } from '@/actions/city/create-city';
import { 
  Castle,
  Coins,
  Users,
  Hammer,
  Trees,
  Mountain,
  Crown,
  Plus,
  Loader2,
  MapPin,
  ArrowRight,
  Settings
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import type { UserDataResponse } from '@/types/database';
import Link from 'next/link';

export const CityOverview = () => {
  const [userData, setUserData] = useState<UserDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingCity, setIsCreatingCity] = useState(false);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const result = await getUserData();
      if (result.success && result.data) {
        setUserData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Erreur de chargement');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleCreateTestCity = async () => {
    setIsCreatingCity(true);
    try {
      const result = await createCity({
        name: `TestCity_${Date.now().toString().slice(-4)}`,
      });
      
      if (result.success) {
        await loadUserData();
      } else {
        setError(result.error || 'Erreur de création');
      }
    } catch (err) {
      setError('Erreur de création de cité');
    } finally {
      setIsCreatingCity(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Chargement de votre empire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={loadUserData} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Aucune donnée disponible</p>
      </div>
    );
  }

  const { user, gameProfile, cities } = userData;

  return (
    <div className="space-y-6">
      {/* Profil utilisateur */}
      <Card className="bg-gradient-to-r from-amber-500 to-red-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-amber-100">Empereur de {cities.length} cité(s)</p>
                {gameProfile && (
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="text-amber-800">
                      Niveau {gameProfile.level}
                    </Badge>
                    <Badge variant="secondary" className="text-amber-800">
                      Rang #{gameProfile.rank}
                    </Badge>
                    <Badge variant="secondary" className="text-amber-800">
                      {formatNumber(gameProfile.totalPoints)} points
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Castle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{cities.length}</div>
            <div className="text-sm text-gray-600">Cités</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trees className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {formatNumber(cities.reduce((sum, city) => sum + city.wood, 0))}
            </div>
            <div className="text-sm text-gray-600">Bois total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Mountain className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {formatNumber(cities.reduce((sum, city) => sum + city.stone, 0))}
            </div>
            <div className="text-sm text-gray-600">Pierre totale</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {formatNumber(cities.reduce((sum, city) => sum + city.silver, 0))}
            </div>
            <div className="text-sm text-gray-600">Argent total</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des cités avec liens de gestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cities.map((city) => (
          <Card key={city.id} className={city.isCapital ? 'ring-2 ring-amber-400' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Castle className="w-5 h-5" />
                    {city.name}
                    {city.isCapital && (
                      <Badge variant="secondary" className="ml-2">
                        <Crown className="w-3 h-3 mr-1" />
                        Capitale
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Position ({city.x}, {city.y})
                  </CardDescription>
                </div>
                <Badge variant="outline">{formatNumber(city.points)} pts</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Ressources */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <Trees className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="font-bold">{formatNumber(city.wood)}</div>
                  <div className="text-xs text-gray-600">Bois</div>
                </div>
                <div className="text-center">
                  <Mountain className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="font-bold">{formatNumber(city.stone)}</div>
                  <div className="text-xs text-gray-600">Pierre</div>
                </div>
                <div className="text-center">
                  <Coins className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <div className="font-bold">{formatNumber(city.silver)}</div>
                  <div className="text-xs text-gray-600">Argent</div>
                </div>
              </div>

              {/* Population */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Population</span>
                </div>
                <span className="font-bold">
                  {city.populationUsed}/{city.population}
                </span>
              </div>

              {/* Bâtiments */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Hammer className="w-4 h-4" />
                  Bâtiments ({city.buildings.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {city.buildings.slice(0, 4).map((building) => (
                    <Badge key={building.id} variant="outline" className="text-xs">
                      {building.type} Niv.{building.level}
                    </Badge>
                  ))}
                  {city.buildings.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{city.buildings.length - 4} autres
                    </Badge>
                  )}
                  {city.buildings.length === 0 && (
                    <span className="text-sm text-gray-500">Aucun bâtiment</span>
                  )}
                </div>
              </div>

              {/* Bouton de gestion */}
              <Button asChild className="w-full mt-4">
                <Link href={`/city/${city.id}`} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Gérer cette cité
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions disponibles</CardTitle>
          <CardDescription>
            Testez les fonctionnalités de construction et de gestion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleCreateTestCity}
              disabled={isCreatingCity || cities.length >= 10}
              className="flex items-center gap-2"
            >
              {isCreatingCity ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Créer une cité test
            </Button>
            
            <Button variant="outline" onClick={loadUserData}>
              Rafraîchir les données
            </Button>
          </div>
          
          {cities.length >= 10 && (
            <p className="text-sm text-amber-600">
              Limite de cités atteinte (10 maximum pour le MVP)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};