<script lang="ts">
  import { getCountryStats, selectEntity } from '$lib/data/store.svelte';

  interface Props {
    countryCode: string;
  }

  let { countryCode }: Props = $props();

  const stats = $derived(getCountryStats(countryCode));

  // Country names lookup
  const countryNames: Record<string, string> = {
    CL: 'Chile',
    PE: 'Peru',
    ID: 'Indonesia',
    CD: 'Democratic Republic of Congo',
    MX: 'Mexico',
    US: 'United States',
    AU: 'Australia',
    MN: 'Mongolia',
    BR: 'Brazil',
    CN: 'China',
    JP: 'Japan',
    DE: 'Germany',
    ZA: 'South Africa',
    CA: 'Canada',
    GB: 'United Kingdom',
    CH: 'Switzerland'
  };

  // Country flag emoji
  const countryFlag = $derived(() => {
    const code = countryCode.toUpperCase();
    const offset = 127397;
    return String.fromCodePoint(...[...code].map(c => c.charCodeAt(0) + offset));
  });

  const countryName = $derived(countryNames[countryCode] || countryCode);

  function handleMineClick(mineId: string) {
    selectEntity('mine', mineId);
  }

  function handleSmelterClick(smelterId: string) {
    selectEntity('smelter', smelterId);
  }
</script>

<div class="country-stats">
  <div class="header">
    <span class="flag">{countryFlag()}</span>
    <span class="type-label">Country</span>
  </div>

  <h2 class="name">{countryName}</h2>

  <div class="stats-grid">
    {#if stats.mineCount > 0}
      <div class="stat-card mines">
        <div class="stat-value">{stats.mineCount}</div>
        <div class="stat-label">Mine{stats.mineCount !== 1 ? 's' : ''}</div>
        <div class="stat-detail">{stats.totalProduction.toLocaleString()} kt/year</div>
      </div>
    {/if}

    {#if stats.smelterCount > 0}
      <div class="stat-card smelters">
        <div class="stat-value">{stats.smelterCount}</div>
        <div class="stat-label">Smelter{stats.smelterCount !== 1 ? 's' : ''}</div>
        <div class="stat-detail">{stats.totalCapacity.toLocaleString()} kt/year</div>
      </div>
    {/if}
  </div>

  {#if stats.mines.length > 0}
    <div class="entities-section">
      <h3>Mines</h3>
      <ul class="entities-list">
        {#each stats.mines.sort((a, b) => (b.production?.amount || 0) - (a.production?.amount || 0)) as mine}
          <li>
            <button class="entity-btn" onclick={() => handleMineClick(mine.id)}>
              <span class="entity-icon mine">●</span>
              <span class="entity-name">{mine.name}</span>
            </button>
            {#if mine.production}
              <span class="entity-stat">{mine.production.amount} kt</span>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if stats.smelters.length > 0}
    <div class="entities-section">
      <h3>Smelters</h3>
      <ul class="entities-list">
        {#each stats.smelters.sort((a, b) => (b.capacity?.amount || 0) - (a.capacity?.amount || 0)) as smelter}
          <li>
            <button class="entity-btn" onclick={() => handleSmelterClick(smelter.id)}>
              <span class="entity-icon smelter">◆</span>
              <span class="entity-name">{smelter.name}</span>
            </button>
            {#if smelter.capacity}
              <span class="entity-stat">{smelter.capacity.amount} kt</span>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .country-stats {
    font-size: 14px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .flag {
    font-size: 28px;
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
    margin: 0 0 16px 0;
    line-height: 1.2;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    padding: 14px;
    border-radius: 10px;
    text-align: center;
  }

  .stat-card.mines {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
  }

  .stat-card.smelters {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
  }

  .stat-label {
    font-size: 12px;
    opacity: 0.9;
  }

  .stat-detail {
    font-size: 11px;
    opacity: 0.8;
    margin-top: 4px;
  }

  .entities-section {
    margin-top: 16px;
  }

  .entities-section h3 {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 10px 0;
  }

  .entities-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .entities-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .entity-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
    color: #1e293b;
    font-size: 14px;
  }

  .entity-btn:hover {
    color: #3b82f6;
  }

  .entity-icon {
    font-size: 10px;
  }

  .entity-icon.mine {
    color: #22c55e;
  }

  .entity-icon.smelter {
    color: #3b82f6;
  }

  .entity-name {
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entity-stat {
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;
  }
</style>
