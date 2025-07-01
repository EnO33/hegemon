// src/app/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicHeader } from '@/components/layout/dynamic-header';
import { HeroSection } from '@/components/layout/hero-section';
import { CTASection } from '@/components/layout/cta-section';
import { 
  Sword, 
  Castle, 
  Coins, 
  Users, 
  Trophy,
  Shield,
  Hammer
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header dynamique */}
      <DynamicHeader />

      {/* Hero Section dynamique */}
      <HeroSection />

      {/* Stats rapides */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Joueurs inscrits</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Castle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Cités fondées</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Sword className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Batailles livrées</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="bg-white/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités du jeu
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les mécaniques qui feront de vous un stratège légendaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Hammer className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Gestion de cité</CardTitle>
                <CardDescription>
                  Construisez et améliorez vos bâtiments pour développer votre civilisation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Ressources</CardTitle>
                <CardDescription>
                  Gérez bois, pierre, argent et population pour soutenir votre croissance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Sword className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Combat</CardTitle>
                <CardDescription>
                  Recrutez des armées et partez à la conquête d'autres cités
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Alliances</CardTitle>
                <CardDescription>
                  Formez des alliances stratégiques avec d'autres joueurs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Défense</CardTitle>
                <CardDescription>
                  Fortifiez vos cités et préparez-vous aux invasions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Classements</CardTitle>
                <CardDescription>
                  Grimpez dans les classements et devenez un empereur légendaire
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final (uniquement si non connecté) */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
              <Castle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Hegemon</span>
          </div>
          
          <p className="text-gray-400 mb-4">
            Jeu de stratégie antique en développement
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white">À propos</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white">CGU</Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
            © 2025 Hegemon. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}