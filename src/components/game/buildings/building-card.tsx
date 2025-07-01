// src/components/game/buildings/building-card.tsx (version corrigée)
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trees, Mountain, Coins, Clock, Hammer, AlertCircle, CheckCircle } from 'lucide-react';
import { getBuildingConfig, calculateBuildingCost, calculateConstructionTime } from '@/lib/constants/buildings';
import { formatNumber, formatTime } from '@/lib/utils';
import { buildBuilding, upgradeBuilding } from '@/actions/building/build-building';
import type { BuildingType } from '@/types';
import type { DbBuilding, DbCity } from '@/types/database';
import toast from 'react-hot-toast';

interface BuildingCardProps {
  buildingType: BuildingType;
  existingBuilding?: DbBuilding;
  city: DbCity;
  onAction?: () => void;
}

export const BuildingCard = ({ buildingType, existingBuilding, city, onAction }: BuildingCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const config = getBuildingConfig(buildingType);
  const currentLevel = existingBuilding?.level || 0;
  const nextLevel = existingBuilding ? currentLevel + 1 : 1;
  const isMaxLevel = existingBuilding && currentLevel >= config.maxLevel;
  
  const cost = calculateBuildingCost(config, nextLevel);
  const constructionTime = calculateConstructionTime(config, nextLevel);
  
  const canAfford = city.wood >= cost.wood && 
                   city.stone >= cost.stone && 
                   city.silver >= cost.silver;

  const handleAction = async () => {
    setIsProcessing(true);
    try {
      let result;
      
      if (existingBuilding) {
        result = await upgradeBuilding({
          buildingId: existingBuilding.id,
          cityId: city.id,
        });
      } else {
        result = await buildBuilding({
          buildingType,
          cityId: city.id,
        });
      }
      
      if (result.success) {
        toast.success(result.message || 'Action réussie !');
        if (onAction) {
          // Attendre un peu avant de recharger pour laisser le serveur se mettre à jour
          setTimeout(onAction, 500);
        }
      } else {
        toast.error(result.error || 'Erreur lors de l\'action');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsProcessing(false);
    }
  };

  // Vérifier les prérequis
  const missingRequirements = config.requirements.filter(req => {
    const requiredBuilding = city.buildings.find(b => b.type === req.buildingType);
    return !requiredBuilding || requiredBuilding.level < req.level;
  });

  return (
    <Card className={`transition-all hover:shadow-md ${!canAfford && !isMaxLevel ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{config.name}</CardTitle>
          {existingBuilding && (
            <Badge variant="secondary">
              Niveau {currentLevel}
            </Badge>
          )}
          {isMaxLevel && (
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Max
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm">
          {config.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Prérequis manquants */}
        {missingRequirements.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              Prérequis manquants:
            </div>
            {missingRequirements.map(req => (
              <div key={req.buildingType} className="text-red-600 text-xs ml-6">
                {getBuildingConfig(req.buildingType as BuildingType)?.name || req.buildingType} niveau {req.level}
              </div>
            ))}
          </div>
        )}

        {/* Coûts */}
        {!isMaxLevel && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              {existingBuilding ? `Amélioration vers niveau ${nextLevel}` : 'Construction'}
            </h4>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className={`flex items-center gap-1 ${city.wood < cost.wood ? 'text-red-600' : 'text-green-600'}`}>
                <Trees className="w-3 h-3" />
                {formatNumber(cost.wood)}
              </div>
              <div className={`flex items-center gap-1 ${city.stone < cost.stone ? 'text-red-600' : 'text-green-600'}`}>
                <Mountain className="w-3 h-3" />
                {formatNumber(cost.stone)}
              </div>
              <div className={`flex items-center gap-1 ${city.silver < cost.silver ? 'text-red-600' : 'text-green-600'}`}>
                <Coins className="w-3 h-3" />
                {formatNumber(cost.silver)}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
              <Clock className="w-3 h-3" />
              Durée: {formatTime(constructionTime)}
            </div>
          </div>
        )}

        {/* Effets du bâtiment */}
        {config.effects.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2 text-blue-800">
              Effets {existingBuilding ? `(niveau ${nextLevel})` : '(niveau 1)'}
            </h4>
            {config.effects.map((effect, index) => {
              const value = Math.floor(effect.value * Math.pow(1.2, nextLevel - 1));
              return (
                <div key={index} className="text-blue-700 text-sm">
                  {effect.type === 'resource_production' && (
                    <span>+{value} {effect.resourceType}/heure</span>
                  )}
                  {effect.type === 'population_increase' && (
                    <span>+{value} population</span>
                  )}
                  {effect.type === 'storage_increase' && (
                    <span>+{value} stockage</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bouton d'action */}
        {!isMaxLevel && (
          <Button 
            onClick={handleAction}
            disabled={!canAfford || isProcessing || missingRequirements.length > 0}
            className="w-full"
            variant={existingBuilding ? "outline" : "default"}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {existingBuilding ? 'Amélioration...' : 'Construction...'}
              </span>
            ) : (
              existingBuilding ? `Améliorer (Niv. ${nextLevel})` : 'Construire'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};