// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/city(.*)',
  '/profile(.*)',
  '/world(.*)',
  '/alliance(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protéger les routes qui nécessitent une authentification
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      // Rediriger vers la page de connexion si non authentifié
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};