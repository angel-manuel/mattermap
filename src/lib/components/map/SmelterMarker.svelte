<script lang="ts">
  import { Marker, DivIcon, Tooltip } from 'sveaflet';
  import type { Smelter } from '$lib/types';
  import { appState, selectEntity } from '$lib/data/store.svelte';

  interface Props {
    smelter: Smelter;
  }

  let { smelter }: Props = $props();

  // Calculate size based on capacity (base: 12-40, scaled by iconScale)
  // Guixi (1100kt) should be largest, smallest (~130kt) should be visible
  const size = $derived(() => {
    const capacity = smelter.capacity?.amount || 100;
    // Scale: normalize to 0-1 range, then map to base size
    const minCap = 100, maxCap = 1200;
    const normalized = Math.max(0, Math.min(1, (capacity - minCap) / (maxCap - minCap)));
    const baseSize = 12 + normalized * 28; // 12 to 40 pixels base
    return baseSize * appState.iconScale;
  });

  // Check if this smelter is selected
  const isSelected = $derived(
    appState.selectedEntity?.type === 'smelter' &&
    appState.selectedEntity?.id === smelter.id
  );

  // Check if another entity is selected (for dimming)
  const isDimmed = $derived(
    appState.selectedEntity !== null && !isSelected
  );

  // Create icon HTML for square marker
  const iconHtml = $derived(() => {
    const s = size();
    const opacity = isDimmed ? 0.2 : 0.8;
    const borderWidth = isSelected ? 3 : 1;
    const borderColor = isSelected ? '#1e40af' : '#2563eb';

    return `<div style="
      width: ${s}px;
      height: ${s}px;
      background: rgba(59, 130, 246, ${opacity});
      border: ${borderWidth}px solid ${borderColor};
      transform: rotate(45deg);
      box-shadow: ${isSelected ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'};
    "></div>`;
  });

  // Icon options
  const iconOptions = $derived({
    html: iconHtml(),
    className: 'smelter-marker',
    iconSize: [size(), size()] as [number, number],
    iconAnchor: [size() / 2, size() / 2] as [number, number]
  });

  function handleClick() {
    selectEntity('smelter', smelter.id);
  }

  // Format capacity for tooltip
  const capacityText = $derived(() => {
    if (!smelter.capacity) return '';
    return `${smelter.capacity.amount} ${smelter.capacity.unit}/year capacity`;
  });
</script>

<Marker
  latLng={[smelter.location.coordinates.lat, smelter.location.coordinates.lng]}
  onclick={handleClick}
>
  <DivIcon options={iconOptions} />
  <Tooltip options={{ permanent: false, direction: 'top' }}>
    <div class="tooltip-content">
      <strong>{smelter.name}</strong>
      {#if smelter.capacity}
        <br><span class="capacity">{capacityText()}</span>
      {/if}
    </div>
  </Tooltip>
</Marker>

<style>
  :global(.smelter-marker) {
    background: transparent !important;
    border: none !important;
  }

  .tooltip-content {
    text-align: center;
    font-size: 12px;
  }

  .capacity {
    color: #666;
    font-size: 11px;
  }
</style>
