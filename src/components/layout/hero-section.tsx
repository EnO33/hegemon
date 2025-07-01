// src/components/layout/hero-section.tsx - Version modernisée
'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { useMountAnimation } from '@/hooks/use-mount-animation';
import { Castle, ArrowRight, Crown, Loader2, Sparkles, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const HeroSection = () => {
  const { user, isLoaded } = useUser();
  const isMounted = useMountAnimation(300);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full transition-all duration-700',
            'bg-gradient-to-r from-amber-500/10 to-red-500/10 dark:from-amber-600/20 dark:to-red-600/20',
            'border border-amber-200/50 dark:border-amber-700/50',
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              🚀 Phase Alpha - En développement actif
            </span>
          </div>
          
          {/* Main Title */}
          <h2 className={cn(
            'text-5xl md:text-7xl font-bold mb-8 transition-all duration-700 delay-100',
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            {user ? (
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Bon retour, {user.username} !
              </span>
            ) : (
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                Construisez votre{' '}
                <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                  empire antique
                </span>
              </span>
            )}
          </h2>
          
          {/* Subtitle */}
          <p className={cn(
            'text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto transition-all duration-700 delay-200',
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            {user ? (
              <>Votre empire vous attend. Continuez à développer vos cités et conquérir de nouveaux territoires dans cette expérience de stratégie révolutionnaire.</>
            ) : (
              <>Développez vos cités, gérez vos ressources, recrutez des armées et 
              conquérez le monde méditerranéen dans le jeu de stratégie le plus immersif jamais créé.</>
            )}
          </p>
          
          {/* CTA Buttons */}
          <div className={cn(
            'flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transition-all duration-700 delay-300',
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            {!isLoaded ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="text-gray-500 text-lg">Chargement...</span>
              </div>
            ) : user ? (
              <>
                <Button size="lg" asChild className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0 shadow-xl shadow-amber-500/25 h-14 px-8 text-lg">
                  <Link href="/city" className="flex items-center gap-3">
                    <Crown className="w-6 h-6" />
                    Retourner à mon empire
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-gray-800/70 h-14 px-8 text-lg">
                  <Link href="/world" className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    Carte du monde
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0 shadow-xl shadow-amber-500/25 h-14 px-8 text-lg transform hover:scale-105 transition-transform">
                  <Link href="/sign-up" className="flex items-center gap-3">
                    Créer mon empire
                    <Castle className="w-6 h-6" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-gray-800/70 h-14 px-8 text-lg">
                  <Link href="/demo" className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    Voir la démo
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Features highlight */}
          <div className={cn(
            'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-700 delay-500',
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            {[
              { icon: Sparkles, text: 'Interface révolutionnaire' },
              { icon: Zap, text: 'Temps réel optimisé' },
              { icon: Globe, text: 'Multijoueur massif' },
            ].map((feature, index) => (
              <GlassCard key={feature.text} variant="subtle" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-red-500 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {feature.text}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};