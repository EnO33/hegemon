// src/components/ui/animated-counter.tsx
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 1000, 
  className,
  formatter = (val) => val.toString()
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = displayValue;
    const difference = value - startValue;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.floor(startValue + difference * easeOutCubic));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, displayValue]);

  return (
    <span className={cn('tabular-nums', className)}>
      {formatter(displayValue)}
    </span>
  );
};