// src/components/game/buildings/buildings-list.tsx (version corrigée)
'use client';

import { useState, useEffect } from 'react';
import { BuildingCard } from './building-card';
import { BUILDING_CONFIGS } from '@/lib/constants/buildings';
import { getUserCity } from '@/actions/user/get-user-data';
import { useParams } from 'next/navigation';
import type { BuildingType } from '@/types';
import type { DbBuilding, DbCity } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Fonction pour récupérer la queue de construction
async function getBuildingQueue(cityId: string) {
  try {
    const response = await fetch('/api/game/building-queue');
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return result.data.filter((item: any) => item.cityId === cityId);
      }
    }
  } catch (error) {
    console.error('Erreur chargement queue:', error);
  }
  return [];
}

export const BuildingsList = () => {
  const params = useParams();
  const cityId = params.cityId as string;
  
  const [city, setCity] = useState<DbCity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données de la cité
  useEffect(() => {
    const loadCityData = async () => {
      if (!cityId) return;
      
      try {
        const result = await getUserCity(cityId);
        if (result.success && result.data) {
          // Charger aussi la queue de construction
          const cityWithQueue = {
            ...result.data,
            buildingQueue: await getBuildingQueue(cityId)
          };
          setCity(cityWithQueue);
        }
      } catch (error) {
        console.error('Erreur chargement cité:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, [cityId]);

  const getBuildingsByCategory = () => {
    const categories = {
      essential: [] as BuildingType[],
      production: [] as BuildingType[],
      military: [] as BuildingType[],
      defensive: [] as BuildingType[],
    };

    Object.keys(BUILDING_CONFIGS).forEach(key => {
      const buildingType = key as BuildingType;
      const config = BUILDING_CONFIGS[buildingType];
      categories[config.category as keyof typeof categories].push(buildingType);
    });

    return categories;
  };

  // Fonction pour recharger après une action
  const handleBuildingAction = async () => {
    const result = await getUserCity(cityId);
    if (result.success && result.data) {
      const cityWithQueue = {
        ...result.data,
        buildingQueue: await getBuildingQueue(cityId)
      };
      setCity(cityWithQueue);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Chargement des bâtiments...</p>
        </CardContent>
      </Card>
    );
  }

  if (!city) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Erreur de chargement des bâtiments</p>
        </CardContent>
      </Card>
    );
  }

  const categorizedBuildings = getBuildingsByCategory();

  return (
    <div className="space-y-6">
      {Object.entries(categorizedBuildings).map(([category, buildingTypes]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold mb-4 capitalize">
            {category === 'essential' && '🏛️ Bâtiments essentiels'}
            {category === 'production' && '🏭 Production'}
            {category === 'military' && '⚔️ Militaire'}
            {category === 'defensive' && '🛡️ Défense'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildingTypes.map(buildingType => {
              const existingBuilding = city.buildings.find(b => b.type === buildingType);
              return (
                <BuildingCard
                  key={buildingType}
                  buildingType={buildingType}
                  existingBuilding={existingBuilding}
                  city={city}
                  onAction={handleBuildingAction}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};