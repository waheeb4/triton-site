# Triton ROV Site — Project Context

Vue 3 + Vite + TypeScript. Student ROV team website.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) |
| Build | Vite |
| Language | TypeScript |
| Animation | GSAP (word entrance animations) |
| 3D | Three.js (GLTFLoader + DRACOLoader) |
| Fonts | Space Grotesk, Plus Jakarta Sans, Cormorant Garamond, DM Serif Display (Google Fonts) |
| Package manager | bun |

---

## File Map

```
src/
  App.vue                   — root layout: radial-gradient bg, Logo (fixed top-left), NavBar, Hero
  main.ts                   — mounts app, imports style.css
  style.css                 — global reset (box-sizing, margin/padding 0)
  env.d.ts                  — declares *.glb modules so Vite treats them as URL strings

  assets/
    triton-logo-2026.png    — Triton gear+waves+wordmark PNG (replaces old logo.png + gear.png)
    baymax-final.glb        — 463 KB Draco-compressed ROV model (22 SolidWorks materials preserved)

  content/
    index.ts                — single source of truth for all UI text (hero words, nav labels)

  composables/
    scroll.ts               — useScrollRotation(speed, factor): lerp scroll→rotation via RAF

  components/
    Logo.vue                — renders triton-logo-2026.png, fixed top-left at 52px height
    ModelViewer.vue         — Three.js canvas, cursor-tracking ROV model, material recoloring
    NavBar.vue              — frosted-glass pill navbar; labels sourced from content/index.ts
    Hero.vue                — full-viewport hero: GSAP stagger word animation + sub-text
```

---

## Content File (`src/content/index.ts`)

All UI copy lives here. Components import from this file — never hardcode labels.

```ts
export const hero = {
  engineering: 'Engineering',
  article: 'the',
  deep: 'Deep',
  frontier: 'Frontier',
  sub: 'built by triton, tested by the ocean.',
}
export const nav = {
  left: ['Home', 'Competition'],
  right: ['Docs', 'Contact'],
}
```

NavBar derives hrefs automatically: `label.toLowerCase()` → `#home`, `#competition`, etc.

---

## Hero

Four words animate in on load via GSAP `fromTo` with staggered delay (0.3s + i×0.15s):
- `opacity: 0, y: 60, rotateX: -20` → `opacity: 1, y: 0, rotateX: 0`
- Each word has a distinct font personality:

| Word | Font | Weight | Color |
|---|---|---|---|
| Engineering | Plus Jakarta Sans | 900 | `#172554` |
| the | Cormorant Garamond italic | 600 | `rgba(37,99,235,0.75)` |
| Deep | DM Serif Display italic | — | `#1e40af` |
| Frontier | Plus Jakarta Sans | 900 | `#0c4a6e` |

Font sizes use `clamp()` for responsiveness (e.g. `clamp(3rem, 9vw, 9rem)`).

---

## Key Implementation Details

### GLB pipeline
The raw SolidWorks export was 101 MB. Compressed to 463 KB with:
```
gltf-transform dedup → weld → simplify → prune → draco
```
**Do NOT run `optimize` or add a `palette` step** — both destroy material names, breaking the color recoloring logic in ModelViewer.

### GLB Vite config
`vite.config.ts` has `assetsInclude: ['**/*.glb']` — without this, Vite tries to parse the binary as JS.

### Material recoloring (ModelViewer)
Recolors red ROV parts (thrusters/grippers) to Triton blue (`#1a56db`) by matching material names:
```ts
const redMats = new Set(['candyappleredcarpainthq', 'redsofttouchplastic', 'redlowglossplastic'])
```
These names come from the SolidWorks export and are preserved by the draco-only pipeline above.

### Cursor tracking (ModelViewer)
Uses `atan2` from canvas center — not `lookAt` (which showed the wrong face):
```ts
targetRotY = -Math.atan2(-dx, 400)
targetRotX = Math.atan2(dy, 400)
```
Lerp factor `0.1` gives smooth lag.

### Background
Stacked `radial-gradient` layers on `.page` in App.vue — blue/purple/green on `#eef2ff` base. No external image.

### NavBar
Frosted glass: `background: rgba(255,255,255,0.08)` + `backdrop-filter: blur(20px)`. ROV bubble pops above the bar with `margin: -18px 6px` on `.rov-bubble`. Labels and hrefs are derived from `content/index.ts nav` — do not hardcode them in the component.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| Dark navy | `#0d2b5e` | Primary text, nav items |
| Triton blue | `#1a56db` | Accent, model material recolor |
| Sky hover | `#38bdf8` | Nav item hover background |
| Background base | `#eef2ff` | Page bg |

---

## Assets Deleted

- `logo.png` — replaced by `triton-logo-2026.png`
- `gear.png` — replaced by `triton-logo-2026.png`
- `particle-logo-bg.png` — removed (PNG had baked-in black background, not usable as overlay)
- `triton-logo.glb` — removed (GLB logo viewer was abandoned; too complex for the use case)
