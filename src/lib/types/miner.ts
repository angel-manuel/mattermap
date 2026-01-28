import type { Location, CountryCode } from './common';

export interface Miner {
  id: string;
  name: string;
  hqLocation: Location;
  country: CountryCode;
  website?: string;
  source?: string;
}
