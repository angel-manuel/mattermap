<script lang="ts">
  import { appState, setIconScale } from '$lib/data/store.svelte';

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    setIconScale(parseFloat(target.value));
  }

  const scalePercent = $derived(Math.round(appState.iconScale * 100));
</script>

<div class="scale-control">
  <div class="label-row">
    <span class="label-text">Icon Size</span>
    <span class="scale-value">{scalePercent}%</span>
  </div>
  <input
    type="range"
    min="0.25"
    max="2"
    step="0.05"
    value={appState.iconScale}
    oninput={handleInput}
    aria-label="Icon scale"
  />
</div>

<style>
  .scale-control {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 160px;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    color: #64748b;
  }

  .label-text {
    font-weight: 500;
  }

  .scale-value {
    font-weight: 600;
    color: #1e293b;
  }

  input[type="range"] {
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.15s;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    background: #2563eb;
  }

  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
</style>
