// src/components/layout/dynamic-header.tsx
'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Castle, ArrowRight, Crown, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const DynamicHeader = () => {
  const { user, isLoaded } = useUser();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
            <Castle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hegemon</h1>
            <p className="text-sm text-gray-600">Jeu de stratégie antique</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {!isLoaded ? (
            // État de chargement
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">Chargement...</span>
            </div>
          ) : user ? (
            // Utilisateur connecté
            <>
              <Badge variant="secondary" className="hidden sm:flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Empereur {user.username}
              </Badge>
              <Button variant="outline" asChild>
                <Link href="/city">Mon Empire</Link>
              </Button>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </>
          ) : (
            // Utilisateur non connecté
            <>
              <Button variant="outline" asChild>
                <Link href="/sign-in">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">
                  Commencer à jouer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};