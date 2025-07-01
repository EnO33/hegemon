// src/app/city/page.tsx - Version modernisée
'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CityOverview } from '@/components/game/city/city-overview';
import { useMountAnimation } from '@/hooks/use-mount-animation';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { 
  Castle, 
  Crown, 
  Plus,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
  Coins
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CityPage() {
  const { user } = useUser();
  const isMounted = useMountAnimation();
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 20;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Chargement de votre empire...</p>
        </div>
      </div>
    );
  }

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
        isScrolled 
          ? 'py-2 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg' 
          : 'py-4 bg-transparent'
      )}>
        <div className="container mx-auto px-4">
          <GlassCard 
            variant={isScrolled ? 'elevated' : 'default'}
            className="transition-all duration-500"
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo & Navigation */}
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Castle className="w-6 h-6 text-white" />
                    </div>
                    <div className="hidden md:block">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                        Imperium
                      </h1>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Votre Empire
                      </p>
                    </div>
                  </Link>

                  {/* Quick Actions */}
                  <div className="hidden lg:flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/world" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Monde
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/alliance" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Alliance
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* User & Actions */}
                <div className="flex items-center gap-4">
                  {/* Stats rapides */}
                  <div className="hidden sm:flex items-center gap-4">
                    <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                      <Crown className="w-4 h-4 mr-1" />
                      Empereur
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      <Zap className="w-4 h-4 mr-1" />
                      En ligne
                    </Badge>
                  </div>

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
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-red-500/10 dark:from-amber-600/20 dark:to-red-600/20 rounded-full border border-amber-200/50 dark:border-amber-700/50">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Bienvenue dans votre empire
                </span>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Gestion de l'Empire
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Dirigez vos cités, développez votre civilisation et étendez votre influence à travers le monde antique
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4">
                <GlassCard className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Castle className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Cités</div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">1.2k</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">847</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Argent</div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  Nouvelle Cité
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/world" className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Explorer le Monde
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Technology Banner */}
            <GlassCard variant="elevated" className="overflow-hidden">
              <div className="relative p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Données en temps réel
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Propulsé par Railway PostgreSQL
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Connecté
                  </Badge>
                </div>
              </div>
            </GlassCard>

            {/* Main Content */}
            <CityOverview />
          </div>
        </div>
      </main>
    </div>
  );
}