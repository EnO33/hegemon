// src/components/game/buildings/building-queue-status.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Hammer, CheckCircle, Plus } from 'lucide-react';
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

interface BuildingQueueStatusProps {
  cityId: string;
}

const MAX_QUEUE_SLOTS = 2;

export const BuildingQueueStatus = ({ cityId }: BuildingQueueStatusProps) => {
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
            // Filtrer par cityId et trier par date de fin
            const cityQueue = result.data
              .filter((item: any) => item.cityId === cityId)
              .sort((a: any, b: any) => new Date(a.completesAt).getTime() - new Date(b.completesAt).getTime());
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

  // Créer les emplacements (2 maximum)
  const slots = Array.from({ length: MAX_QUEUE_SLOTS }, (_, index) => {
    const queueItem = queue[index];
    return { index, item: queueItem };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hammer className="w-5 h-5" />
          Queue de construction
        </CardTitle>
        <CardDescription>
          {queue.length}/{MAX_QUEUE_SLOTS} emplacements utilisés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {slots.map(({ index, item }) => (
          <div key={index} className="border rounded-lg p-3">
            {item ? (
              <ActiveQueueSlot
                item={item}
                currentTime={currentTime}
                position={index + 1}
              />
            ) : (
              <EmptyQueueSlot position={index + 1} />
            )}
          </div>
        ))}
        
        {queue.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 text-center">
              Les constructions se terminent automatiquement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant pour un emplacement actif
const ActiveQueueSlot = ({ 
  item, 
  currentTime, 
  position 
}: { 
  item: BuildingQueueItem; 
  currentTime: number; 
  position: number; 
}) => {
  const config = getBuildingConfig(item.buildingType as any);
  const completesAt = new Date(item.completesAt).getTime();
  const timeLeft = Math.max(0, completesAt - currentTime);
  const progress = Math.max(0, Math.min(100, 
    ((item.duration * 1000 - timeLeft) / (item.duration * 1000)) * 100
  ));
  const isCompleted = timeLeft <= 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={position === 1 ? "default" : "secondary"} className="text-xs">
            #{position}
          </Badge>
          <span className="font-medium text-sm">
            {config?.name || item.buildingType}
          </span>
          {item.action === 'upgrade' && (
            <Badge variant="outline" className="text-xs">
              Niv. {item.targetLevel}
            </Badge>
          )}
        </div>
        
        {isCompleted ? (
          <Badge variant="outline" className="text-green-600 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        ) : (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            {formatTime(Math.floor(timeLeft / 1000))}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <Progress value={progress} className="h-1.5" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {item.action === 'build' ? 'Construction' : 'Amélioration'}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

// Composant pour un emplacement vide
const EmptyQueueSlot = ({ position }: { position: number }) => {
  return (
    <div className="flex items-center gap-3 py-2 opacity-50">
      <Badge variant="outline" className="text-xs">
        #{position}
      </Badge>
      <div className="flex items-center gap-2 text-gray-400">
        <Plus className="w-4 h-4" />
        <span className="text-sm">Emplacement libre</span>
      </div>
    </div>
  );
};