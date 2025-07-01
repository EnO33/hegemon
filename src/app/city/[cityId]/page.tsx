// src/app/city/[cityId]/page.tsx - Version modernisée
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ResourceDisplay } from '@/components/game/resources/resource-display';
import { BuildingsList } from '@/components/game/buildings/buildings-list';
import { BuildingQueueStatus } from '@/components/game/buildings/building-queue-status';
import { useMountAnimation } from '@/hooks/use-mount-animation';
import { 
  Castle,
  Crown,
  Loader2,
  ArrowLeft,
  MapPin,
  Settings,
  BarChart3,
  Hammer,
  Users,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { getUserCity } from '@/actions/user/get-user-data';
import { formatNumber } from '@/lib/utils';
import type { DbCity } from '@/types/database';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';

export default function CityManagementPage() {
  const params = useParams();
  const cityId = params.cityId as string;
  const { user, isLoaded } = useUser();
  const isMounted = useMountAnimation();
  const scrollY = useScrollPosition();
  
  const [city, setCity] = useState<DbCity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'units' | 'research'>('overview');

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

  useEffect(() => {
    loadCity();
  }, [loadCity]);

  // Mise à jour des ressources en temps réel
  useEffect(() => {
    if (!city) return;

    const updateResources = () => {
      setCity(prevCity => {
        if (!prevCity) return null;
        
        const now = Date.now();
        const lastUpdate = new Date(prevCity.lastResourceUpdate).getTime();
        const timeDiffHours = (now - lastUpdate) / (1000 * 60 * 60);

        if (timeDiffHours < 0.0003) return prevCity;

        return {
          ...prevCity,
          wood: Math.min(999999999, Math.floor(prevCity.wood + (prevCity.woodProduction * timeDiffHours))),
          stone: Math.min(999999999, Math.floor(prevCity.stone + (prevCity.stoneProduction * timeDiffHours))),
          silver: Math.min(999999999, Math.floor(prevCity.silver + (prevCity.silverProduction * timeDiffHours))),
          lastResourceUpdate: new Date(),
        };
      });
    };

    const interval = setInterval(updateResources, 5000);
    return () => clearInterval(interval);
  }, [city?.id]);

  // Loading State
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600 dark:text-gray-300">Chargement de la cité...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <GlassCard variant="elevated" className="max-w-md mx-4">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Castle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Erreur</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={loadCity} variant="outline">
                Réessayer
              </Button>
              <Button asChild>
                <Link href="/city">Retour aux cités</Link>
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <GlassCard variant="elevated" className="max-w-md mx-4">
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Cité non trouvée
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Cette cité n'existe pas ou ne vous appartient pas.
            </p>
            <Button asChild>
              <Link href="/city">Retour aux cités</Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const isScrolled = scrollY > 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 dark:from-blue-600/5 dark:to-purple-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-300/10 to-emerald-300/10 dark:from-green-600/5 dark:to-emerald-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'py-2' : 'py-4'
      )}>
        <div className="container mx-auto px-4">
          <GlassCard 
            variant={isScrolled ? 'elevated' : 'default'}
            className="transition-all duration-500"
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Navigation */}
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/city" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Retour</span>
                    </Link>
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        city.isCapital 
                          ? 'bg-gradient-to-br from-amber-600 to-red-600' 
                          : 'bg-gradient-to-br from-blue-600 to-purple-600'
                      )}>
                        <Castle className="w-6 h-6 text-white" />
                      </div>
                      {city.isCapital && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {city.name}
                        {city.isCapital && (
                          <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs">
                            Capitale
                          </Badge>
                        )}
                      </h1>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          ({city.x}, {city.y})
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {formatNumber(city.points)} points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User & Theme */}
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="hidden sm:flex items-center gap-2 bg-white/50 dark:bg-gray-800/50">
                    <Crown className="w-4 h-4" />
                    {user?.username}
                  </Badge>
                  <ThemeToggle />
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-white/20 dark:border-white/10"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        'pt-24 pb-8 transition-all duration-700',
        isMounted ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="container mx-auto px-4 space-y-8">
          {/* Ressources */}
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

          {/* Navigation Tabs */}
          <GlassCard variant="elevated">
            <div className="p-2">
              <nav className="flex space-x-2 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                  { id: 'buildings', label: 'Bâtiments', icon: Castle },
                  { id: 'units', label: 'Unités', icon: Users },
                  { id: 'research', label: 'Recherche', icon: Sparkles },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap',
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </GlassCard>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* City Stats */}
                <div className="lg:col-span-2 space-y-6">
                  <GlassCard variant="elevated">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Statistiques de la cité
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Bâtiments', value: city.buildings.length, icon: Castle, color: 'from-blue-500 to-cyan-500' },
                          { label: 'Unités', value: city.units?.length || 0, icon: Users, color: 'from-purple-500 to-pink-500' },
                          { label: 'Population', value: city.population, icon: Users, color: 'from-green-500 to-emerald-500' },
                          { label: 'Points', value: city.points, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
                        ].map((stat) => {
                          const Icon = stat.icon;
                          return (
                            <div key={stat.label} className="text-center">
                              <div className={cn(
                                'w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r flex items-center justify-center',
                                stat.color
                              )}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatNumber(stat.value)}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {stat.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </GlassCard>

                  {/* Production Details */}
                  <GlassCard variant="elevated">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Production détaillée
                      </h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Bois', production: city.woodProduction, color: 'text-green-600 dark:text-green-400' },
                          { name: 'Pierre', production: city.stoneProduction, color: 'text-gray-600 dark:text-gray-400' },
                          { name: 'Argent', production: city.silverProduction, color: 'text-yellow-600 dark:text-yellow-400' },
                        ].map((resource) => (
                          <div key={resource.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              {resource.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500" />
                              <span className={cn('font-bold', resource.color)}>
                                +{formatNumber(resource.production)}/h
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Building Queue */}
                <div>
                  <BuildingQueueStatus 
                    cityId={cityId} 
                    onBuildingCompleted={loadCity}
                  />
                </div>
              </div>
            )}

            {activeTab === 'buildings' && (
              <GlassCard variant="elevated">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Gestion des bâtiments
                    </h3>
                    <Button onClick={loadCity} variant="outline" size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Actualiser
                    </Button>
                  </div>
                  <BuildingsList />
                </div>
              </GlassCard>
            )}

            {activeTab === 'units' && (
              <GlassCard variant="elevated">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Gestion des unités
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Le système de recrutement et de gestion des armées arrive bientôt !
                  </p>
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Prochaine mise à jour
                  </Badge>
                </div>
              </GlassCard>
            )}

            {activeTab === 'research' && (
              <GlassCard variant="elevated">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Centre de recherche
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Découvrez de nouvelles technologies pour faire évoluer votre civilisation !
                  </p>
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                    <Zap className="w-4 h-4 mr-2" />
                    En développement
                  </Badge>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}