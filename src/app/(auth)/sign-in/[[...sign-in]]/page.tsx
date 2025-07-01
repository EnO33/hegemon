// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx - Version modernisée
'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useMountAnimation } from '@/hooks/use-mount-animation';
import { 
  Castle,
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const isMounted = useMountAnimation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  if (isUserLoaded && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Castle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Redirection vers votre empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/20 to-orange-300/20 dark:from-amber-600/10 dark:to-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-300/20 to-pink-300/20 dark:from-red-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Castle className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                Hegemon
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 -mt-1">
                Empire Builder
              </p>
            </div>
          </Link>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md">
          <GlassCard 
            variant="elevated" 
            className={cn(
              'transition-all duration-700 shadow-2xl',
              isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Bon retour !
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Accédez à votre empire antique
                </p>
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-0 text-amber-800 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Connexion sécurisée
                </Badge>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-300">{errors.general}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-800/50 border rounded-xl',
                        'focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200',
                        'placeholder:text-gray-400 backdrop-blur-sm',
                        errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                      )}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="text-sm text-red-600 dark:text-red-400">{errors.email}</span>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full pl-12 pr-12 py-4 bg-white/50 dark:bg-gray-800/50 border rounded-xl',
                        'focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200',
                        'placeholder:text-gray-400 backdrop-blur-sm',
                        errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                      )}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-sm text-red-600 dark:text-red-400">{errors.password}</span>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !isLoaded}
                  className="w-full h-12 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    ou
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pas encore de compte ?{' '}
                  <Link 
                    href="/sign-up" 
                    className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    Créer un empire
                  </Link>
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Back Link */}
          <div className={cn(
            'text-center mt-8 transition-all duration-700 delay-300',
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <Link 
              href="/" 
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}