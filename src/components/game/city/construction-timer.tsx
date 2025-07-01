// src/components/game/city/construction-timer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Hammer } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface ConstructionTimerProps {
  completesAt: Date;
  duration: number;
  buildingName: string;
  onComplete?: () => void;
}

export const ConstructionTimer = ({ 
  completesAt, 
  duration, 
  buildingName, 
  onComplete 
}: ConstructionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const completesAtTime = new Date(completesAt).getTime();
      const remaining = Math.max(0, completesAtTime - now);
      
      setTimeLeft(remaining);
      setProgress(Math.max(0, Math.min(100, 
        ((duration * 1000 - remaining) / (duration * 1000)) * 100
      )));

      if (remaining <= 0 && onComplete) {
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [completesAt, duration, onComplete]);

  if (timeLeft <= 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-600">
            <Hammer className="w-4 h-4" />
            <span className="font-medium">{buildingName} terminé !</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Construction en cours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">{buildingName}</span>
            <span className="text-xs text-gray-500">
              {formatTime(Math.floor(timeLeft / 1000))}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};