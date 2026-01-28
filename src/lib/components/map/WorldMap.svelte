<script lang="ts">
  import { Map, TileLayer } from 'sveaflet';
  import { appState, getMineById, getSmelterById } from '$lib/data/store.svelte';
  import CountryLayer from './CountryLayer.svelte';
  import MineMarker from './MineMarker.svelte';
  import SmelterMarker from './SmelterMarker.svelte';
  import FlowLine from './FlowLine.svelte';
  import type { Coordinates } from '$lib/types';

  // Map options
  const mapOptions = {
    center: [20, 0] as [number, number],
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    worldCopyJump: true
  };

  // CartoDB Light tiles (free)
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // Calculate flow lines to show based on selection
  interface FlowData {
    id: string;
    from: Coordinates;
    to: Coordinates;
    label: string;
    percentage?: number;
    source?: string;
  }

  const flowLines = $derived(() => {
    const flows: FlowData[] = [];
    const selected = appState.selectedEntity;

    if (!selected) return flows;

    if (selected.type === 'mine') {
      const mine = getMineById(selected.id);
      if (mine) {
        mine.feedsTo.forEach(flow => {
          const smelter = getSmelterById(flow.smelterId);
          if (smelter) {
            flows.push({
              id: `${mine.id}-${smelter.id}`,
              from: mine.location.coordinates,
              to: smelter.location.coordinates,
              label: `${mine.name} → ${smelter.name}`,
              percentage: flow.percentage,
              source: flow.source
            });
          }
        });
      }
    } else if (selected.type === 'smelter') {
      const smelter = getSmelterById(selected.id);
      if (smelter) {
        smelter.feedsFrom.forEach(feed => {
          const mine = getMineById(feed.mineId);
          if (mine) {
            flows.push({
              id: `${mine.id}-${smelter.id}`,
              from: mine.location.coordinates,
              to: smelter.location.coordinates,
              label: `${mine.name} → ${smelter.name}`,
              percentage: feed.percentage,
              source: feed.source
            });
          }
        });
      }
    } else if (selected.type === 'country') {
      // Show all flows for entities in this country
      const countryCode = selected.id;
      appState.mines
        .filter(m => m.country === countryCode)
        .forEach(mine => {
          mine.feedsTo.forEach(flow => {
            const smelter = getSmelterById(flow.smelterId);
            if (smelter) {
              flows.push({
                id: `${mine.id}-${smelter.id}`,
                from: mine.location.coordinates,
                to: smelter.location.coordinates,
                label: `${mine.name} → ${smelter.name}`,
                percentage: flow.percentage,
                source: flow.source
              });
            }
          });
        });
      appState.smelters
        .filter(s => s.country === countryCode)
        .forEach(smelter => {
          smelter.feedsFrom.forEach(feed => {
            const mine = getMineById(feed.mineId);
            if (mine && !flows.some(f => f.id === `${mine.id}-${smelter.id}`)) {
              flows.push({
                id: `${mine.id}-${smelter.id}`,
                from: mine.location.coordinates,
                to: smelter.location.coordinates,
                label: `${mine.name} → ${smelter.name}`,
                percentage: feed.percentage,
                source: feed.source
              });
            }
          });
        });
    }

    return flows;
  });
</script>

<div class="map-container">
  <Map options={mapOptions}>
    <TileLayer url={tileUrl} options={{ attribution, subdomains: 'abcd' }} />

    <!-- Country polygons (clickable, below markers) -->
    <CountryLayer />

    {#each appState.mines as mine (mine.id)}
      <MineMarker {mine} />
    {/each}

    {#each appState.smelters as smelter (smelter.id)}
      <SmelterMarker {smelter} />
    {/each}

    <!-- Flow lines (shown when entity is selected) -->
    {#each flowLines() as flow (flow.id)}
      <FlowLine
        from={flow.from}
        to={flow.to}
        label={flow.label}
        percentage={flow.percentage}
        highlighted={true}
      />
    {/each}
  </Map>
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  :global(.leaflet-container) {
    width: 100%;
    height: 100%;
    background: #f8f9fa;
  }
</style>
