import type { Location, CountryCode, Production } from './common';

export interface FeedSource { mineId: string; percentage?: number; source?: string; }
export interface Smelter {
  id: string;
  name: string;
  location: Location;
  country: CountryCode;
  capacity?: Production;
  feedsFrom: FeedSource[];
  owner?: string;
  source?: string;
}
