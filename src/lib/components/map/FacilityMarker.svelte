<script lang="ts">
  import { CircleMarker, DivIcon, Marker, Tooltip } from 'sveaflet';
  import type { Facility, FacilityTypeConfig } from '$lib/types';
  import { appState, selectEntity } from '$lib/data/store.svelte';

  interface Props {
    facility: Facility;
    typeConfig: FacilityTypeConfig;
  }

  let { facility, typeConfig }: Props = $props();

  // Unit scale factors to normalize sizes across different materials
  // kt=1 is baseline; Mt and Moz need to produce comparable visual sizes
  const unitScaleFactors: Record<string, number> = {
    'kt': 1,          // Copper: Escondida 1361 kt → sqrt(1361) ≈ 37
    'kt/year': 1,
    'Mt': 30,         // Iron: Carajas 185 Mt → sqrt(185*30) = sqrt(5550) ≈ 74
    'Mt/year': 30,
    'Moz': 100,       // Gold mines: Nevada 2.7 Moz → sqrt(2.7*100) = sqrt(270) ≈ 16
    'Moz/year': 100,
    't': 0.1,         // Gold refineries: Valcambi 1600t → sqrt(160) ≈ 12
    't/year': 0.1
  };

  // Calculate marker size based on capacity with unit normalization
  const baseSize = $derived(() => {
    const capacity = facility.capacity?.amount || 10;
    const unit = facility.capacity?.unit || 'kt';
    const scaleFactor = unitScaleFactors[unit] || 1;

    // Normalize capacity to kt-equivalent, then apply sqrt for visual distribution
    const normalizedCapacity = capacity * scaleFactor;
    const size = Math.sqrt(normalizedCapacity) * 0.5;
    return Math.max(6, Math.min(40, size)) * appState.iconScale;
  });

  // Check if this facility is selected
  const isSelected = $derived(
    appState.selectedEntity?.id === facility.id
  );

  // Check if something else is selected (for dimming)
  const isDimmed = $derived(
    appState.selectedEntity !== null && !isSelected
  );

  function handleClick() {
    selectEntity(facility.type, facility.id);
  }

  // Format capacity for tooltip
  const capacityText = $derived(() => {
    if (!facility.capacity) return '';
    return `${facility.capacity.amount} ${facility.capacity.unit}`;
  });

  // Generate icon HTML based on shape
  function getIconHtml(size: number, color: string, shape: string, isSelected: boolean): string {
    const strokeWidth = isSelected ? 3 : 1;
    const strokeColor = isSelected ? '#000' : 'rgba(0,0,0,0.3)';

    switch (shape) {
      case 'diamond':
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
          <polygon points="12,2 22,12 12,22 2,12" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        </svg>`;
      case 'square':
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        </svg>`;
      case 'triangle':
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
          <polygon points="12,2 22,22 2,22" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        </svg>`;
      case 'pentagon':
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
          <polygon points="12,2 22,9 18,22 6,22 2,9" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        </svg>`;
      case 'circle':
      default:
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        </svg>`;
    }
  }
</script>

{#if typeConfig.shape === 'circle'}
  <!-- Use native CircleMarker for circles (better performance) -->
  <CircleMarker
    latLng={[facility.location.coordinates.lat, facility.location.coordinates.lng]}
    options={{
      radius: baseSize(),
      fillColor: typeConfig.color,
      fillOpacity: isDimmed ? 0.3 : 0.8,
      color: isSelected ? '#000' : 'rgba(0,0,0,0.3)',
      weight: isSelected ? 3 : 1,
      opacity: isDimmed ? 0.3 : 1
    }}
    events={{ click: handleClick }}
  >
    <Tooltip options={{ permanent: false, direction: 'top', offset: [0, -10] }}>
      <strong>{facility.name}</strong><br/>
      {#if capacityText()}
        {typeConfig.capacityLabel}: {capacityText()}
      {/if}
    </Tooltip>
  </CircleMarker>
{:else}
  <!-- Use DivIcon for other shapes -->
  <Marker
    latLng={[facility.location.coordinates.lat, facility.location.coordinates.lng]}
    options={{
      opacity: isDimmed ? 0.3 : 1
    }}
    events={{ click: handleClick }}
  >
    <DivIcon
      options={{
        html: getIconHtml(baseSize() * 2, typeConfig.color, typeConfig.shape, isSelected),
        className: 'facility-marker',
        iconSize: [baseSize() * 2, baseSize() * 2],
        iconAnchor: [baseSize(), baseSize()]
      }}
    />
    <Tooltip options={{ permanent: false, direction: 'top', offset: [0, -baseSize()] }}>
      <strong>{facility.name}</strong><br/>
      {#if capacityText()}
        {typeConfig.capacityLabel}: {capacityText()}
      {/if}
    </Tooltip>
  </Marker>
{/if}

<style>
  :global(.facility-marker) {
    background: transparent !important;
    border: none !important;
  }
</style>
