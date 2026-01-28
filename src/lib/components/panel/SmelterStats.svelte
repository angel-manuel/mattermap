<script lang="ts">
  import type { Smelter } from '$lib/types';
  import { getMinerById, getMineById, selectEntity } from '$lib/data/store.svelte';

  interface Props {
    smelter: Smelter;
  }

  let { smelter }: Props = $props();

  // Get owner name
  const ownerName = $derived(() => {
    if (!smelter.owner) return null;
    const miner = getMinerById(smelter.owner);
    return miner?.name || smelter.owner;
  });

  // Get feed sources with mine names
  const feedSources = $derived(
    smelter.feedsFrom.map(feed => {
      const mine = getMineById(feed.mineId);
      return {
        ...feed,
        name: mine?.name || feed.mineId,
        country: mine?.country
      };
    })
  );

  // Country flag emoji
  const countryFlag = $derived(() => {
    const code = smelter.country.toUpperCase();
    const offset = 127397;
    return String.fromCodePoint(...[...code].map(c => c.charCodeAt(0) + offset));
  });

  function getFlag(code?: string) {
    if (!code) return '';
    const offset = 127397;
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + offset));
  }

  function handleOwnerClick() {
    if (smelter.owner) {
      const miner = getMinerById(smelter.owner);
      if (miner) {
        selectEntity('miner', smelter.owner);
      }
    }
  }

  function handleCountryClick() {
    selectEntity('country', smelter.country);
  }

  function handleMineClick(mineId: string) {
    selectEntity('mine', mineId);
  }
</script>

<div class="smelter-stats">
  <div class="header">
    <span class="icon smelter-icon">&#9670;</span>
    <span class="type-label">Smelter</span>
  </div>

  <h2 class="name">{smelter.name}</h2>

  <button class="location" onclick={handleCountryClick}>
    <span class="flag">{countryFlag()}</span>
    <span class="location-text">{smelter.location.name}</span>
  </button>

  {#if smelter.capacity}
    <div class="stat-card capacity">
      <div class="stat-label">Processing Capacity</div>
      <div class="stat-value">
        {smelter.capacity.amount.toLocaleString()}
        <span class="unit">{smelter.capacity.unit}/year</span>
      </div>
      <div class="stat-year">{smelter.capacity.year}</div>
    </div>
  {/if}

  {#if smelter.owner && ownerName()}
    <div class="info-row">
      <span class="label">Owner</span>
      <button class="owner-btn" onclick={handleOwnerClick}>
        {ownerName()}
      </button>
    </div>
  {/if}

  {#if feedSources.length > 0}
    <div class="feeds-section">
      <h3>Feed Sources ({feedSources.length} mines)</h3>
      <ul class="feeds-list">
        {#each feedSources as feed}
          <li>
            <button class="mine-btn" onclick={() => handleMineClick(feed.mineId)}>
              <span class="mine-icon">●</span>
              <span class="mine-name">{feed.name}</span>
              {#if feed.country}
                <span class="mine-flag">{getFlag(feed.country)}</span>
              {/if}
            </button>
            {#if feed.percentage}
              <span class="percentage">{feed.percentage}%</span>
            {/if}
          </li>
          {#if feed.source}
            <li class="source-row">
              <span class="flow-source">{feed.source}</span>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}

  {#if smelter.source}
    <div class="source">
      Source: {smelter.source}
    </div>
  {/if}
</div>

<style>
  .smelter-stats {
    font-size: 14px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .smelter-icon {
    color: #3b82f6;
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
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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

  .owner-btn {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }

  .owner-btn:hover {
    text-decoration: underline;
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

  .mine-btn {
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

  .mine-btn:hover {
    color: #22c55e;
  }

  .mine-icon {
    color: #22c55e;
    font-size: 10px;
  }

  .mine-name {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mine-flag {
    font-size: 14px;
  }

  .flow-source {
    font-size: 10px;
    color: #94a3b8;
    font-style: italic;
    padding-left: 16px;
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
</style>
