// src/components/layout/cta-section.tsx - Version modernisée
'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowRight, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';

export const CTASection = () => {
  const { user, isLoaded } = useUser();

  // Ne pas afficher la CTA si l'utilisateur est connecté
  if (!isLoaded || user) {
    return null;
  }

  return (
    <section className="relative z-10 py-20">
      <div className="container mx-auto px-4 text-center">
        <GlassCard variant="elevated" className="max-w-4xl mx-auto overflow-hidden">
          <div className="relative p-12">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 dark:from-amber-600/30 dark:via-orange-600/30 dark:to-red-600/30" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-white/10 rounded-full border border-white/30 dark:border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Rejoignez l'aventure
                </span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Prêt à conquérir le monde ?
              </h3>
              
              <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Rejoignez des milliers de stratèges et commencez à bâtir votre empire. 
                L'histoire vous attend.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0 shadow-xl shadow-amber-500/25 h-14 px-8 text-lg transform hover:scale-105 transition-transform">
                  <Link href="/sign-up" className="flex items-center gap-3">
                    <Crown className="w-6 h-6" />
                    Créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-white/20 hover:bg-white/70 dark:hover:bg-gray-800/70 h-14 px-8 text-lg">
                  <Link href="/demo">
                    Essayer la démo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};