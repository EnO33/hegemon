// src/app/page.tsx - Version modernisée
'use client';

import { useUser } from '@clerk/nextjs';
import { GlassCard } from '@/components/ui/glass-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { DynamicHeader } from '@/components/layout/dynamic-header';
import { HeroSection } from '@/components/layout/hero-section';
import { CTASection } from '@/components/layout/cta-section';
import { useMountAnimation } from '@/hooks/use-mount-animation';
import { 
  Sword, 
  Castle, 
  Coins, 
  Users, 
  Trophy,
  Shield,
  Hammer,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const stats = [
  { icon: Users, label: 'Joueurs inscrits', value: 847, color: 'from-blue-500 to-cyan-500' },
  { icon: Castle, label: 'Cités fondées', value: 2156, color: 'from-green-500 to-emerald-500' },
  { icon: Sword, label: 'Batailles livrées', value: 1432, color: 'from-red-500 to-pink-500' },
];

const features = [
  {
    icon: Hammer,
    title: 'Gestion de cité',
    description: 'Construisez et améliorez vos bâtiments pour développer votre civilisation',
    gradient: 'from-blue-500 to-purple-600',
    delay: 100,
  },
  {
    icon: Coins,
    title: 'Économie dynamique',
    description: 'Gérez bois, pierre, argent et population pour soutenir votre croissance',
    gradient: 'from-yellow-500 to-orange-600',
    delay: 200,
  },
  {
    icon: Sword,
    title: 'Combat stratégique',
    description: 'Recrutez des armées et partez à la conquête d\'autres cités',
    gradient: 'from-red-500 to-pink-600',
    delay: 300,
  },
  {
    icon: Users,
    title: 'Alliances puissantes',
    description: 'Formez des alliances stratégiques avec d\'autres joueurs',
    gradient: 'from-purple-500 to-indigo-600',
    delay: 400,
  },
  {
    icon: Shield,
    title: 'Défenses avancées',
    description: 'Fortifiez vos cités et préparez-vous aux invasions',
    gradient: 'from-green-500 to-teal-600',
    delay: 500,
  },
  {
    icon: Trophy,
    title: 'Gloire éternelle',
    description: 'Grimpez dans les classements et devenez un empereur légendaire',
    gradient: 'from-amber-500 to-yellow-600',
    delay: 600,
  },
];

export default function HomePage() {
  const { user } = useUser();
  const isMounted = useMountAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/20 to-orange-300/20 dark:from-amber-600/10 dark:to-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-300/20 to-pink-300/20 dark:from-red-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header dynamique modernisé */}
      <DynamicHeader />

      {/* Hero Section modernisé */}
      <HeroSection />

      {/* Stats Section avec animations */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard
                  key={stat.label}
                  variant="elevated"
                  delay={index * 100}
                  className="group hover:scale-105 transition-transform duration-300"
                >
                  <div className="p-6 text-center">
                    <div className={cn(
                      'w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r flex items-center justify-center',
                      stat.color
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section modernisé */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-600/20 dark:to-orange-600/20 rounded-full border border-amber-200/50 dark:border-amber-700/50 mb-6">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Fonctionnalités innovantes
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Découvrez un gameplay révolutionnaire
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Plongez dans un univers où stratégie, diplomatie et gestion se rencontrent 
              pour créer l'expérience de jeu la plus immersive jamais conçue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.title}
                  variant="subtle"
                  delay={feature.delay}
                  className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/20"
                >
                  <div className="p-8">
                    <div className={cn(
                      'w-14 h-14 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300',
                      feature.gradient
                    )}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section modernisé */}
      <CTASection />

      {/* Footer modernisé */}
      <footer className="relative z-10 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-red-600 rounded-2xl flex items-center justify-center">
                <Castle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
                Hegemon
              </h2>
            </div>
            
            <p className="text-gray-300 mb-8 text-lg">
              L'avenir des jeux de stratégie commence ici.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 mb-8">
              <Link href="/about" className="hover:text-white transition-colors">
                À propos
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                CGU
              </Link>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Worldwide</span>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-700 text-sm text-gray-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p>© 2025 Hegemon. Tous droits réservés.</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Powered by Next.js & Railway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}