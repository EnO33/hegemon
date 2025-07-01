// src/components/ui/floating-action-button.tsx
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const FloatingActionButton = ({
  onClick,
  icon: Icon,
  label,
  variant = 'primary',
  className
}: FloatingActionButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25',
    secondary: 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg shadow-black/10 border border-white/20 dark:border-white/10',
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 h-14 w-14 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 z-50',
        variants[variant],
        className
      )}
      title={label}
    >
      <Icon className="w-6 h-6" />
    </Button>
  );
};