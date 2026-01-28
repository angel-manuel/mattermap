<script lang="ts">
  import type { Miner } from '$lib/types';
  import { appState, selectEntity } from '$lib/data/store.svelte';

  interface Props {
    miner: Miner;
  }

  let { miner }: Props = $props();

  // Country flag emoji
  const countryFlag = $derived(() => {
    const code = miner.country.toUpperCase();
    const offset = 127397;
    return String.fromCodePoint(...[...code].map(c => c.charCodeAt(0) + offset));
  });

  // Get mines owned by this miner
  const ownedMines = $derived(
    appState.mines.filter(mine =>
      mine.ownedBy.some(stake => stake.minerId === miner.id)
    ).map(mine => ({
      ...mine,
      stake: mine.ownedBy.find(s => s.minerId === miner.id)?.percentage || 0
    }))
  );

  // Get smelters owned by this miner
  const ownedSmelters = $derived(
    appState.smelters.filter(s => s.owner === miner.id)
  );

  // Total copper production (weighted by ownership)
  const totalProduction = $derived(() => {
    return ownedMines.reduce((total, mine) => {
      if (mine.production) {
        return total + (mine.production.amount * mine.stake / 100);
      }
      return total;
    }, 0);
  });

  function handleMineClick(mineId: string) {
    selectEntity('mine', mineId);
  }

  function handleSmelterClick(smelterId: string) {
    selectEntity('smelter', smelterId);
  }

  function handleCountryClick() {
    selectEntity('country', miner.country);
  }
</script>

<div class="miner-stats">
  <div class="header">
    <span class="icon miner-icon">&#9632;</span>
    <span class="type-label">Mining Company</span>
  </div>

  <h2 class="name">{miner.name}</h2>

  <button class="location" onclick={handleCountryClick}>
    <span class="flag">{countryFlag()}</span>
    <span class="location-text">{miner.hqLocation.name}</span>
  </button>

  {#if miner.website}
    <div class="website">
      <a href={miner.website} target="_blank" rel="noopener noreferrer">
        {miner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      </a>
    </div>
  {/if}

  {#if totalProduction() > 0}
    <div class="stat-card production">
      <div class="stat-label">Attributable Cu Production</div>
      <div class="stat-value">
        {Math.round(totalProduction()).toLocaleString()}
        <span class="unit">kt</span>
      </div>
      <div class="stat-note">From {ownedMines.length} mine{ownedMines.length !== 1 ? 's' : ''}</div>
    </div>
  {/if}

  {#if ownedMines.length > 0}
    <div class="assets-section">
      <h3>Mines ({ownedMines.length})</h3>
      <ul class="assets-list">
        {#each ownedMines.sort((a, b) => b.stake - a.stake) as mine}
          <li>
            <button
              class="asset-btn"
              onclick={() => handleMineClick(mine.id)}
            >
              <span class="asset-icon mine">&#9679;</span>
              {mine.name}
            </button>
            <span class="stake">{mine.stake}%</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if ownedSmelters.length > 0}
    <div class="assets-section">
      <h3>Smelters ({ownedSmelters.length})</h3>
      <ul class="assets-list">
        {#each ownedSmelters as smelter}
          <li>
            <button
              class="asset-btn"
              onclick={() => handleSmelterClick(smelter.id)}
            >
              <span class="asset-icon smelter">&#9670;</span>
              {smelter.name}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .miner-stats {
    font-size: 14px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .miner-icon {
    color: #8b5cf6;
    font-size: 14px;
  }

  .type-label {
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.5px;
  }

  .name {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    line-height: 1.2;
  }

  .location {
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    padding: 6px 10px;
    margin-left: -10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s;
    font-size: 14px;
    font-family: inherit;
  }

  .location:hover {
    background: #f1f5f9;
    color: #3b82f6;
  }

  .location-text {
    text-align: left;
  }

  .flag {
    font-size: 18px;
  }

  .website {
    margin-top: 8px;
    margin-bottom: 20px;
  }

  .website a {
    color: #3b82f6;
    text-decoration: none;
    font-size: 13px;
  }

  .website a:hover {
    text-decoration: underline;
  }

  .stat-card {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 16px;
  }

  .stat-label {
    font-size: 12px;
    opacity: 0.9;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
  }

  .stat-value .unit {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.9;
  }

  .stat-note {
    font-size: 11px;
    opacity: 0.8;
    margin-top: 4px;
  }

  .assets-section {
    margin-top: 20px;
  }

  .assets-section h3 {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px 0;
  }

  .assets-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .assets-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .asset-btn {
    background: none;
    border: none;
    color: #1e293b;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
  }

  .asset-btn:hover {
    color: #3b82f6;
  }

  .asset-icon {
    font-size: 10px;
  }

  .asset-icon.mine {
    color: #22c55e;
  }

  .asset-icon.smelter {
    color: #3b82f6;
  }

  .stake {
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;
    color: #64748b;
  }
</style>
