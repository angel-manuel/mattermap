<script lang="ts">
  import { appState, setMaterial } from '$lib/data/store.svelte';
  import { MATERIAL_CONFIGS, type MaterialId } from '$lib/types';

  const materials = Object.values(MATERIAL_CONFIGS);

  function handleSelect(materialId: MaterialId) {
    setMaterial(materialId);
  }
</script>

<div class="metal-selector">
  {#each materials as material (material.id)}
    <button
      class="metal-button"
      class:active={appState.currentMaterial === material.id}
      style="--metal-color: {material.color}"
      onclick={() => handleSelect(material.id)}
      title={material.name}
    >
      {material.symbol}
    </button>
  {/each}
</div>

<style>
  .metal-selector {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.95);
    padding: 6px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .metal-button {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 6px;
    background: #f5f5f5;
    color: #333;
    font-weight: 700;
    font-size: 14px;
    font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .metal-button:hover {
    background: var(--metal-color);
    color: white;
    transform: scale(1.05);
  }

  .metal-button.active {
    background: var(--metal-color);
    color: white;
    border-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>
