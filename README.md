# Galaxy Portfolio

An explorable, No Man's Sky–inspired portfolio built with React + Three.js.
The landing page is a fictional galaxy; clicking a **star** flies you into a
themed **solar system** (a colour "biome"), and clicking a **planet** opens a
portfolio **section** with the planet centred, slowly rotating, and its info +
links alongside it.

Everything is **procedural, flat-shaded low-poly** — no downloaded 3D models or
textures — to keep the whole site tiny (well under a 1MB budget, enforced in CI).

## Stack

- **Vite + React + TypeScript**
- **react-three-fiber** (Three.js) for the scene
- **@react-three/postprocessing** for bloom (lazy-loaded)
- **react-router** for deep-linkable views (`/`, `/system/:id`, `/system/:id/:planetId`)
- **zustand** for lightweight UI state

## Develop

```bash
npm install
npm run dev        # start the dev server
```

## Other scripts

```bash
npm run build      # type-check + production build
npm run typecheck  # tsc only
npm run lint       # eslint
npm test           # vitest (config + routing logic)
npm run size       # bundle-size budget gate (<1MB)
```

## Content

All content lives in [`src/universe/universe.ts`](src/universe/universe.ts) — a
single typed config describing systems (biomes) → planets (sections). Edit copy,
colours, links, orbits, and each planet's one "clothing" mesh there without
touching engine code. Current content is placeholder.

## Structure

- `src/universe/` — typed data model, content config, selectors + validation
- `src/state/` — navigation derived from the route, zustand UI store
- `src/engine/` — camera rig, render settings, reduced-motion + pause-when-hidden
- `src/scene/` — galaxy / system / planet scene graphs, post-processing
- `src/ui/` — breadcrumb, hover subtitle, planet panel, loading veil

See [`docs`](.) and the plan for the full roadmap (performance tiers are a
deferred follow-up; v1 runs everything at full quality).
