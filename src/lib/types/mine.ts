import type { Location, CountryCode, Production } from './common';

export interface OwnershipStake { minerId: string; percentage: number; }
export interface ProductionFlow { smelterId: string; percentage?: number; source?: string; }
export interface Mine {
  id: string;
  name: string;
  location: Location;
  country: CountryCode;
  production?: Production;
  ownedBy: OwnershipStake[];
  feedsTo: ProductionFlow[];
  type?: 'open-pit' | 'underground' | 'mixed';
  source?: string;
}
