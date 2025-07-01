// src/components/layout/dynamic-header.tsx - Version modernisée
'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Castle, ArrowRight, Crown, Loader2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const DynamicHeader = () => {
  const { user, isLoaded } = useUser();
  const scrollY = useScrollPosition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = scrollY > 20;

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isScrolled 
        ? 'py-2' 
        : 'py-4'
    )}>
      <div className="container mx-auto px-4">
        <GlassCard 
          variant={isScrolled ? 'elevated' : 'default'}
          className={cn(
            'transition-all duration-500',
            isScrolled ? 'shadow-xl' : ''
          )}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Castle className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                  Hegemon
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-300 -mt-1">
                  Empire Builder
                </p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {!isLoaded ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Chargement...</span>
                </div>
              ) : user ? (
                <>
                  <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-0 text-amber-800 dark:text-amber-200">
                    <Crown className="w-4 h-4 mr-2" />
                    Empereur {user.username}
                  </Badge>
                  <Button variant="outline" asChild className="bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-gray-800/70">
                    <Link href="/city">Mon Empire</Link>
                  </Button>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-white/20 dark:border-white/10"
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10">
                    <Link href="/sign-in">Connexion</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0 shadow-lg shadow-amber-500/25">
                    <Link href="/sign-up">
                      Commencer à jouer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-10 w-10 p-0"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/10 dark:border-white/5 p-4 space-y-4">
              {!isLoaded ? (
                <div className="flex items-center gap-2 justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Chargement...</span>
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                    <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-0 text-amber-800 dark:text-amber-200">
                      <Crown className="w-4 h-4 mr-2" />
                      {user.username}
                    </Badge>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white">
                    <Link href="/city" onClick={() => setIsMobileMenuOpen(false)}>
                      Mon Empire
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white">
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                      Commencer à jouer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </header>
  );
};