// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}