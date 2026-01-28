# Mattermap - Project Instructions

## Overview
Interactive visualization of global industrial material extraction, processing, and ownership flows. Currently focused on copper.

## Tech Stack
- **Framework**: SvelteKit with TypeScript
- **Maps**: Leaflet + Sveaflet
- **Deployment**: Static adapter (builds to `/build`)

## Project Structure
```
data/materials/copper/     # JSON data files (mines, smelters, miners)
src/lib/types/             # TypeScript type definitions
src/lib/data/              # Svelte 5 stores and data loading
src/lib/components/map/    # Map components (Leaflet markers, layers)
src/lib/components/panel/  # Side panel for entity details
src/lib/components/ui/     # Shared UI components
src/lib/utils/             # Utility functions
```

## Data Model

### Entities
- **Mine**: Extraction site with location, production, ownership stakes, and feeds to smelters
- **Miner**: Mining company with HQ location and ownership in mines
- **Smelter**: Processing facility with location, capacity, and feed sources

### Relationships
- Mines are **ownedBy** multiple Miners (percentage stakes)
- Mines **feedTo** multiple Smelters (percentage of production)
- Smelters **feedsFrom** multiple Mines (inverse relationship)

## Data Files
- `data/materials/copper/mines.json` - Array of Mine objects
- `data/materials/copper/smelters.json` - Array of Smelter objects
- `data/materials/copper/miners.json` - Array of Miner objects

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Visualization Requirements
1. World political map with mine and smelter markers
2. Clickable entities showing connections
3. Side panel with selected entity statistics
4. Flow lines showing mine-to-smelter relationships
5. Country filtering (only countries with entities)

## Code Conventions
- Use Svelte 5 runes ($state, $derived, $effect)
- TypeScript strict mode
- Types in `$lib/types`, re-exported from index.ts
- IDs use kebab-case (e.g., 'escondida-mine', 'codelco')
