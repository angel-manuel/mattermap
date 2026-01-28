<script lang="ts">
  import { GeoJSON } from 'sveaflet';
  import { appState, selectEntity, getCountriesWithEntities } from '$lib/data/store.svelte';
  import type { Feature, FeatureCollection } from 'geojson';
  import countriesData from '$lib/data/countries.json';

  // ISO3 to ISO2 mapping
  const iso3ToIso2: Record<string, string> = {
    CHL: 'CL', PER: 'PE', IDN: 'ID', COD: 'CD', MEX: 'MX',
    USA: 'US', AUS: 'AU', MNG: 'MN', BRA: 'BR', CHN: 'CN',
    JPN: 'JP', DEU: 'DE', ZAF: 'ZA', CAN: 'CA', GBR: 'GB', CHE: 'CH'
  };

  // Get list of countries with entities (reactive to data changes)
  const activeCountries = $derived(getCountriesWithEntities());

  // Filter GeoJSON to only show countries with entities
  const filteredGeoJSON = $derived(() => {
    // Wait for data to be loaded
    if (activeCountries.length === 0) {
      return { type: 'FeatureCollection' as const, features: [] };
    }

    const features = (countriesData as Feature[]).filter(f => {
      const iso2 = iso3ToIso2[f.id as string];
      return iso2 && activeCountries.includes(iso2);
    });

    return {
      type: 'FeatureCollection' as const,
      features
    };
  });

  // Check if a country is selected
  const selectedCountryIso3 = $derived(() => {
    if (appState.selectedEntity?.type === 'country') {
      // Convert ISO2 back to ISO3 for comparison
      const iso2 = appState.selectedEntity.id;
      return Object.entries(iso3ToIso2).find(([, v]) => v === iso2)?.[0];
    }
    return null;
  });

  // Style function for countries
  function getStyle(feature?: Feature) {
    if (!feature) {
      return { fillColor: '#94a3b8', fillOpacity: 0.1, color: '#64748b', weight: 1, opacity: 0.3 };
    }
    const iso2 = iso3ToIso2[feature.id as string];
    const isSelected = appState.selectedEntity?.type === 'country' &&
                       appState.selectedEntity?.id === iso2;
    const hasSelection = appState.selectedEntity !== null;

    return {
      fillColor: isSelected ? '#fbbf24' : '#94a3b8',
      fillOpacity: isSelected ? 0.4 : (hasSelection ? 0.05 : 0.1),
      color: isSelected ? '#f59e0b' : '#64748b',
      weight: isSelected ? 2 : 1,
      opacity: isSelected ? 1 : 0.3
    };
  }

  // Handle click on country
  function handleClick(e: L.LeafletMouseEvent, feature: Feature) {
    const iso2 = iso3ToIso2[feature.id as string];
    if (iso2) {
      selectEntity('country', iso2);
    }
  }

  // Options for each feature
  function onEachFeature(feature: Feature, layer: L.Layer) {
    layer.on('click', (e) => handleClick(e, feature));

    const iso2 = iso3ToIso2[feature.id as string];
    if (iso2 && feature.properties?.name) {
      layer.bindTooltip(feature.properties.name, {
        permanent: false,
        direction: 'center',
        className: 'country-tooltip'
      });
    }
  }
</script>

{#if filteredGeoJSON().features.length > 0}
  <GeoJSON
    data={filteredGeoJSON()}
    options={{
      style: getStyle,
      onEachFeature
    }}
  />
{/if}

<style>
  :global(.country-tooltip) {
    background: rgba(30, 41, 59, 0.9);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    padding: 4px 8px;
  }
</style>
