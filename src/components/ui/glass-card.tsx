// src/components/ui/glass-card.tsx
'use client';

import { cn } from '@/lib/utils';
import { useMountAnimation } from '@/hooks/use-mount-animation';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  animate?: boolean;
  delay?: number;
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = 'default',
  animate = true,
  delay = 0
}: GlassCardProps) => {
  const isMounted = useMountAnimation(delay);

  const variants = {
    default: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10',
    elevated: 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/30 dark:border-white/20 shadow-xl shadow-black/5 dark:shadow-black/20',
    subtle: 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-white/10 dark:border-white/5',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-500',
        variants[variant],
        animate && (isMounted 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95'
        ),
        className
      )}
    >
      {children}
    </div>
  );
};