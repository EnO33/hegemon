// types/user.ts - Types utilisateur
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(20),
  avatar: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLogin: z.date().optional(),
  isActive: z.boolean().default(true),
});

export type User = z.infer<typeof userSchema>;

// Profil de jeu
export const gameProfileSchema = z.object({
  userId: z.string().uuid(),
  totalPoints: z.number().int().min(0),
  citiesCount: z.number().int().min(0),
  rank: z.number().int().min(1),
  level: z.number().int().min(1),
  experience: z.number().int().min(0),
  settings: z.object({
    language: z.enum(['fr', 'en']).default('fr'),
    notifications: z.boolean().default(true),
    soundEnabled: z.boolean().default(true),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  }),
});

export type GameProfile = z.infer<typeof gameProfileSchema>;

// Types pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z.string()
    .min(3, 'Nom d\'utilisateur trop court')
    .max(20, 'Nom d\'utilisateur trop long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Caractères alphanumériques uniquement'),
  password: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Doit contenir maj, min et chiffre'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;