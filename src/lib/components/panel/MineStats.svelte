<script lang="ts">
  import type { Mine } from '$lib/types';
  import { getMinerById, getSmelterById, selectEntity } from '$lib/data/store.svelte';

  interface Props {
    mine: Mine;
  }

  let { mine }: Props = $props();

  // Get owner names
  const owners = $derived(
    mine.ownedBy.map(stake => {
      const miner = getMinerById(stake.minerId);
      return {
        ...stake,
        name: miner?.name || stake.minerId
      };
    })
  );

  // Get smelter destinations
  const destinations = $derived(
    mine.feedsTo.map(flow => {
      const smelter = getSmelterById(flow.smelterId);
      return {
        ...flow,
        name: smelter?.name || flow.smelterId,
        country: smelter?.country
      };
    })
  );

  // Country flag emoji
  const countryFlag = $derived(() => {
    const code = mine.country.toUpperCase();
    const offset = 127397;
    return String.fromCodePoint(...[...code].map(c => c.charCodeAt(0) + offset));
  });

  function getFlag(code?: string) {
    if (!code) return '';
    const offset = 127397;
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + offset));
  }

  function handleOwnerClick(minerId: string) {
    const miner = getMinerById(minerId);
    if (miner) {
      selectEntity('miner', minerId);
    }
  }

  function handleSmelterClick(smelterId: string) {
    selectEntity('smelter', smelterId);
  }

  function handleCountryClick() {
    selectEntity('country', mine.country);
  }
</script>

<div class="mine-stats">
  <div class="header">
    <span class="icon mine-icon">&#9679;</span>
    <span class="type-label">Mine</span>
  </div>

  <h2 class="name">{mine.name}</h2>

  <button class="location" onclick={handleCountryClick}>
    <span class="flag">{countryFlag()}</span>
    <span class="location-text">{mine.location.name}</span>
  </button>

  {#if mine.production}
    <div class="stat-card production">
      <div class="stat-label">Annual Production</div>
      <div class="stat-value">
        {mine.production.amount.toLocaleString()}
        <span class="unit">{mine.production.unit}</span>
      </div>
      <div class="stat-year">{mine.production.year}</div>
    </div>
  {/if}

  {#if mine.type}
    <div class="info-row">
      <span class="label">Type</span>
      <span class="value type-badge">{mine.type}</span>
    </div>
  {/if}

  {#if owners.length > 0}
    <div class="owners-section">
      <h3>Ownership</h3>
      <ul class="owners-list">
        {#each owners as owner}
          <li>
            <button
              class="owner-btn"
              onclick={() => handleOwnerClick(owner.minerId)}
            >
              {owner.name}
            </button>
            <span class="percentage">{owner.percentage}%</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if destinations.length > 0}
    <div class="feeds-section">
      <h3>Feeds To ({destinations.length} smelters)</h3>
      <ul class="feeds-list">
        {#each destinations as dest}
          <li>
            <button
              class="smelter-btn"
              onclick={() => handleSmelterClick(dest.smelterId)}
            >
              <span class="smelter-icon">◆</span>
              <span class="smelter-name">{dest.name}</span>
              {#if dest.country}
                <span class="smelter-flag">{getFlag(dest.country)}</span>
              {/if}
            </button>
            {#if dest.percentage}
              <span class="percentage">{dest.percentage}%</span>
            {/if}
          </li>
          {#if dest.source}
            <li class="source-row">
              <span class="flow-source">{dest.source}</span>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}

  {#if mine.source}
    <div class="source">
      Source: {mine.source}
    </div>
  {/if}
</div>

<style>
  .mine-stats {
    font-size: 14px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .mine-icon {
    color: #22c55e;
    font-size: 16px;
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
    margin-bottom: 20px;
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

  .stat-card {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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

  .stat-year {
    font-size: 11px;
    opacity: 0.8;
    margin-top: 4px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .label {
    color: #64748b;
  }

  .type-badge {
    background: #f1f5f9;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    text-transform: capitalize;
  }

  .owners-section {
    margin-top: 20px;
  }

  .owners-section h3 {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px 0;
  }

  .owners-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .owners-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .owner-btn {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    text-align: left;
  }

  .owner-btn:hover {
    text-decoration: underline;
  }

  .percentage {
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;
    color: #64748b;
  }

  .source {
    margin-top: 20px;
    font-size: 11px;
    color: #94a3b8;
    font-style: italic;
  }

  .feeds-section {
    margin-top: 20px;
  }

  .feeds-section h3 {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px 0;
  }

  .feeds-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feeds-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .feeds-list li.source-row {
    padding: 4px 0 8px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .smelter-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    text-align: left;
    color: #1e293b;
    font-size: 14px;
  }

  .smelter-btn:hover {
    color: #3b82f6;
  }

  .smelter-icon {
    color: #3b82f6;
    font-size: 10px;
  }

  .smelter-name {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .smelter-flag {
    font-size: 14px;
  }

  .flow-source {
    font-size: 10px;
    color: #94a3b8;
    font-style: italic;
    padding-left: 16px;
  }
</style>
