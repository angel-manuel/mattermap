// Generic facility type for all processing stages across all materials

import type { Location, CountryCode, Production } from './common';
import type { ByproductProduction } from './smelter';

export interface OwnershipStake {
  companyId: string;
  percentage: number;
}

export interface MaterialFlow {
  targetId: string;
  targetType: string;      // Facility type of destination (e.g., 'smelter', 'blast_furnace')
  percentage?: number;
  source?: string;
}

export interface Facility {
  id: string;
  type: string;            // Facility type: 'mine', 'smelter', 'blast_furnace', etc.
  name: string;
  location: Location;
  country: CountryCode;
  capacity?: Production;
  ownedBy: OwnershipStake[];
  feedsTo: MaterialFlow[];
  feedsFrom: MaterialFlow[];

  // Optional fields
  miningMethod?: 'open-pit' | 'underground' | 'mixed' | 'placer' | 'mineral-sands';
  processType?: string;    // For processing facilities
  byproducts?: ByproductProduction[];
  source?: string;
  status?: 'operating' | 'construction' | 'suspended' | 'closed';
  notes?: string;
}

// Type guard
export function isFacility(obj: unknown): obj is Facility {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'type' in obj &&
    'name' in obj &&
    'location' in obj
  );
}
