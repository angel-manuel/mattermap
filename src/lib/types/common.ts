export interface Coordinates { lat: number; lng: number; }
export interface Location { name: string; coordinates: Coordinates; }
export type CountryCode = string; // ISO 3166-1 alpha-2
export interface Production { amount: number; unit: 'kt' | 'Mt'; year: number; }
