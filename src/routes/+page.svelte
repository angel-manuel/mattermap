<script lang="ts">
  import { onMount } from 'svelte';
  import WorldMap from '$lib/components/map/WorldMap.svelte';
  import SidePanel from '$lib/components/panel/SidePanel.svelte';
  import IconScaleControl from '$lib/components/ui/IconScaleControl.svelte';
  import { setMines, setSmelters, setMiners } from '$lib/data/store.svelte';
  import type { Mine, Smelter, Miner } from '$lib/types';

  // Import JSON data
  import minesData from '$lib/data/materials/copper/mines.json';
  import smeltersData from '$lib/data/materials/copper/smelters.json';
  import minersData from '$lib/data/materials/copper/miners.json';

  onMount(() => {
    // Load data into store (cast to correct types)
    setMines(minesData as Mine[]);
    setSmelters(smeltersData as Smelter[]);
    setMiners(minersData as Miner[]);
  });
</script>

<svelte:head>
  <title>Mattermap - Global Copper Flows</title>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
</svelte:head>

<main>
  <WorldMap />
  <SidePanel />
  <IconScaleControl />
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
</style>
