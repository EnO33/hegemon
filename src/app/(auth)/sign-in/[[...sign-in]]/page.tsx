// src/app/sign-in/[[...sign-in]]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Castle,
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  // TOUS LES HOOKS DOIVENT ÊTRE DÉCLARÉS EN PREMIER
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isUserLoaded && user) {
      router.replace('/city');
    }
  }, [isUserLoaded, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/city');
      }
    } catch (err: any) {
      setErrors({
        general: err.errors?.[0]?.message || 'Erreur de connexion'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // CONDITION DE SORTIE APRÈS TOUS LES HOOKS
  if (isUserLoaded && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Redirection vers votre empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
              <Castle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hegemon</h1>
              <p className="text-sm text-gray-600">Jeu de stratégie antique</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Connexion
              </CardTitle>
              <CardDescription className="text-gray-600">
                Accédez à votre empire antique
              </CardDescription>
              <Badge variant="secondary" className="w-fit mx-auto mt-2">
                Bon retour, stratège !
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full pl-10 pr-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors',
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      )}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="text-sm text-red-600">{errors.email}</span>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full pl-10 pr-12 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors',
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      )}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-sm text-red-600">{errors.password}</span>
                  )}
                </div>

                {/* Mot de passe oublié */}
                <div className="text-right">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Bouton de connexion */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !isLoaded}
                  className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white py-3 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Lien vers inscription */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link 
                    href="/sign-up" 
                    className="font-medium text-amber-600 hover:text-amber-700"
                  >
                    Créer un empire
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lien de retour */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}