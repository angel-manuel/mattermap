<script lang="ts">
  import type { Facility, FacilityTypeConfig, Company } from '$lib/types';
  import { getCompanyById, getFacilityById } from '$lib/data/store.svelte';

  interface Props {
    facility: Facility;
    typeConfig: FacilityTypeConfig;
  }

  let { facility, typeConfig }: Props = $props();

  // Get owner companies
  const owners = $derived(
    facility.ownedBy.map(stake => ({
      company: getCompanyById(stake.companyId),
      percentage: stake.percentage
    }))
  );

  // Get connected facilities (feedsTo)
  const feedsToFacilities = $derived(
    facility.feedsTo.map(flow => ({
      facility: getFacilityById(flow.targetId),
      targetType: flow.targetType,
      percentage: flow.percentage,
      source: flow.source
    }))
  );

  // Get source facilities (feedsFrom)
  const feedsFromFacilities = $derived(
    facility.feedsFrom.map(flow => ({
      facility: getFacilityById(flow.targetId),
      targetType: flow.targetType,
      percentage: flow.percentage,
      source: flow.source
    }))
  );
</script>

<div class="facility-stats">
  <h2 class="facility-name">{facility.name}</h2>
  <div class="facility-type">{typeConfig.name}</div>

  <div class="stat-section">
    <div class="stat-row">
      <span class="stat-label">Location</span>
      <span class="stat-value">{facility.location.name}</span>
    </div>

    {#if facility.capacity}
      <div class="stat-row">
        <span class="stat-label">{typeConfig.capacityLabel}</span>
        <span class="stat-value highlight">
          {facility.capacity.amount.toLocaleString()} {facility.capacity.unit}
          <span class="stat-year">({facility.capacity.year})</span>
        </span>
      </div>
    {/if}

    {#if facility.miningMethod}
      <div class="stat-row">
        <span class="stat-label">Method</span>
        <span class="stat-value">{facility.miningMethod}</span>
      </div>
    {/if}

    {#if facility.status && facility.status !== 'operating'}
      <div class="stat-row">
        <span class="stat-label">Status</span>
        <span class="stat-value status-{facility.status}">{facility.status}</span>
      </div>
    {/if}
  </div>

  {#if owners.length > 0}
    <div class="stat-section">
      <h3 class="section-title">Ownership</h3>
      {#each owners as owner}
        <div class="stat-row">
          <span class="stat-label">{owner.company?.name || owner.company || 'Unknown'}</span>
          <span class="stat-value">{owner.percentage}%</span>
        </div>
      {/each}
    </div>
  {/if}

  {#if feedsToFacilities.length > 0}
    <div class="stat-section">
      <h3 class="section-title">Feeds To</h3>
      {#each feedsToFacilities as target}
        <div class="flow-item">
          <span class="flow-name">{target.facility?.name || target.targetType}</span>
          {#if target.percentage}
            <span class="flow-percentage">{target.percentage}%</span>
          {/if}
          {#if target.source}
            <span class="flow-source">{target.source}</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if feedsFromFacilities.length > 0}
    <div class="stat-section">
      <h3 class="section-title">Feeds From</h3>
      {#each feedsFromFacilities as source}
        <div class="flow-item">
          <span class="flow-name">{source.facility?.name || source.targetType}</span>
          {#if source.percentage}
            <span class="flow-percentage">{source.percentage}%</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if facility.byproducts && facility.byproducts.length > 0}
    <div class="stat-section">
      <h3 class="section-title">Byproducts</h3>
      {#each facility.byproducts as bp}
        <div class="stat-row">
          <span class="stat-label">{bp.metal}</span>
          <span class="stat-value">
            {bp.amount} {bp.unit}/year
            {#if bp.estimated}
              <span class="estimated">(est.)</span>
            {/if}
          </span>
        </div>
      {/each}
    </div>
  {/if}

  {#if facility.source}
    <div class="stat-section source-section">
      <span class="source-label">Source:</span>
      <span class="source-value">{facility.source}</span>
    </div>
  {/if}
</div>

<style>
  .facility-stats {
    padding: 16px;
  }

  .facility-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #1a1a1a;
  }

  .facility-type {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-section {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
  }

  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 8px 0;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #666;
  }

  .stat-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1a1a1a;
    text-align: right;
  }

  .stat-value.highlight {
    font-size: 1rem;
    font-weight: 600;
  }

  .stat-year {
    font-weight: 400;
    color: #888;
    font-size: 0.75rem;
  }

  .status-construction { color: #f59e0b; }
  .status-suspended { color: #ef4444; }
  .status-closed { color: #6b7280; }

  .flow-item {
    margin-bottom: 8px;
    padding: 8px;
    background: #f9fafb;
    border-radius: 4px;
  }

  .flow-name {
    display: block;
    font-weight: 500;
    font-size: 0.875rem;
  }

  .flow-percentage {
    font-size: 0.75rem;
    color: #3b82f6;
    font-weight: 600;
  }

  .flow-source {
    display: block;
    font-size: 0.7rem;
    color: #888;
    margin-top: 4px;
    font-style: italic;
  }

  .estimated {
    font-size: 0.7rem;
    color: #888;
    font-style: italic;
  }

  .source-section {
    border-bottom: none;
    padding-bottom: 0;
  }

  .source-label {
    font-size: 0.7rem;
    color: #888;
  }

  .source-value {
    font-size: 0.7rem;
    color: #888;
    font-style: italic;
  }
</style>
