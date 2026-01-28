// Company type (generalized from Miner)

import type { Location, CountryCode } from './common';

export interface Company {
  id: string;
  name: string;
  hqLocation: Location;
  country: CountryCode;
  website?: string;
  source?: string;
}

// Alias for backward compatibility
export type Miner = Company;
