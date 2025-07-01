// src/components/game/buildings/building-card.tsx - Version modernisée
'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Trees, Mountain, Coins, Clock, Hammer, AlertCircle, CheckCircle, Zap, Star } from 'lucide-react';
import { getBuildingConfig, calculateBuildingCost, calculateConstructionTime } from '@/lib/constants/buildings';
import { formatNumber, formatTime } from '@/lib/utils';
import { buildBuilding, upgradeBuilding } from '@/actions/building/build-building';
import type { BuildingType } from '@/types';
import type { DbBuilding, DbCity } from '@/types/database';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface BuildingCardProps {
  buildingType: BuildingType;
  existingBuilding?: DbBuilding;
  city: DbCity & { buildingQueue?: Array<{ status: string; buildingType: string; action: string }> };
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

  const currentQueue = city.buildingQueue?.filter(q => q.status === 'in_progress' || q.status === 'pending') || [];
  const isInQueue = currentQueue.some(q => q.buildingType === buildingType);
  const queueFull = currentQueue.length >= 2;

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

  const missingRequirements = config.requirements.filter(req => {
    const requiredBuilding = city.buildings.find(b => b.type === req.buildingType);
    return !requiredBuilding || requiredBuilding.level < req.level;
  });

  const categoryIcons = {
    essential: '🏛️',
    production: '🏭',
    military: '⚔️',
    defensive: '🛡️',
  };

  return (
    <GlassCard 
      variant={existingBuilding ? "elevated" : "default"}
      className={cn(
        'group hover:scale-[1.02] transition-all duration-300 overflow-hidden',
        !canAfford && !isMaxLevel && 'opacity-75',
        existingBuilding && 'ring-1 ring-blue-200/50 dark:ring-blue-700/50'
      )}
    >
      <div className="relative">
        {/* Background gradient pour les bâtiments existants */}
        {existingBuilding && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10" />
        )}
        
        <div className="relative p-6">
          {/* Header avec icône et niveau */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center text-lg',
                existingBuilding 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              )}>
                <span className="text-white">
                  {categoryIcons[config.category as keyof typeof categoryIcons]}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {config.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {config.description}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {existingBuilding && (
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                  <Star className="w-3 h-3 mr-1" />
                  Niveau {currentLevel}
                </Badge>
              )}
              {isMaxLevel && (
                <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Maximum
                </Badge>
              )}
            </div>
          </div>

          {/* Prérequis manquants */}
          {missingRequirements.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-sm font-medium mb-2">
                <AlertCircle className="w-4 h-4" />
                Prérequis manquants
              </div>
              {missingRequirements.map(req => (
                <div key={req.buildingType} className="text-red-600 dark:text-red-400 text-xs ml-6">
                  • {getBuildingConfig(req.buildingType as BuildingType)?.name || req.buildingType} niveau {req.level}
                </div>
              ))}
            </div>
          )}

          {/* Coûts et temps */}
          {!isMaxLevel && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Hammer className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                  {existingBuilding ? `Amélioration vers niveau ${nextLevel}` : 'Construction'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { icon: Trees, value: cost.wood, available: city.wood, color: 'text-green-600 dark:text-green-400' },
                  { icon: Mountain, value: cost.stone, available: city.stone, color: 'text-gray-600 dark:text-gray-400' },
                  { icon: Coins, value: cost.silver, available: city.silver, color: 'text-yellow-600 dark:text-yellow-400' },
                ].map((resource, index) => {
                  const Icon = resource.icon;
                  const canAffordThis = resource.available >= resource.value;
                  return (
                    <div key={index} className="text-center">
                      <Icon className={cn('w-4 h-4 mx-auto mb-1', resource.color)} />
                      <div className={cn(
                        'text-sm font-bold',
                        canAffordThis ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'
                      )}>
                        {formatNumber(resource.value)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                <Clock className="w-4 h-4" />
                <span>Durée: {formatTime(constructionTime)}</span>
              </div>
            </div>
          )}

          {/* Effets du bâtiment */}
          {config.effects.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">
                Effets {existingBuilding ? `(niveau ${nextLevel})` : '(niveau 1)'}
              </div>
              <div className="space-y-1">
                {config.effects.map((effect, index) => {
                  const value = Math.floor(effect.value * Math.pow(1.2, nextLevel - 1));
                  return (
                    <div key={index} className="text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      {effect.type === 'resource_production' && (
                        <span>+{value} {effect.resourceType}/heure</span>
                      )}
                      {effect.type === 'population_increase' && (
                        <span>+{value} population</span>
                      )}
                      {effect.type === 'storage_increase' && (
                        <span>+{formatNumber(value)} stockage</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action button */}
          {!isMaxLevel && !isInQueue && (
            <>
              {queueFull && (
                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    File de construction pleine (2/2)
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 text-xs mt-1">
                    Attendez qu'une construction se termine
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleAction}
                disabled={!canAfford || isProcessing || missingRequirements.length > 0 || queueFull}
                className={cn(
                  'w-full transition-all duration-200',
                  existingBuilding
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700',
                  'text-white border-0 group-hover:scale-105'
                )}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {existingBuilding ? 'Amélioration...' : 'Construction...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Hammer className="w-4 h-4" />
                    {existingBuilding ? `Améliorer (Niv. ${nextLevel})` : 'Construire'}
                  </span>
                )}
              </Button>
            </>
          )}

          {/* Statut si en queue */}
          {isInQueue && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                <Clock className="w-4 h-4 animate-pulse" />
                {(() => {
                  const queueItem = currentQueue.find(q => q.buildingType === buildingType);
                  const isActive = queueItem?.status === 'in_progress';
                  const isPending = queueItem?.status === 'pending';
                  
                  if (isActive) return existingBuilding ? 'Amélioration en cours' : 'Construction en cours';
                  if (isPending) return existingBuilding ? 'Amélioration en attente' : 'Construction en attente';
                  return 'En file d\'attente';
                })()}
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                Visible dans la file de construction
              </p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};