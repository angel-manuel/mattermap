<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import WorldMap from '$lib/components/map/WorldMap.svelte';
  import SidePanel from '$lib/components/panel/SidePanel.svelte';
  import IconScaleControl from '$lib/components/ui/IconScaleControl.svelte';
  import MetalSelector from '$lib/components/ui/MetalSelector.svelte';
  import {
    setMines, setSmelters, setMiners,
    setFacilities, setCompanies,
    setMaterial, selectEntity, clearSelection,
    appState
  } from '$lib/data/store.svelte';
  import type { Mine, Smelter, Miner, Facility, Company, MaterialId } from '$lib/types';
  import { MATERIAL_CONFIGS } from '$lib/types';

  // Import copper JSON data (default material - legacy format)
  import copperMinesData from '$lib/data/materials/copper/mines.json';
  import copperSmeltersData from '$lib/data/materials/copper/smelters.json';
  import copperMinersData from '$lib/data/materials/copper/miners.json';

  // Import new material data (generic facility format)
  import ironFacilitiesData from '$lib/data/materials/iron/facilities.json';
  import ironCompaniesData from '$lib/data/materials/iron/companies.json';
  import goldFacilitiesData from '$lib/data/materials/gold/facilities.json';
  import goldCompaniesData from '$lib/data/materials/gold/companies.json';
  import titaniumFacilitiesData from '$lib/data/materials/titanium/facilities.json';
  import titaniumCompaniesData from '$lib/data/materials/titanium/companies.json';

  const validMaterials = Object.keys(MATERIAL_CONFIGS) as MaterialId[];

  // ============================================================
  // Hash Navigation: #material?entity=id&type=mine
  // ============================================================

  function parseHash(): { material: MaterialId; entityId?: string; entityType?: string } {
    if (!browser) return { material: 'copper' };

    const hash = window.location.hash.slice(1); // Remove '#'
    if (!hash) return { material: 'copper' };

    const [materialPart, queryPart] = hash.split('?');
    const material = validMaterials.includes(materialPart as MaterialId)
      ? (materialPart as MaterialId)
      : 'copper';

    let entityId: string | undefined;
    let entityType: string | undefined;

    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      entityId = params.get('entity') || undefined;
      entityType = params.get('type') || undefined;
    }

    return { material, entityId, entityType };
  }

  function updateHash(material: MaterialId, entityId?: string, entityType?: string) {
    if (!browser) return;

    let hash = `#${material}`;
    if (entityId) {
      const params = new URLSearchParams();
      params.set('entity', entityId);
      if (entityType) params.set('type', entityType);
      hash += `?${params.toString()}`;
    }

    // Only update if different to avoid infinite loops
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  }

  function handleHashChange() {
    const { material, entityId, entityType } = parseHash();

    // Update material if different
    if (material !== appState.currentMaterial) {
      setMaterial(material);
    }

    // Update selection after data loads
    setTimeout(() => {
      if (entityId) {
        selectEntity(entityType || 'mine', entityId);
      } else {
        clearSelection();
      }
    }, 50);
  }

  // Data loading function based on material
  function loadMaterialData(materialId: MaterialId) {
    // Clear previous data
    setMines([]);
    setSmelters([]);
    setMiners([]);
    setFacilities([]);
    setCompanies([]);

    switch (materialId) {
      case 'copper':
        // Copper uses legacy Mine/Smelter format
        setMines(copperMinesData as Mine[]);
        setSmelters(copperSmeltersData as Smelter[]);
        setMiners(copperMinersData as Miner[]);
        break;
      case 'iron':
        setFacilities(ironFacilitiesData as Facility[]);
        setCompanies(ironCompaniesData as Company[]);
        break;
      case 'gold':
        setFacilities(goldFacilitiesData as Facility[]);
        setCompanies(goldCompaniesData as Company[]);
        break;
      case 'titanium':
        setFacilities(titaniumFacilitiesData as Facility[]);
        setCompanies(titaniumCompaniesData as Company[]);
        break;
    }
  }

  // Initialize from hash on mount
  onMount(() => {
    const { material, entityId, entityType } = parseHash();

    // Set initial material from hash (or default)
    setMaterial(material);
    loadMaterialData(material);

    // Select entity after data loads
    if (entityId) {
      setTimeout(() => {
        selectEntity(entityType || 'mine', entityId);
      }, 100);
    }

    // Listen for browser back/forward
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  });

  // React to material changes - update data and hash
  $effect(() => {
    loadMaterialData(appState.currentMaterial);
  });

  // Sync hash when material or selection changes
  $effect(() => {
    const material = appState.currentMaterial;
    const entity = appState.selectedEntity;
    updateHash(material, entity?.id, entity?.type);
  });

  // Reactive title based on current material
  const materialName = $derived(
    appState.currentMaterial === 'copper' ? 'Copper' :
    appState.currentMaterial === 'iron' ? 'Iron' :
    appState.currentMaterial === 'titanium' ? 'Titanium' :
    appState.currentMaterial === 'gold' ? 'Gold' : 'Materials'
  );
</script>

<svelte:head>
  <title>Mattermap - Global {materialName} Flows</title>
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
  <MetalSelector />
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
