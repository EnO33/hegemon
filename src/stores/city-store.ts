// src/stores/city-store.ts (version corrigée)
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { getUserCity } from '@/actions/user/get-user-data';
import { buildBuilding, upgradeBuilding } from '@/actions/building/build-building';
import toast from 'react-hot-toast';
import type { DbCity } from '@/types/database';
import type { BuildingType } from '@/types';

interface BuildingQueue {
  id: string;
  buildingType: string;
  action: 'build' | 'upgrade';
  targetLevel: number;
  duration: number;
  completesAt: Date;
  woodCost: number;
  stoneCost: number;
  silverCost: number;
}

interface CityState {
  // État
  currentCity: DbCity | null;
  buildingQueue: BuildingQueue[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  actions: {
    loadCity: (cityId: string) => Promise<void>;
    buildBuilding: (buildingType: BuildingType) => Promise<boolean>;
    upgradeBuilding: (buildingId: string) => Promise<boolean>;
    updateResources: (resources: Partial<DbCity>) => void;
    refreshCity: () => Promise<void>;
    reset: () => void;
  };
}

const initialState = {
  currentCity: null,
  buildingQueue: [],
  isLoading: false,
  error: null,
};

export const useCityStore = create<CityState>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initialState,
        
        actions: {
          loadCity: async (cityId: string) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await getUserCity(cityId);
              
              if (result.success && result.data) {
                // S'assurer que les unités existent (compatibilité)
                const cityWithUnits: DbCity = {
                  ...result.data,
                  units: result.data.units || [],
                };
                
                set({
                  currentCity: cityWithUnits,
                  isLoading: false,
                  error: null,
                });
              } else {
                set({
                  error: result.error || 'Erreur de chargement',
                  isLoading: false,
                });
                toast.error(result.error || 'Erreur de chargement de la cité');
              }
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Erreur inconnue';
              set({
                error: message,
                isLoading: false,
              });
              toast.error(message);
            }
          },

          buildBuilding: async (buildingType: BuildingType) => {
            const { currentCity } = get();
            if (!currentCity) return false;

            set({ isLoading: true });

            try {
              const result = await buildBuilding({
                buildingType,
                cityId: currentCity.id,
              });

              if (result.success) {
                toast.success(result.message || 'Construction commencée !');
                // Recharger la cité pour avoir les nouvelles ressources
                await get().actions.refreshCity();
                set({ isLoading: false });
                return true;
              } else {
                const message = result.error || 'Erreur de construction';
                set({ 
                  error: message,
                  isLoading: false 
                });
                toast.error(message);
                return false;
              }
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Erreur inconnue';
              set({
                error: message,
                isLoading: false,
              });
              toast.error(message);
              return false;
            }
          },

          upgradeBuilding: async (buildingId: string) => {
            const { currentCity } = get();
            if (!currentCity) return false;

            set({ isLoading: true });

            try {
              const result = await upgradeBuilding({
                buildingId,
                cityId: currentCity.id,
              });

              if (result.success) {
                toast.success(result.message || 'Amélioration commencée !');
                await get().actions.refreshCity();
                set({ isLoading: false });
                return true;
              } else {
                const message = result.error || 'Erreur d\'amélioration';
                set({ 
                  error: message,
                  isLoading: false 
                });
                toast.error(message);
                return false;
              }
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Erreur inconnue';
              set({
                error: message,
                isLoading: false,
              });
              toast.error(message);
              return false;
            }
          },

          updateResources: (resources: Partial<DbCity>) => {
            const { currentCity } = get();
            if (!currentCity) return;

            set({
              currentCity: {
                ...currentCity,
                ...resources,
              },
            });
          },

          refreshCity: async () => {
            const { currentCity } = get();
            if (!currentCity) return;

            try {
              const result = await getUserCity(currentCity.id);
              if (result.success && result.data) {
                // S'assurer que les unités existent
                const cityWithUnits: DbCity = {
                  ...result.data,
                  units: result.data.units || [],
                };
                
                set({
                  currentCity: cityWithUnits,
                  error: null,
                });
              }
            } catch (error) {
              console.error('Erreur lors du rafraîchissement:', error);
            }
          },

          reset: () => {
            set(initialState);
          },
        },
      }),
      { name: 'city-store' }
    )
  )
);

// Sélecteurs pour éviter les re-renders inutiles
export const useCityBuildings = () => useCityStore((state) => state.currentCity?.buildings || []);
export const useCityUnits = () => useCityStore((state) => state.currentCity?.units || []);
export const useCityResources = () => useCityStore((state) => ({
  wood: state.currentCity?.wood || 0,
  stone: state.currentCity?.stone || 0,
  silver: state.currentCity?.silver || 0,
  population: state.currentCity?.population || 0,
  populationUsed: state.currentCity?.populationUsed || 0,
}));
export const useCityProduction = () => useCityStore((state) => ({
  woodProduction: state.currentCity?.woodProduction || 0,
  stoneProduction: state.currentCity?.stoneProduction || 0,
  silverProduction: state.currentCity?.silverProduction || 0,
}));
export const useCityActions = () => useCityStore((state) => state.actions);
export const useCityLoading = () => useCityStore((state) => state.isLoading);
export const useCityError = () => useCityStore((state) => state.error);