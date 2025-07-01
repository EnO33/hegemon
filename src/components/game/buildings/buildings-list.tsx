// src/components/game/buildings/buildings-list.tsx
'use client';

import { BuildingCard } from './building-card';
import { BUILDING_CONFIGS } from '@/lib/constants/buildings';
import { useCityBuildings } from '@/stores/city-store';
import type { BuildingType } from '@/types';

export const BuildingsList = () => {
  const buildings = useCityBuildings();

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
              const existingBuilding = buildings.find(b => b.type === buildingType);
              return (
                <BuildingCard
                  key={buildingType}
                  buildingType={buildingType}
                  existingBuilding={existingBuilding}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};