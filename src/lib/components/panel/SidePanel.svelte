<script lang="ts">
  import { appState, clearSelection, getMineById, getSmelterById, getMinerById } from '$lib/data/store.svelte';
  import MineStats from './MineStats.svelte';
  import SmelterStats from './SmelterStats.svelte';
  import MinerStats from './MinerStats.svelte';
  import CountryStats from './CountryStats.svelte';

  // Check if panel should be visible
  const isOpen = $derived(appState.selectedEntity !== null);

  // Mobile expanded state
  let expanded = $state(false);

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

  // Get entity name for collapsed preview
  const entityName = $derived(() => {
    if (selectedMine) return selectedMine.name;
    if (selectedSmelter) return selectedSmelter.name;
    if (selectedMiner) return selectedMiner.name;
    if (selectedCountry) return selectedCountry;
    return '';
  });

  const entityType = $derived(() => {
    if (selectedMine) return 'Mine';
    if (selectedSmelter) return 'Smelter';
    if (selectedMiner) return 'Company';
    if (selectedCountry) return 'Country';
    return '';
  });

  function handleClose() {
    clearSelection();
    expanded = false;
  }

  function toggleExpanded() {
    expanded = !expanded;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  // Reset expanded state when selection changes
  $effect(() => {
    if (appState.selectedEntity) {
      expanded = false;
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<aside class="side-panel" class:open={isOpen} class:expanded={expanded}>
  {#if isOpen}
    <!-- Mobile handle bar -->
    <div class="mobile-handle">
      <button class="mobile-close" onclick={handleClose} aria-label="Close panel">
        &times;
      </button>
      <button class="handle-content" onclick={toggleExpanded} aria-label={expanded ? 'Collapse panel' : 'Expand panel'}>
        <div class="handle-bar"></div>
        <div class="handle-preview">
          <span class="handle-type">{entityType()}</span>
          <span class="handle-name">{entityName()}</span>
        </div>
        <span class="handle-chevron">{expanded ? '▼' : '▲'}</span>
      </button>
    </div>

    <!-- Desktop close button -->
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
  /* Desktop styles (default) */
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

  /* Mobile handle - hidden on desktop */
  .mobile-handle {
    display: none;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .side-panel {
      top: auto;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 80px;
      max-height: 80vh;
      transform: translateY(100%);
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
      border-radius: 16px 16px 0 0;
      transition: height 0.3s ease, transform 0.3s ease;
    }

    .side-panel.open {
      transform: translateY(0);
    }

    .side-panel.open.expanded {
      height: 70vh;
    }

    /* Hide desktop close button on mobile */
    .close-btn {
      display: none;
    }

    /* Mobile handle bar */
    .mobile-handle {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 16px;
      background: white;
      position: sticky;
      top: 0;
      z-index: 10;
      border-radius: 16px 16px 0 0;
    }

    .mobile-close {
      width: 28px;
      height: 28px;
      border: none;
      background: #f1f5f9;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      flex-shrink: 0;
    }

    .mobile-close:active {
      background: #e2e8f0;
    }

    .handle-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      padding: 0 8px;
      background: none;
      border: none;
      cursor: pointer;
      position: relative;
    }

    .handle-bar {
      width: 40px;
      height: 4px;
      background: #cbd5e1;
      border-radius: 2px;
      margin-bottom: 8px;
    }

    .handle-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      justify-content: center;
    }

    .handle-type {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .handle-name {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }

    .handle-chevron {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #94a3b8;
    }

    .panel-content {
      padding: 12px 16px;
      padding-top: 0;
      overflow-y: auto;
      max-height: calc(70vh - 80px);
    }

    /* When collapsed, hide the content */
    .side-panel:not(.expanded) .panel-content {
      display: none;
    }
  }
</style>
