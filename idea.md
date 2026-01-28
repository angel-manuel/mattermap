# Mattermap

I wish to compile a map of industrial material extraction, processing and ownership on the world.

First material: copper

We will compile a list of the biggest copper mines on the world, then we will look for the biggest copper smelters or refiners.
Looking at corporate results if needed we will try to figure out which mines send to which smelters and how much.

We will save most information to JSON, JSONL or JSONC files in this folder or a subfolder.

These are the entities we will track:

+ Mine:
  + Name
  + Location
  + Country
  + Production
  + Reserves?
  + Owned-by: N miners, each with X% stake
  + Fees-to: N smelters, each a Y% of production
+ Miner:
  + Name
  + HQ Location
  + Country
  + Owns: Stake in mines
+ Smelter
  + Name
  + Location
  + Country
  + Has: feeds from X mines

we will also have a web visualization, reading directly from the JSON files, that shows Mines, Smelters and flows on a World political map
it will allow seecting mines, countries or smelters, in each case focussing on that entit and its connections
dont allow selecting contries without entities

provide selected entity statistics on a side panel

## Data Collection

Use web search yourself, and directly write the JSONs
Dont try to write scrappers first, unless you find a source with very structured data that we care about

## Data Relation

We will link and connect data on the visualization, either do it ad hoc or search if there is an easy typescript/javascript library on the frontend

## Data Viz

Use typescript, and svelte. For viz libraries offer me options(D3.js, ...), think about the simplest one that allows for interactive 2D maps and relations
