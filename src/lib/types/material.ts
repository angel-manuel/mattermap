// Material configuration for multi-metal support

export type MaterialId = 'copper' | 'iron' | 'titanium' | 'gold';

export interface FacilityTypeConfig {
  id: string;              // 'mine', 'smelter', 'blast_furnace', 'steel_mill', etc.
  name: string;            // Display name
  namePlural: string;      // Plural form for UI
  icon: string;            // Icon character or emoji
  color: string;           // Hex color for markers
  shape: 'circle' | 'diamond' | 'square' | 'triangle' | 'pentagon';
  capacityUnit: string;    // 'kt/year', 'Mt/year'
  capacityLabel: string;   // 'Production' or 'Capacity'
  canFeedTo: string[];     // Facility types this can feed to
}

export interface MaterialConfig {
  id: MaterialId;
  name: string;
  symbol: string;          // Chemical symbol: 'Cu', 'Fe', 'Ti', 'Au'
  color: string;           // Brand color for UI elements
  description: string;     // Brief description
  facilityTypes: FacilityTypeConfig[];
}

// Default material configs
export const MATERIAL_CONFIGS: Record<MaterialId, MaterialConfig> = {
  copper: {
    id: 'copper',
    name: 'Copper',
    symbol: 'Cu',
    color: '#B87333',
    description: 'Global copper extraction, smelting, and refining',
    facilityTypes: [
      {
        id: 'mine',
        name: 'Mine',
        namePlural: 'Mines',
        icon: '●',
        color: '#22c55e',
        shape: 'circle',
        capacityUnit: 'kt/year',
        capacityLabel: 'Production',
        canFeedTo: ['smelter']
      },
      {
        id: 'smelter',
        name: 'Smelter',
        namePlural: 'Smelters',
        icon: '◆',
        color: '#3b82f6',
        shape: 'diamond',
        capacityUnit: 'kt/year',
        capacityLabel: 'Capacity',
        canFeedTo: []
      }
    ]
  },
  iron: {
    id: 'iron',
    name: 'Iron',
    symbol: 'Fe',
    color: '#71717a',
    description: 'Iron ore mining, processing, and steelmaking',
    facilityTypes: [
      {
        id: 'mine',
        name: 'Mine',
        namePlural: 'Mines',
        icon: '●',
        color: '#78716c',
        shape: 'circle',
        capacityUnit: 'Mt/year',
        capacityLabel: 'Production',
        canFeedTo: ['pellet_plant', 'sinter_plant', 'blast_furnace']
      },
      {
        id: 'pellet_plant',
        name: 'Pellet Plant',
        namePlural: 'Pellet Plants',
        icon: '○',
        color: '#a8a29e',
        shape: 'circle',
        capacityUnit: 'Mt/year',
        capacityLabel: 'Capacity',
        canFeedTo: ['blast_furnace', 'dri_plant']
      },
      {
        id: 'sinter_plant',
        name: 'Sinter Plant',
        namePlural: 'Sinter Plants',
        icon: '◇',
        color: '#d6d3d1',
        shape: 'diamond',
        capacityUnit: 'Mt/year',
        capacityLabel: 'Capacity',
        canFeedTo: ['blast_furnace']
      },
      {
        id: 'blast_furnace',
        name: 'Blast Furnace',
        namePlural: 'Blast Furnaces',
        icon: '■',
        color: '#ef4444',
        shape: 'square',
        capacityUnit: 'Mt/year',
        capacityLabel: 'Capacity',
        canFeedTo: ['steel_mill']
      },
      {
        id: 'dri_plant',
        name: 'DRI Plant',
        namePlural: 'DRI Plants',
        icon: '▲',
        color: '#f97316',
        shape: 'triangle',
        capacityUnit: 'Mt/year',
        capacityLabel: 'Capacity',
        canFeedTo: ['steel_mill']
      },
      {
        id: 'steel_mill',
        name: 'Steel Mill',
        namePlural: 'Steel Mills',
        icon: '★',
        color: '#1e3a8a',
        shape: 'pentagon',
        capacityUnit: 'Mt/year',
        capacityLabel: 'Capacity',
        canFeedTo: []
      }
    ]
  },
  titanium: {
    id: 'titanium',
    name: 'Titanium',
    symbol: 'Ti',
    color: '#818cf8',
    description: 'Titanium ore mining, pigment production, and metal sponge',
    facilityTypes: [
      {
        id: 'mine',
        name: 'Mine',
        namePlural: 'Mines',
        icon: '●',
        color: '#a78bfa',
        shape: 'circle',
        capacityUnit: 'kt/year',
        capacityLabel: 'Production',
        canFeedTo: ['upgrading_plant']
      },
      {
        id: 'upgrading_plant',
        name: 'Upgrading Plant',
        namePlural: 'Upgrading Plants',
        icon: '◇',
        color: '#c4b5fd',
        shape: 'diamond',
        capacityUnit: 'kt/year',
        capacityLabel: 'Capacity',
        canFeedTo: ['pigment_plant', 'sponge_plant']
      },
      {
        id: 'pigment_plant',
        name: 'Pigment Plant',
        namePlural: 'Pigment Plants',
        icon: '■',
        color: '#f0f0f0',
        shape: 'square',
        capacityUnit: 'kt/year',
        capacityLabel: 'Capacity',
        canFeedTo: []
      },
      {
        id: 'sponge_plant',
        name: 'Sponge Plant',
        namePlural: 'Sponge Plants',
        icon: '▲',
        color: '#6366f1',
        shape: 'triangle',
        capacityUnit: 'kt/year',
        capacityLabel: 'Capacity',
        canFeedTo: ['melting_facility']
      },
      {
        id: 'melting_facility',
        name: 'Melting Facility',
        namePlural: 'Melting Facilities',
        icon: '★',
        color: '#4338ca',
        shape: 'pentagon',
        capacityUnit: 'kt/year',
        capacityLabel: 'Capacity',
        canFeedTo: []
      }
    ]
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    symbol: 'Au',
    color: '#fbbf24',
    description: 'Gold mining, doré production, and refining',
    facilityTypes: [
      {
        id: 'mine',
        name: 'Mine',
        namePlural: 'Mines',
        icon: '●',
        color: '#fbbf24',
        shape: 'circle',
        capacityUnit: 'Moz/year',
        capacityLabel: 'Production',
        canFeedTo: ['refinery']
      },
      {
        id: 'refinery',
        name: 'Refinery',
        namePlural: 'Refineries',
        icon: '◆',
        color: '#f59e0b',
        shape: 'diamond',
        capacityUnit: 't/year',
        capacityLabel: 'Capacity',
        canFeedTo: []
      }
    ]
  }
};

export function getMaterialConfig(materialId: MaterialId): MaterialConfig {
  return MATERIAL_CONFIGS[materialId];
}

export function getFacilityTypeConfig(materialId: MaterialId, facilityType: string): FacilityTypeConfig | undefined {
  const material = MATERIAL_CONFIGS[materialId];
  return material?.facilityTypes.find(ft => ft.id === facilityType);
}
