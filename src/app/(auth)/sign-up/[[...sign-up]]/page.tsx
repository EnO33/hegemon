// src/app/sign-up/[[...sign-up]]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Castle,
  Crown,
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  // TOUS LES HOOKS DOIVENT ÊTRE DÉCLARÉS EN PREMIER
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.username) {
      newErrors.username = 'Nom d\'utilisateur requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Minimum 3 caractères';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Caractères alphanumériques uniquement';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Doit contenir maj, min et chiffre';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await signUp.create({
        emailAddress: formData.email,
        username: formData.username,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setErrors({
        general: err.errors?.[0]?.message || 'Erreur lors de l\'inscription'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors({});

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/city');
      }
    } catch (err: any) {
      setErrors({
        code: err.errors?.[0]?.message || 'Code de vérification invalide'
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

  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
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

        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Vérification email
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Un code de vérification a été envoyé à {formData.email}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {errors.code && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">{errors.code}</span>
                  </div>
                )}

                <form onSubmit={handleVerification} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Code de vérification
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-center text-lg tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading || !code}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Vérifier et créer mon empire
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
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
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Créer un empire
              </CardTitle>
              <CardDescription className="text-gray-600">
                Rejoignez la conquête du monde antique
              </CardDescription>
              <Badge variant="secondary" className="w-fit mx-auto mt-2">
                Gratuit pour toujours
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
                <div id="clerk-captcha" />
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

                {/* Nom d'utilisateur */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full pl-10 pr-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors',
                        errors.username ? 'border-red-300' : 'border-gray-300'
                      )}
                      placeholder="empereur_antique"
                      required
                    />
                  </div>
                  {errors.username && (
                    <span className="text-sm text-red-600">{errors.username}</span>
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

                {/* Confirmation mot de passe */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full pl-10 pr-12 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors',
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      )}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-sm text-red-600">{errors.confirmPassword}</span>
                  )}
                </div>

                {/* Bouton d'inscription */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !isLoaded}
                  className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white py-3 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Créer mon empire
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Conditions d'utilisation */}
              <p className="text-xs text-gray-500 text-center">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" className="text-amber-600 hover:text-amber-700">
                  conditions d'utilisation
                </Link>{' '}
                et notre{' '}
                <Link href="/privacy" className="text-amber-600 hover:text-amber-700">
                  politique de confidentialité
                </Link>
                .
              </p>

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Lien vers connexion */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Déjà un empire ?{' '}
                  <Link 
                    href="/sign-in" 
                    className="font-medium text-amber-600 hover:text-amber-700"
                  >
                    Se connecter
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