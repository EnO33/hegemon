// src/components/game/resources/resource-display.tsx - Version modernisée
'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Trees, Mountain, Coins, Users, TrendingUp, Zap } from 'lucide-react';
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

const resourceConfigs = [
  {
    key: 'wood' as const,
    icon: Trees,
    label: 'Bois',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-200/50 dark:border-green-700/50',
  },
  {
    key: 'stone' as const,
    icon: Mountain,
    label: 'Pierre',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'from-gray-500/20 to-slate-500/20',
    borderColor: 'border-gray-200/50 dark:border-gray-700/50',
  },
  {
    key: 'silver' as const,
    icon: Coins,
    label: 'Argent',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-200/50 dark:border-yellow-700/50',
  },
];

export const ResourceDisplay = ({ resources, production, className }: ResourceDisplayProps) => {
  const [animatedResources, setAnimatedResources] = useState(resources);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Animation en temps réel des ressources
  useEffect(() => {
    if (!isRealTimeEnabled) return;
    
    const interval = setInterval(() => {
      setAnimatedResources(prev => ({
        ...prev,
        wood: Math.min(999999999, prev.wood + (production.woodProduction / 3600)),
        stone: Math.min(999999999, prev.stone + (production.stoneProduction / 3600)),
        silver: Math.min(999999999, prev.silver + (production.silverProduction / 3600)),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [production, isRealTimeEnabled]);

  // Synchroniser avec les nouvelles données
  useEffect(() => {
    setAnimatedResources(resources);
  }, [resources]);

  const populationPercentage = Math.round((resources.populationUsed / resources.population) * 100);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header avec toggle temps réel */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Ressources de l'Empire
        </h3>
        <button
          onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
            isRealTimeEnabled
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          )}
        >
          <Zap className={cn('w-3 h-3', isRealTimeEnabled && 'animate-pulse')} />
          Temps réel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Ressources principales */}
        {resourceConfigs.map((config, index) => {
          const Icon = config.icon;
          const value = animatedResources[config.key];
          const productionKey = `${config.key}Production` as keyof typeof production;
          const productionValue = production[productionKey];
          
          return (
            <GlassCard
              key={config.key}
              variant="subtle"
              delay={index * 100}
              className={cn(
                'group hover:scale-105 transition-all duration-300 border',
                config.borderColor
              )}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center',
                    config.bgColor
                  )}>
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </div>
                  <Badge variant="outline" className="text-xs px-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{formatNumber(productionValue)}/h
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-sm font-medium', config.color)}>
                      {config.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter 
                      value={Math.floor(value)} 
                      formatter={formatNumber}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}

        {/* Population avec gauge circulaire */}
        <GlassCard
          variant="subtle"
          delay={300}
          className="group hover:scale-105 transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge 
                variant={populationPercentage >= 90 ? "destructive" : "outline"} 
                className="text-xs px-2"
              >
                {resources.population - resources.populationUsed} libre(s)
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Population
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <ProgressRing
                  progress={populationPercentage}
                  size={50}
                  strokeWidth={4}
                  className="text-purple-500"
                >
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {populationPercentage}%
                  </span>
                </ProgressRing>
                
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {resources.populationUsed}/{resources.population}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    En cours d'utilisation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Indicateur de production totale */}
      <GlassCard variant="subtle" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Production totale par heure
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Revenus générés par vos bâtiments de production
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                +{formatNumber(production.woodProduction)}
              </div>
              <div className="text-xs text-gray-500">Bois/h</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                +{formatNumber(production.stoneProduction)}
              </div>
              <div className="text-xs text-gray-500">Pierre/h</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                +{formatNumber(production.silverProduction)}
              </div>
              <div className="text-xs text-gray-500">Argent/h</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};