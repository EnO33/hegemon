// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx - Version Ultra-Moderne avec ShadCN UI
'use client';

import { useState, useEffect } from 'react';
import { useSignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMountAnimation } from '@/hooks/use-mount-animation';
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
  Check,
  Shield,
  Zap,
  Users,
  Globe,
  Sword,
  Coins,
  Sparkles,
  Star,
  Trophy,
  Flame,
  ChevronRight,
  Lightbulb,
  Rocket,
  Target,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Castle,
    title: 'Empire Mythique',
    description: 'Forgez une civilisation légendaire',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Sword,
    title: 'Conquête Épique',
    description: 'Dominez par la stratégie et la guerre',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Users,
    title: 'Alliances Stratégiques',
    description: 'Unissez-vous pour la gloire éternelle',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Trophy,
    title: 'Gloire Immortelle',
    description: 'Votre nom gravé dans l\'histoire',
    color: 'from-amber-500 to-orange-500'
  }
];

const strengthIndicators = [
  { label: 'Très faible', color: 'bg-red-500', threshold: 0 },
  { label: 'Faible', color: 'bg-orange-500', threshold: 20 },
  { label: 'Moyen', color: 'bg-yellow-500', threshold: 40 },
  { label: 'Fort', color: 'bg-blue-500', threshold: 60 },
  { label: 'Très fort', color: 'bg-green-500', threshold: 80 }
];

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;
  return Math.min(strength, 100);
}

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const isMounted = useMountAnimation();

  // États du formulaire
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
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Animations CSS statiques
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .float-animation { animation: float 3s ease-in-out infinite; }
      .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      .gradient-shift { animation: gradient-shift 8s ease-in-out infinite; background-size: 200% 200%; }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); }
        50% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.4); }
      }
      
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Password strength calculation
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

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

  // État de chargement initial
  if (isUserLoaded && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
              <Castle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-2">
              Redirection vers votre Empire
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Préparation de votre règne...
            </CardDescription>
            <Progress value={75} className="mt-4 h-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // État de vérification email
  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 float-animation"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-40"></div>
          <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-50"></div>
        </div>

        {/* Header */}
        <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 float-animation">
                <Castle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Imperium
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Jeu de stratégie antique</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Verification Form */}
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/20">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 pulse-glow">
                  <Mail className="w-12 h-12 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Vérification Email
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                    Votre empire vous attend ! Vérifiez votre email pour commencer votre règne.
                  </CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-800 dark:text-emerald-200 border-0">
                  <Mail className="w-4 h-4 mr-2" />
                  {formData.email}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {errors.code && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">{errors.code}</span>
                  </div>
                )}

                <form onSubmit={handleVerification} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Code de vérification
                    </Label>
                    <Input
                      id="verification-code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="text-center text-2xl tracking-widest font-mono h-14 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 focus:border-emerald-500 dark:focus:border-emerald-400"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !code}
                    className="w-full h-14 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Vérification en cours...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-6 h-6 mr-3" />
                        Lancer mon Empire
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vous n'avez pas reçu le code ?
                  </p>
                  <Button variant="outline" size="sm" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700">
                    Renvoyer le code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Calculer l'indicateur de force du mot de passe
  const strengthIndicator = strengthIndicators.find((indicator, index) => {
    const nextIndicator = strengthIndicators[index + 1];
    return passwordStrength >= indicator.threshold && (!nextIndicator || passwordStrength < nextIndicator.threshold);
  }) || strengthIndicators[0];

  // Formulaire principal d'inscription
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/20 to-red-300/20 dark:from-amber-600/10 dark:to-red-600/10 rounded-full blur-3xl gradient-shift" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Header */}
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/25 float-animation">
                <Castle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                  Imperium
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Jeu de stratégie antique</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Bêta ouverte
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
            {/* Hero section */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-red-500/10 dark:from-amber-600/20 dark:to-red-600/20 rounded-full border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm">
                <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400 float-animation" />
                <span className="font-semibold text-amber-800 dark:text-amber-200">
                  Rejoignez plus de 10,000 Empereurs
                </span>
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>

              <div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent block">
                    Forgez votre
                  </span>
                  <span className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent block gradient-shift">
                    Légende
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Bâtissez un empire antique, menez vos légions à la victoire et
                  inscrivez votre nom dans l'histoire éternelle. L'âge des héros commence maintenant.
                </p>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, label: '10k+ Joueurs', value: '10,247', color: 'from-blue-500 to-cyan-500' },
                  { icon: Castle, label: 'Cités Fondées', value: '47,892', color: 'from-green-500 to-emerald-500' },
                  { icon: Trophy, label: 'Batailles', value: '123,456', color: 'from-purple-500 to-pink-500' }
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
                Votre empire vous attend
              </h3>
              {features.map((feature, index) => {
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

            {/* Social proof avatars */}
            <Card className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm border-amber-200/50 dark:border-amber-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar key={i} className="w-12 h-12 border-2 border-white dark:border-gray-800">
                        <AvatarFallback className={cn(
                          'bg-gradient-to-br text-white font-bold text-sm',
                          i % 2 === 0 ? 'from-blue-500 to-purple-500' : 'from-red-500 to-pink-500'
                        )}>
                          {String.fromCharCode(64 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Rejoignez la communauté
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Des milliers d'empereurs en ligne maintenant
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      4.9/5 étoiles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Formulaire */}
          <div className={cn(
            'transition-all duration-1000 order-1 lg:order-2',
            isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          )}>
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 shadow-2xl shadow-amber-500/10 dark:shadow-amber-400/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 dark:from-amber-600/10 dark:via-orange-600/10 dark:to-red-600/10" />

              <CardHeader className="text-center space-y-4 pb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25 pulse-glow">
                  <Crown className="w-10 h-10 text-white" />
                </div>

                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                    Fonder votre Empire
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                    Le pouvoir absolu vous attend
                  </CardDescription>
                </div>

                <div className="flex justify-center gap-2">
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 border-0">
                    <Zap className="w-4 h-4 mr-2" />
                    Gratuit à vie
                  </Badge>
                  <Badge variant="outline" className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Sans pub
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 relative">
                {/* Progress indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                      currentStep >= 1 ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    )}>
                      1
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Informations</span>
                  </div>
                  <div className="flex-1 h-2 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                      style={{ width: `${(currentStep / 2) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                      currentStep >= 2 ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    )}>
                      2
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Vérification</span>
                  </div>
                </div>

                {/* Error display */}
                {errors.general && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">{errors.general}</span>
                  </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div id="clerk-captcha" />

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Adresse email impériale
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        'h-12 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 transition-all duration-300 focus:scale-[1.02]',
                        errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400'
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

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom d'empereur
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={cn(
                        'h-12 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 transition-all duration-300 focus:scale-[1.02]',
                        errors.username ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400'
                      )}
                      placeholder="Caesar Magnus"
                      required
                    />
                    {errors.username && (
                      <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.username}
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
                          errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400'
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

                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Force du mot de passe
                          </span>
                          <span className={cn(
                            'text-xs font-medium',
                            strengthIndicator.color.replace('bg-', 'text-')
                          )}>
                            {strengthIndicator.label}
                          </span>
                        </div>
                        <Progress value={passwordStrength} className="h-2" />
                      </div>
                    )}

                    {errors.password && (
                      <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={cn(
                          'h-12 pr-12 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 transition-all duration-300 focus:scale-[1.02]',
                          errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400'
                        )}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !isLoaded}
                    className="w-full h-14 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-bold text-lg border-0 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Forgeage de l'empire en cours...
                      </>
                    ) : (
                      <>
                        <Flame className="w-6 h-6 mr-3" />
                        Fonder mon Empire Éternel
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Terms */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                  En créant votre empire, vous acceptez nos{' '}
                  <Link href="/terms" className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline">
                    conditions de conquête
                  </Link>{' '}
                  et notre{' '}
                  <Link href="/privacy" className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline">
                    charte de confidentialité
                  </Link>.
                </p>

                <Separator className="my-6" />

                {/* Sign in link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Déjà empereur ?{' '}
                    <Link
                      href="/sign-in"
                      className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                    >
                      Reconquérir votre trône
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}