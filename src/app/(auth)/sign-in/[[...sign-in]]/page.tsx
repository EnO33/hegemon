// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx - Version Ultra-Moderne avec ShadCN UI
'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Sparkles,
  Crown,
  Users,
  Trophy,
  Swords,
  Zap,
  Star,
  Globe,
  Target,
  ChevronRight,
  LogIn,
  Flame,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const heroFeatures = [
  {
    icon: Shield,
    title: 'Sécurité Maximale',
    description: 'Votre empire protégé par nos défenses',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Connexion Instantanée',
    description: 'Accès immédiat à votre royaume',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Crown,
    title: 'Statut Préservé',
    description: 'Votre progression sauvegardée',
    color: 'from-amber-500 to-orange-500'
  }
];

const recentAchievements = [
  { user: 'Caesar', achievement: 'Conquérant Légendaire', time: '2min' },
  { user: 'Cleopatra', achievement: 'Architecte Suprême', time: '5min' },
  { user: 'Alexander', achievement: 'Stratège Immortel', time: '8min' }
];

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
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Animations CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .float-animation { animation: float 3s ease-in-out infinite; }
      .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      .gradient-shift { animation: gradient-shift 8s ease-in-out infinite; background-size: 200% 200%; }
      .slide-up { animation: slide-up 0.6s ease-out forwards; }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.4); }
      }
      
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes slide-up {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    setLoginAttempts(prev => prev + 1);

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
        general: err.errors?.[0]?.message || 'Identifiants incorrects. Vérifiez votre email et mot de passe.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // État de chargement
  if (isUserLoaded && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Reconnexion à votre Empire
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Chargement de vos territoires...
            </CardDescription>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '75%', animation: 'slide-up 1s ease-out' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl gradient-shift" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-green-300/20 dark:from-emerald-600/10 dark:to-green-600/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-blue-300/20 dark:from-purple-600/10 dark:to-blue-600/10 rounded-full blur-3xl opacity-50" />

        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 float-animation"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-40"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-50"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25 float-animation">
                <Castle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Imperium
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Retour au pouvoir</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Connexion sécurisée
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-120px)]">
          {/* Left side - Hero content */}
          <div className={cn(
            'space-y-8 transition-all duration-1000 order-2 lg:order-1',
            isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          )}>
            {/* Welcome back section */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 float-animation" />
                <span className="font-semibold text-blue-800 dark:text-blue-200">
                  Bon retour, Empereur !
                </span>
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent block">
                    Reprenez le
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent block gradient-shift">
                    Contrôle
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Votre empire vous attend. Vos cités prospèrent, vos armées sont prêtes,
                  et vos alliés comptent sur votre retour au pouvoir.
                </p>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, label: 'En ligne', value: '2,847', color: 'from-blue-500 to-cyan-500' },
                  { icon: Trophy, label: 'Victoires', value: '12,456', color: 'from-green-500 to-emerald-500' },
                  { icon: Swords, label: 'Batailles', value: '892', color: 'from-purple-500 to-pink-500' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.label} className={cn(
                      'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105',
                      isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}>
                      <CardContent className="p-4 text-center">
                        <div className={cn(
                          'w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br flex items-center justify-center',
                          stat.color
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Pourquoi revenir maintenant ?
              </h3>
              {heroFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className={cn(
                      'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer hover:scale-[1.02] group',
                      isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    )}
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className={cn(
                        'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300',
                        feature.color
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent achievements */}
            <Card className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm border-blue-200/50 dark:border-blue-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Derniers Exploits
                  </h4>
                </div>
                <div className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold">
                            {achievement.user[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {achievement.user}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {achievement.achievement}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                        {achievement.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Formulaire */}
          <div className={cn(
            'transition-all duration-1000 order-1 lg:order-2',
            isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          )}>
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-emerald-500/5 dark:from-blue-600/10 dark:via-cyan-600/10 dark:to-emerald-600/10" />

              <CardHeader className="text-center space-y-4 pb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 pulse-glow">
                  <LogIn className="w-10 h-10 text-white" />
                </div>

                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Reconquérir votre Trône
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                    Votre empire a besoin de vous
                  </CardDescription>
                </div>

                <div className="flex justify-center gap-2">
                  <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 border-0">
                    <Shield className="w-4 h-4 mr-2" />
                    Connexion sécurisée
                  </Badge>
                  <Badge variant="outline" className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Données préservées
                  </Badge>
                </div>

                {loginAttempts > 0 && (
                  <div className="text-center">
                    <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                      <Target className="w-4 h-4 mr-2" />
                      Tentative #{loginAttempts}
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6 relative">
                {/* Error display */}
                {errors.general && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">{errors.general}</span>
                  </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email impérial
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        'h-12 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 transition-all duration-300 focus:scale-[1.02]',
                        errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                      )}
                      placeholder="empereur@empire.com"
                      required
                    />
                    {errors.email && (
                      <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Mot de passe secret
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={cn(
                          'h-12 pr-12 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 transition-all duration-300 focus:scale-[1.02]',
                          errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                        )}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                        Se souvenir de moi
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !isLoaded}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg border-0 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Reconnexion en cours...
                      </>
                    ) : (
                      <>
                        <Crown className="w-6 h-6 mr-3" />
                        Reprendre le Pouvoir
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>

                <Separator className="my-6" />

                {/* Sign up link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Nouveau dans l'empire ?{' '}
                    <Link
                      href="/sign-up"
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                    >
                      Créer votre empire
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </p>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <Link href="/demo">
                      <Globe className="w-4 h-4" />
                      Démonstration
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <Link href="/guide">
                      <Star className="w-4 h-4" />
                      Guide Empereur
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Back link */}
            <div className="text-center mt-8">
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}