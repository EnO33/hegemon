// src/components/game/city/city-overview.tsx - Version modernisée (partie 1)
'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/animated-counter';
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
  Settings,
  TrendingUp,
  Zap,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import type { UserDataResponse } from '@/types/database';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
        name: `Cité_${Date.now().toString().slice(-4)}`,
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
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600 dark:text-gray-300">Chargement de votre empire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <GlassCard variant="elevated" className="border-red-200/50 dark:border-red-700/50">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={loadUserData} variant="outline">
              Réessayer
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8 text-center">
        <GlassCard variant="subtle">
          <div className="p-8">
            <div className="text-gray-400 text-4xl mb-4">🏛️</div>
            <p className="text-gray-600 dark:text-gray-300">Aucune donnée disponible</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  const { user, gameProfile, cities } = userData;
  const totalResources = cities.reduce((acc, city) => ({
    wood: acc.wood + city.wood,
    stone: acc.stone + city.stone,
    silver: acc.silver + city.silver,
  }), { wood: 0, stone: 0, silver: 0 });

  return (
    <div className="space-y-8">
      {/* Profil utilisateur modernisé */}
      <GlassCard variant="elevated" className="overflow-hidden">
        <div className="relative p-8">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-600/20 dark:via-orange-600/20 dark:to-red-600/20" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-2xl flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                  Empereur {user.username}
                </h2>
                <Badge variant="secondary" className="w-fit bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                  <Zap className="w-4 h-4 mr-1" />
                  Actif maintenant
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Dirigeant de {cities.length} cité{cities.length > 1 ? 's' : ''}
              </p>
              
              {gameProfile && (
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
                    Niveau <AnimatedCounter value={gameProfile.level} />
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
                    Rang #{gameProfile.rank}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
                    <AnimatedCounter value={gameProfile.totalPoints} formatter={formatNumber} /> points
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Empire */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Castle, label: 'Cités', value: cities.length, color: 'from-blue-500 to-cyan-500' },
          { icon: Trees, label: 'Bois total', value: totalResources.wood, color: 'from-green-500 to-emerald-500' },
          { icon: Mountain, label: 'Pierre totale', value: totalResources.stone, color: 'from-gray-500 to-slate-500' },
          { icon: Coins, label: 'Argent total', value: totalResources.silver, color: 'from-yellow-500 to-amber-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard
              key={stat.label}
              variant="subtle"
              delay={index * 100}
              className="group hover:scale-105 transition-all duration-300"
            >
              <div className="p-6 text-center">
                <div className={cn(
                  'w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center group-hover:scale-110 transition-transform duration-300',
                  stat.color
                )}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  <AnimatedCounter value={stat.value} formatter={formatNumber} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vos Cités
          </h3>
          <Button
            onClick={handleCreateTestCity}
            disabled={isCreatingCity || cities.length >= 10}
            className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white"
          >
            {isCreatingCity ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle cité
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cities.map((city, index) => (
            <GlassCard
              key={city.id}
              variant="elevated"
              delay={index * 100}
              className={cn(
                'group hover:scale-[1.02] transition-all duration-300 overflow-hidden',
                city.isCapital && 'ring-2 ring-amber-400/50 dark:ring-amber-500/50'
              )}
            >
              <div className="relative">
                {/* Background pattern */}
                {city.isCapital && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-600/10 dark:to-orange-600/10" />
                )}
                
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        city.isCapital 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                      )}>
                        <Castle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {city.name}
                          {city.isCapital && (
                            <Crown className="w-5 h-5 text-amber-500" />
                          )}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-3 h-3" />
                          ({city.x}, {city.y})
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {formatNumber(city.points)} pts
                      </Badge>
                      {city.isCapital && (
                        <Badge variant="secondary" className="block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                          Capitale
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Ressources grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { icon: Trees, value: city.wood, label: 'Bois', color: 'text-green-600 dark:text-green-400' },
                      { icon: Mountain, value: city.stone, label: 'Pierre', color: 'text-gray-600 dark:text-gray-400' },
                      { icon: Coins, value: city.silver, label: 'Argent', color: 'text-yellow-600 dark:text-yellow-400' },
                    ].map((resource) => {
                      const Icon = resource.icon;
                      return (
                        <div key={resource.label} className="text-center">
                          <Icon className={cn('w-5 h-5 mx-auto mb-1', resource.color)} />
                          <div className="font-bold text-gray-900 dark:text-white">
                            {formatNumber(resource.value)}
                          </div>
                          <div className="text-xs text-gray-500">{resource.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Population avec barre de progression */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Population
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {city.populationUsed}/{city.population}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={cn(
                          'h-2 rounded-full transition-all duration-500',
                          city.populationUsed / city.population >= 0.9 
                            ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        )}
                        style={{ width: `${Math.min(100, (city.populationUsed / city.population) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Bâtiments */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Hammer className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Bâtiments ({city.buildings.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {city.buildings.slice(0, 4).map((building) => (
                        <Badge key={building.id} variant="outline" className="text-xs bg-white/50 dark:bg-gray-800/50">
                          {building.type} Niv.{building.level}
                        </Badge>
                      ))}
                      {city.buildings.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800">
                          +{city.buildings.length - 4} autres
                        </Badge>
                      )}
                      {city.buildings.length === 0 && (
                        <span className="text-sm text-gray-500 italic">Aucun bâtiment</span>
                      )}
                    </div>
                  </div>

                  {/* Production */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-4">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Production/heure</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-green-600 dark:text-green-400">
                          +{city.woodProduction}
                        </div>
                        <div className="text-gray-500">Bois</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-600 dark:text-gray-400">
                          +{city.stoneProduction}
                        </div>
                        <div className="text-gray-500">Pierre</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-600 dark:text-yellow-400">
                          +{city.silverProduction}
                        </div>
                        <div className="text-gray-500">Argent</div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de gestion */}
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:scale-105 transition-transform duration-200">
                    <Link href={`/city/${city.id}`} className="flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      Gérer cette cité
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {cities.length >= 10 && (
          <GlassCard variant="subtle" className="mt-6">
            <div className="p-4 text-center">
              <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                ⚠️ Limite de cités atteinte (10 maximum pour le MVP)
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Actions rapides */}
      <GlassCard variant="elevated">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Actions rapides
          </h3>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={loadUserData} 
              variant="outline"
              className="bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10"
            >
              <Zap className="w-4 h-4 mr-2" />
              Rafraîchir les données
            </Button>
            
            <Button 
              onClick={handleCreateTestCity}
              disabled={isCreatingCity || cities.length >= 10}
              variant="outline"
              className="bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10"
            >
              {isCreatingCity ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Créer une cité test
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};