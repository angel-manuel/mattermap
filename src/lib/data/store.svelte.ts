import type { Mine, Miner, Smelter } from '$lib/types';

export type EntityType = 'mine' | 'smelter' | 'miner' | 'country';

// Svelte 5 runes-based store (using .svelte.ts extension)
export const appState = $state({
  mines: [] as Mine[],
  smelters: [] as Smelter[],
  miners: [] as Miner[],
  selectedEntity: null as { type: EntityType; id: string } | null,
  iconScale: 0.5 // Default to half size (range: 0.25 to 2)
});

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
