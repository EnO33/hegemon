// src/components/game/buildings/building-notifications.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, X } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CompletedBuilding {
  id: string;
  buildingType: string;
  action: 'build' | 'upgrade';
  targetLevel: number;
  cityName: string;
  completedAt: Date;
}

export const BuildingNotifications = () => {
  const [completedBuildings, setCompletedBuildings] = useState<CompletedBuilding[]>([]);

  useEffect(() => {
    const checkCompletedBuildings = async () => {
      try {
        const response = await fetch('/api/game/completed-buildings');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.length > 0) {
            setCompletedBuildings(result.data);
            
            // Afficher une notification toast
            result.data.forEach((building: CompletedBuilding) => {
              const message = building.action === 'build' 
                ? `${building.buildingType} construit dans ${building.cityName}!`
                : `${building.buildingType} amélioré (Niv. ${building.targetLevel}) dans ${building.cityName}!`;
              
              toast.success(message, {
                duration: 6000,
              });
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des constructions:', error);
      }
    };

    // Vérifier au chargement puis toutes les 2 minutes
    checkCompletedBuildings();
    const interval = setInterval(checkCompletedBuildings, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const dismissNotification = (id: string) => {
    setCompletedBuildings(prev => prev.filter(b => b.id !== id));
  };

  if (completedBuildings.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {completedBuildings.map((building) => (
        <Card key={building.id} className="w-80 bg-green-50 border-green-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Construction terminée !
                  </h4>
                  <p className="text-sm text-green-700">
                    {building.buildingType} {building.action === 'upgrade' ? `(Niv. ${building.targetLevel})` : ''} 
                    dans {building.cityName}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(building.id)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};