<script lang="ts">
  import { appState, clearSelection, getMineById, getSmelterById, getMinerById } from '$lib/data/store.svelte';
  import MineStats from './MineStats.svelte';
  import SmelterStats from './SmelterStats.svelte';
  import MinerStats from './MinerStats.svelte';
  import CountryStats from './CountryStats.svelte';

  // Check if panel should be visible
  const isOpen = $derived(appState.selectedEntity !== null);

  // Get selected entity details
  const selectedMine = $derived(
    appState.selectedEntity?.type === 'mine'
      ? getMineById(appState.selectedEntity.id)
      : undefined
  );

  const selectedSmelter = $derived(
    appState.selectedEntity?.type === 'smelter'
      ? getSmelterById(appState.selectedEntity.id)
      : undefined
  );

  const selectedMiner = $derived(
    appState.selectedEntity?.type === 'miner'
      ? getMinerById(appState.selectedEntity.id)
      : undefined
  );

  const selectedCountry = $derived(
    appState.selectedEntity?.type === 'country'
      ? appState.selectedEntity.id
      : undefined
  );

  function handleClose() {
    clearSelection();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<aside class="side-panel" class:open={isOpen}>
  {#if isOpen}
    <button class="close-btn" onclick={handleClose} aria-label="Close panel">
      &times;
    </button>

    <div class="panel-content">
      {#if selectedMine}
        <MineStats mine={selectedMine} />
      {:else if selectedSmelter}
        <SmelterStats smelter={selectedSmelter} />
      {:else if selectedMiner}
        <MinerStats miner={selectedMiner} />
      {:else if selectedCountry}
        <CountryStats countryCode={selectedCountry} />
      {/if}
    </div>
  {/if}
</aside>

<style>
  .side-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 360px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
  }

  .side-panel.open {
    transform: translateX(0);
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border: none;
    background: #f1f5f9;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: background 0.2s;
  }

  .close-btn:hover {
    background: #e2e8f0;
    color: #334155;
  }

  .panel-content {
    padding: 20px;
    padding-top: 48px;
  }
</style>
