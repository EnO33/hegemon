// types/api.ts - Types API
import { z } from 'zod';

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.date(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
};

// États de chargement
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}