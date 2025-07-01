// src/types/database.ts (version corrigée)
import type { Prisma } from '@prisma/client';

// Types basés sur Prisma - synchronisés automatiquement avec le schéma
export type DbUser = Prisma.UserGetPayload<{
  include: {
    gameProfile: true;
    cities: {
      include: {
        buildings: true;
        units: true;
      };
    };
  };
}>;

export type DbCity = Prisma.CityGetPayload<{
  include: {
    buildings: true;
    units: true;
  };
}>;

export type DbBuilding = Prisma.BuildingGetPayload<{}>;

export type DbUnit = Prisma.UnitGetPayload<{}>;

export type DbGameProfile = Prisma.GameProfileGetPayload<{}>;

export type DbBuildingQueue = Prisma.BuildingQueueGetPayload<{}>;

// Type pour les cités sans unités (pour la compatibilité)
export type DbCityBasic = Prisma.CityGetPayload<{
  include: {
    buildings: true;
  };
}> & {
  units?: DbUnit[];
};

// Types pour les réponses d'API
export interface UserDataResponse {
  user: {
    id: string;
    email: string;
    username: string;
    avatar: string | null;
  };
  gameProfile: DbGameProfile | null;
  cities: DbCity[];
}

// Types pour les actions
export interface CityWithBasicInfo {
  id: string;
  name: string;
}

export interface UserWithCities {
  id: string;
  cities: CityWithBasicInfo[];
  gameProfile: DbGameProfile | null;
}