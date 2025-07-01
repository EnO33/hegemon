// src/components/layout/hero-section.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Castle, ArrowRight, Crown, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const HeroSection = () => {
  const { user, isLoaded } = useUser();

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4">
          🚀 Phase Alpha - Développement en cours
        </Badge>
        
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          {user ? `Bon retour, ${user.username} !` : 'Construisez votre empire antique'}
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {user ? (
            <>Votre empire vous attend. Continuez à développer vos cités et conquérir de nouveaux territoires.</>
          ) : (
            <>Développez vos cités, gérez vos ressources, recrutez des armées et 
            conquérez le monde méditerranéen dans ce jeu de stratégie en temps réel.</>
          )}
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-12">
          {!isLoaded ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              <span className="text-gray-500">Chargement...</span>
            </div>
          ) : user ? (
            <>
              <Button size="lg" asChild>
                <Link href="/city">
                  <Crown className="w-5 h-5 mr-2" />
                  Retourner à mon empire
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/world">
                  Carte du monde
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Créer mon empire
                  <Castle className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">
                  Voir la démo
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};