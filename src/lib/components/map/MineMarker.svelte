<script lang="ts">
  import { CircleMarker, Tooltip } from 'sveaflet';
  import type { Mine } from '$lib/types';
  import { appState, selectEntity } from '$lib/data/store.svelte';

  interface Props {
    mine: Mine;
  }

  let { mine }: Props = $props();

  // Calculate radius based on production (base: 8-35, scaled by iconScale)
  // Escondida (1361kt) should be largest, smallest mines (~200kt) should be visible
  const radius = $derived(() => {
    const production = mine.production?.amount || 100;
    // Scale: normalize to 0-1 range, then map to base size
    const minProd = 150, maxProd = 1400;
    const normalized = Math.max(0, Math.min(1, (production - minProd) / (maxProd - minProd)));
    const baseRadius = 8 + normalized * 27; // 8 to 35 pixels base
    return baseRadius * appState.iconScale;
  });

  // Check if this mine is selected
  const isSelected = $derived(
    appState.selectedEntity?.type === 'mine' &&
    appState.selectedEntity?.id === mine.id
  );

  // Check if another entity is selected (for dimming)
  const isDimmed = $derived(
    appState.selectedEntity !== null && !isSelected
  );

  // Style options
  const options = $derived({
    radius: radius(),
    fillColor: '#22c55e', // Green for mines
    fillOpacity: isDimmed ? 0.2 : 0.7,
    color: isSelected ? '#166534' : '#15803d',
    weight: isSelected ? 3 : 1,
    opacity: isDimmed ? 0.3 : 1
  });

  function handleClick() {
    selectEntity('mine', mine.id);
  }

  // Format production for tooltip
  const productionText = $derived(() => {
    if (!mine.production) return '';
    return `${mine.production.amount} ${mine.production.unit}/year`;
  });
</script>

<CircleMarker
  latLng={[mine.location.coordinates.lat, mine.location.coordinates.lng]}
  {options}
  onclick={handleClick}
>
  <Tooltip options={{ permanent: false, direction: 'top' }}>
    <div class="tooltip-content">
      <strong>{mine.name}</strong>
      {#if mine.production}
        <br><span class="production">{productionText()}</span>
      {/if}
    </div>
  </Tooltip>
</CircleMarker>

<style>
  .tooltip-content {
    text-align: center;
    font-size: 12px;
  }

  .production {
    color: #666;
    font-size: 11px;
  }
</style>
