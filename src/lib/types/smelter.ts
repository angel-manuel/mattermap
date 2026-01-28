import type { Location, CountryCode, Production } from './common';

export interface FeedSource { mineId: string; percentage?: number; source?: string; }

export interface ByproductProduction {
  metal: 'Ag' | 'Au' | 'Mo' | 'Se' | 'Te';  // Chemical symbol
  amount: number;
  unit: 'oz' | 't' | 'kg';  // ounces, tonnes, kilograms
  year: number;
  estimated?: boolean;  // true if calculated, false if actual data
  source?: string;
}

export interface Smelter {
  id: string;
  name: string;
  location: Location;
  country: CountryCode;
  capacity?: Production;
  feedsFrom: FeedSource[];
  owner?: string;
  source?: string;
  byproducts?: ByproductProduction[];
}
