import type { Mine, Miner, Smelter, MaterialId, Facility, Company } from '$lib/types';
import { MATERIAL_CONFIGS } from '$lib/types';

export type EntityType = 'mine' | 'smelter' | 'miner' | 'country' | string; // string for generic facility types

// Svelte 5 runes-based store (using .svelte.ts extension)
export const appState = $state({
  // Current material selection
  currentMaterial: 'copper' as MaterialId,

  // Legacy copper-specific data (for backward compatibility)
  mines: [] as Mine[],
  smelters: [] as Smelter[],
  miners: [] as Miner[],

  // New generic data structure for multi-metal
  facilities: [] as Facility[],
  companies: [] as Company[],

  selectedEntity: null as { type: EntityType; id: string } | null,
  iconScale: 0.5 // Default to half size (range: 0.25 to 2)
});

// Material management
export function setMaterial(materialId: MaterialId) {
  appState.currentMaterial = materialId;
  // Clear selection when changing materials
  appState.selectedEntity = null;
}

export function getMaterialConfig() {
  return MATERIAL_CONFIGS[appState.currentMaterial];
}

export function setIconScale(scale: number) {
  appState.iconScale = Math.max(0.25, Math.min(2, scale));
}

export function setMines(data: Mine[]) {
  appState.mines = data;
}

export function setSmelters(data: Smelter[]) {
  appState.smelters = data;
}

export function setMiners(data: Miner[]) {
  appState.miners = data;
}

export function selectEntity(type: EntityType, id: string) {
  appState.selectedEntity = { type, id };
}

export function clearSelection() {
  appState.selectedEntity = null;
}

// Derived helpers
export function getMineById(id: string): Mine | undefined {
  return appState.mines.find(m => m.id === id);
}

export function getSmelterById(id: string): Smelter | undefined {
  return appState.smelters.find(s => s.id === id);
}

export function getMinerById(id: string): Miner | undefined {
  return appState.miners.find(m => m.id === id);
}

export function getSelectedMine(): Mine | undefined {
  if (appState.selectedEntity?.type === 'mine') {
    return getMineById(appState.selectedEntity.id);
  }
  return undefined;
}

export function getSelectedSmelter(): Smelter | undefined {
  if (appState.selectedEntity?.type === 'smelter') {
    return getSmelterById(appState.selectedEntity.id);
  }
  return undefined;
}

export function getSelectedMiner(): Miner | undefined {
  if (appState.selectedEntity?.type === 'miner') {
    return getMinerById(appState.selectedEntity.id);
  }
  return undefined;
}

// Country helpers
export interface CountryStats {
  code: string;
  mineCount: number;
  smelterCount: number;
  totalProduction: number;
  totalCapacity: number;
  mines: Mine[];
  smelters: Smelter[];
}

export function getCountryStats(countryCode: string): CountryStats {
  const mines = appState.mines.filter(m => m.country === countryCode);
  const smelters = appState.smelters.filter(s => s.country === countryCode);

  return {
    code: countryCode,
    mineCount: mines.length,
    smelterCount: smelters.length,
    totalProduction: mines.reduce((sum, m) => sum + (m.production?.amount || 0), 0),
    totalCapacity: smelters.reduce((sum, s) => sum + (s.capacity?.amount || 0), 0),
    mines,
    smelters
  };
}

export function getCountriesWithEntities(): string[] {
  const countries = new Set<string>();
  appState.mines.forEach(m => countries.add(m.country));
  appState.smelters.forEach(s => countries.add(s.country));
  return Array.from(countries);
}

// =============================================================================
// Generic Facility/Company functions for multi-metal support
// =============================================================================

export function setFacilities(data: Facility[]) {
  appState.facilities = data;
}

export function setCompanies(data: Company[]) {
  appState.companies = data;
}

export function getFacilityById(id: string): Facility | undefined {
  return appState.facilities.find(f => f.id === id);
}

export function getCompanyById(id: string): Company | undefined {
  return appState.companies.find(c => c.id === id);
}

export function getFacilitiesByType(facilityType: string): Facility[] {
  return appState.facilities.filter(f => f.type === facilityType);
}

export function getSelectedFacility(): Facility | undefined {
  if (appState.selectedEntity) {
    return getFacilityById(appState.selectedEntity.id);
  }
  return undefined;
}

// Generic country stats for facilities
export interface GenericCountryStats {
  code: string;
  facilityCounts: Record<string, number>;
  facilities: Facility[];
  totalCapacity: number;
}

export function getGenericCountryStats(countryCode: string): GenericCountryStats {
  const facilities = appState.facilities.filter(f => f.country === countryCode);
  const facilityCounts: Record<string, number> = {};

  facilities.forEach(f => {
    facilityCounts[f.type] = (facilityCounts[f.type] || 0) + 1;
  });

  return {
    code: countryCode,
    facilityCounts,
    facilities,
    totalCapacity: facilities.reduce((sum, f) => sum + (f.capacity?.amount || 0), 0)
  };
}

export function getCountriesWithFacilities(): string[] {
  const countries = new Set<string>();
  appState.facilities.forEach(f => countries.add(f.country));
  return Array.from(countries);
}
