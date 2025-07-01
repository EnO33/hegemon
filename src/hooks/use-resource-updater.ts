// src/hooks/use-resource-updater.ts (version complète)
import { useEffect, useRef } from 'react';
import { useCityStore } from '@/stores/city-store';

export const useResourceUpdater = (cityId?: string) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { currentCity, actions } = useCityStore();

  useEffect(() => {
    if (!cityId || !currentCity) return;

    // Fonction pour mettre à jour les ressources localement
    const updateLocalResources = () => {
      const now = Date.now();
      const lastUpdate = new Date(currentCity.lastResourceUpdate).getTime();
      const timeDiffHours = (now - lastUpdate) / (1000 * 60 * 60);

      if (timeDiffHours > 0.0003) { // Plus d'une seconde
        const newWood = Math.min(
          999999999, // Limite maximum
          Math.floor(currentCity.wood + (currentCity.woodProduction * timeDiffHours))
        );
        const newStone = Math.min(
          999999999,
          Math.floor(currentCity.stone + (currentCity.stoneProduction * timeDiffHours))
        );
        const newSilver = Math.min(
          999999999,
          Math.floor(currentCity.silver + (currentCity.silverProduction * timeDiffHours))
        );

        actions.updateResources({
          wood: newWood,
          stone: newStone,
          silver: newSilver,
          lastResourceUpdate: new Date(),
        });
      }
    };

    // Mettre à jour toutes les secondes pour l'affichage fluide
    intervalRef.current = setInterval(updateLocalResources, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cityId, currentCity, actions]);

  // Synchroniser avec le serveur toutes les 5 minutes
  useEffect(() => {
    if (!cityId) return;

    const syncInterval = setInterval(() => {
      actions.refreshCity();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, [cityId, actions]);

  // Synchroniser quand l'utilisateur revient sur l'onglet
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && cityId) {
        // Décalage de 500ms pour éviter les conflits
        setTimeout(() => {
          actions.refreshCity();
        }, 500);
      }
    };

    const handleFocus = () => {
      if (cityId) {
        setTimeout(() => {
          actions.refreshCity();
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [cityId, actions]);
};