// src/components/game/buildings/building-queue.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Hammer, CheckCircle } from 'lucide-react';
import { getBuildingConfig } from '@/lib/constants/buildings';
import { formatTime } from '@/lib/utils';

interface BuildingQueueItem {
  id: string;
  buildingType: string;
  action: 'build' | 'upgrade';
  targetLevel: number;
  completesAt: string;
  duration: number;
}

interface BuildingQueueProps {
  cityId: string;
}

export const BuildingQueue = ({ cityId }: BuildingQueueProps) => {
  const [queue, setQueue] = useState<BuildingQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Mettre à jour l'heure actuelle toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Charger la queue de construction
  useEffect(() => {
    const loadQueue = async () => {
      try {
        const response = await fetch('/api/game/building-queue');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Filtrer par cityId
            const cityQueue = result.data.filter((item: any) => item.cityId === cityId);
            setQueue(cityQueue);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la queue:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQueue();
    
    // Recharger toutes les 30 secondes
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, [cityId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Chargement de la queue...</div>
        </CardContent>
      </Card>
    );
  }

  if (queue.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer className="w-5 h-5" />
            Queue de construction
          </CardTitle>
          <CardDescription>
            Aucune construction en cours
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hammer className="w-5 h-5" />
          Queue de construction
        </CardTitle>
        <CardDescription>
          {queue.length} construction(s) en cours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {queue.map((item, index) => {
          const config = getBuildingConfig(item.buildingType as any);
          const completesAt = new Date(item.completesAt).getTime();
          const timeLeft = Math.max(0, completesAt - currentTime);
          const progress = Math.max(0, Math.min(100, 
            ((item.duration * 1000 - timeLeft) / (item.duration * 1000)) * 100
          ));
          const isCompleted = timeLeft <= 0;

          return (
            <div 
              key={item.id} 
              className={`p-4 border rounded-lg ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {index === 0 ? 'En cours' : `Position ${index + 1}`}
                  </Badge>
                  <span className="font-medium">
                    {config?.name || item.buildingType}
                  </span>
                  {item.action === 'upgrade' && (
                    <Badge variant="outline">
                      Niveau {item.targetLevel}
                    </Badge>
                  )}
                </div>
                
                {isCompleted ? (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Terminé
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    {formatTime(Math.floor(timeLeft / 1000))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.action === 'build' ? 'Construction' : 'Amélioration'}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};