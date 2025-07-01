// src/components/ui/theme-toggle.tsx
'use client';

import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Clair' },
    { value: 'dark', icon: Moon, label: 'Sombre' },
    { value: 'system', icon: Monitor, label: 'Système' },
  ] as const;

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl', className)}>
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          onClick={() => setTheme(value)}
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-8 p-0 rounded-lg transition-all duration-200',
            theme === value
              ? 'bg-white/20 dark:bg-white/10 text-amber-600 dark:text-amber-400 scale-110'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5'
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};
