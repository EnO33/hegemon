// src/components/layout/cta-section.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CTASection = () => {
  const { user, isLoaded } = useUser();

  // Ne pas afficher la CTA si l'utilisateur est connecté
  if (!isLoaded || user) {
    return null;
  }

  return (
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
              <Link href="/sign-up">
                Créer mon compte
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};