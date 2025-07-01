// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sword, 
  Castle, 
  Coins, 
  Users, 
  Trophy,
  ArrowRight,
  Shield,
  Hammer
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
              <Castle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hegemon</h1>
              <p className="text-sm text-gray-600">Jeu de stratégie antique</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                Commencer à jouer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 Phase Alpha - Développement en cours
          </Badge>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Construisez votre empire antique
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Développez vos cités, gérez vos ressources, recrutez des armées et 
            conquérez le monde méditerranéen dans ce jeu de stratégie en temps réel.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button size="lg" asChild>
              <Link href="/register">
                Créer mon empire
                <Castle className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">
                Voir la démo
              </Link>
            </Button>
          </div>

          {/* Stats rapides */}
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
      </section>

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

      {/* CTA Final */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500 to-red-500 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">
                Prêt à conquérir le monde ?
              </h3>
              <p className="text-amber-100 mb-6">
                Rejoignez l'aventure dès maintenant et commencez à bâtir votre empire.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Créer mon compte
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

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