// src/components/game/resources/resource-display.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trees, Mountain, Coins, Users, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ResourceDisplayProps {
  resources: {
    wood: number;
    stone: number;
    silver: number;
    population: number;
    populationUsed: number;
  };
  production: {
    woodProduction: number;
    stoneProduction: number;
    silverProduction: number;
  };
  className?: string;
}

export const ResourceDisplay = ({ resources, production, className }: ResourceDisplayProps) => {
  const [animatedResources, setAnimatedResources] = useState(resources);

  // Animation en temps réel des ressources
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedResources(prev => ({
        ...prev,
        wood: prev.wood + (production.woodProduction / 3600), // Par seconde
        stone: prev.stone + (production.stoneProduction / 3600),
        silver: prev.silver + (production.silverProduction / 3600),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [production]);

  // Synchroniser avec les nouvelles données
  useEffect(() => {
    setAnimatedResources(resources);
  }, [resources]);

  return (
    <Card className={cn('bg-gradient-to-r from-green-50 to-blue-50', className)}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Bois */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trees className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Bois</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {formatNumber(Math.floor(animatedResources.wood))}
            </div>
            <Badge variant="outline" className="text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{production.woodProduction}/h
            </Badge>
          </div>

          {/* Pierre */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mountain className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Pierre</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(Math.floor(animatedResources.stone))}
            </div>
            <Badge variant="outline" className="text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{production.stoneProduction}/h
            </Badge>
          </div>

          {/* Argent */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Argent</span>
            </div>
            <div className="text-2xl font-bold text-yellow-900">
              {formatNumber(Math.floor(animatedResources.silver))}
            </div>
            <Badge variant="outline" className="text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{production.silverProduction}/h
            </Badge>
          </div>

          {/* Population */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Population</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {resources.populationUsed}/{resources.population}
            </div>
            <Badge 
              variant={resources.populationUsed >= resources.population ? "destructive" : "outline"} 
              className="text-xs mt-1"
            >
              {resources.population - resources.populationUsed} libre(s)
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};