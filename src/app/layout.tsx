
// src/app/layout.tsx - Version avec ThemeProvider
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/theme-context";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hegemon - Jeu de stratégie antique",
  description: "Construisez votre empire antique, gérez vos ressources et conquérez le monde méditerranéen dans ce jeu de stratégie en temps réel.",
  keywords: ["jeu", "stratégie", "antique", "empire", "gestion", "conquête"],
  authors: [{ name: "Hegemon Team" }],
  openGraph: {
    title: "Hegemon - Jeu de stratégie antique",
    description: "Construisez votre empire antique et conquérez le monde méditerranéen",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#d97706", // amber-600
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#111827",
        },
      }}
    >
      <html lang="fr" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}