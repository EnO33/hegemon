// src/components/game/buildings/building-queue-status.tsx (version séquentielle)
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Hammer, CheckCircle, Plus, Pause, Play } from 'lucide-react';
import { getBuildingConfig } from '@/lib/constants/buildings';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface BuildingQueueItem {
  id: string;
  buildingType: string;
  action: 'build' | 'upgrade';
  targetLevel: number;
  completesAt: string;
  startedAt: string;
  duration: number;
  status: 'in_progress' | 'pending' | 'completed';
}

interface BuildingQueueStatusProps {
  cityId: string;
  onBuildingCompleted?: () => void;
}

const MAX_QUEUE_SLOTS = 2;

export const BuildingQueueStatus = ({ cityId, onBuildingCompleted }: BuildingQueueStatusProps) => {
  const [queue, setQueue] = useState<BuildingQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isProcessingTick, setIsProcessingTick] = useState(false);

  // Mettre à jour l'heure actuelle toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  

  // Charger la queue de construction
  const loadQueue = useCallback(async () => {
    try {
      const response = await fetch('/api/game/building-queue');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Filtrer par cityId et trier par ordre de démarrage
          const cityQueue = result.data
            .filter((item: any) => item.cityId === cityId)
            .filter((item: any) => item.status !== 'completed')
            .sort((a: any, b: any) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
          setQueue(cityQueue);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la queue:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  // Fonction pour déclencher une vérification optimisée
  const triggerTick = useCallback(async () => {
    if (isProcessingTick) return;
    
    setIsProcessingTick(true);
    try {
      // Utiliser l'endpoint optimisé qui ne vérifie que nos constructions
      const response = await fetch('/api/game/check-buildings', {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔄 Vérification constructions:', result);
        
        if (result.hasCompletedBuildings && result.processed?.buildings > 0) {
          toast.success(`${result.processed.buildings} construction(s) terminée(s) !`);
          
          // Recharger la queue après la finalisation
          setTimeout(() => {
            loadQueue();
            if (onBuildingCompleted) {
              onBuildingCompleted();
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    } finally {
      setIsProcessingTick(false);
    }
  }, [isProcessingTick, onBuildingCompleted, loadQueue]);

  // Détecter les constructions terminées côté client
  useEffect(() => {
    const completedBuildings = queue.filter(item => {
      if (item.status !== 'in_progress') return false;
      const completesAt = new Date(item.completesAt).getTime();
      return currentTime >= completesAt;
    });

    // Si des constructions sont terminées côté client, déclencher un tick
    if (completedBuildings.length > 0 && !isProcessingTick) {
      console.log(`🎯 Détection côté client: ${completedBuildings.length} construction(s) terminée(s)`);
      triggerTick();
    }
  }, [currentTime, queue, triggerTick, isProcessingTick]);

  useEffect(() => {
    loadQueue();
    
    // Recharger toutes les 30 secondes (comme backup)
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, [loadQueue]);

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
          File de construction
          {isProcessingTick && (
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          )}
        </CardTitle>
        <CardDescription>
          {queue.length}/{MAX_QUEUE_SLOTS} emplacements • Construction séquentielle
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
              ⚡ Les constructions démarrent automatiquement quand la précédente se termine
            </p>
            {isProcessingTick && (
              <p className="text-xs text-amber-600 text-center mt-1">
                🔄 Finalisation en cours...
              </p>
            )}
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
  const startedAt = new Date(item.startedAt).getTime();
  
  // Calculer le temps restant et le progrès
  let timeLeft = 0;
  let progress = 0;
  let isCompleted = false;
  
  if (item.status === 'in_progress') {
    timeLeft = Math.max(0, completesAt - currentTime);
    progress = Math.max(0, Math.min(100, 
      ((item.duration * 1000 - timeLeft) / (item.duration * 1000)) * 100
    ));
    isCompleted = timeLeft <= 0;
  } else if (item.status === 'pending') {
    // Pour les constructions en attente, afficher le temps total
    timeLeft = item.duration * 1000;
    progress = 0;
  }

  // Déterminer le badge de statut
  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge variant="outline" className="text-green-600 text-xs animate-pulse">
          <CheckCircle className="w-3 h-3 mr-1" />
          Finalisation...
        </Badge>
      );
    }
    
    if (item.status === 'in_progress') {
      return (
        <Badge variant="default" className="text-xs">
          <Play className="w-3 h-3 mr-1" />
          En cours
        </Badge>
      );
    }
    
    if (item.status === 'pending') {
      return (
        <Badge variant="secondary" className="text-xs">
          <Pause className="w-3 h-3 mr-1" />
          En attente
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
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
        
        {getStatusBadge()}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">
            {item.action === 'build' ? 'Construction' : 'Amélioration'}
          </span>
          {item.status === 'in_progress' && !isCompleted && (
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3 h-3" />
              {formatTime(Math.floor(timeLeft / 1000))}
            </div>
          )}
          {item.status === 'pending' && (
            <div className="flex items-center gap-1 text-amber-600">
              <Clock className="w-3 h-3" />
              {formatTime(Math.floor(timeLeft / 1000))} (durée)
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              Finalisation...
            </div>
          )}
        </div>
        
        <Progress 
          value={progress} 
          className={`h-1.5 ${
            item.status === 'pending' ? 'opacity-50' : 
            isCompleted ? 'bg-green-100' : ''
          }`} 
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {isCompleted ? 'Finalisation en cours...' :
             item.status === 'pending' ? 'Attend la construction précédente' : 
             item.status === 'in_progress' ? 'Construction active' : 'Terminé'}
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