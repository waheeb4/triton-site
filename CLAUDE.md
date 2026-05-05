# Triton ROV Site — Project Context

Vue 3 + Vite + TypeScript. Student ROV team website.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) |
| Build | Vite |
| Language | TypeScript |
| 3D | Three.js (GLTFLoader + DRACOLoader via CDN) |
| Fonts | Space Grotesk, Playfair Display (Google Fonts) |
| Package manager | bun |

---

## File Map

```
src/
  App.vue                   — root layout: mesh gradient bg, Logo (fixed top-left), NavBar, Hero
  main.ts                   — mounts app, imports style.css
  style.css                 — global reset (box-sizing, margin/padding 0)
  env.d.ts                  — declares `*.glb` modules so Vite treats them as URL strings

  assets/
    gear.png                — gear ring image (rotates on scroll, sits behind logo)
    logo.png                — Triton swoosh/wordmark PNG (transparent bg)
    baymax-final.glb        — 463 KB Draco-compressed ROV model (22 SolidWorks materials preserved)

  composables/
    scroll.ts               — useScrollRotation(speed, factor): lerp scroll→rotation via RAF

  components/
    Logo.vue                — gear + swoosh stacked (gear behind, margin-top overlap), fixed top-left
    ModelViewer.vue         — Three.js 60×60 canvas, cursor-tracking ROV model, material recoloring
    NavBar.vue              — frosted-glass pill navbar, ROV bubble center, left/right nav groups
    Hero.vue                — full-viewport hero: logo as central inline element, text surrounding it
```

---

## Key Implementation Details

### GLB pipeline
The raw SolidWorks export was 101 MB. Compressed to 463 KB with:
```
gltf-transform dedup → weld → simplify → prune → draco
```
**Do NOT run `optimize` or add a `palette` step** — both destroy material names, breaking the color recoloring logic in ModelViewer.

### GLB Vite config
`vite.config.ts` has `assetsInclude: ['**/*.glb']` — without this, Vite tries to parse the binary as JS and throws a parse error.

### Material recoloring
ModelViewer recolors red ROV parts (thrusters/grippers) to Triton blue (`#1a56db`) by matching material names:
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

### Scroll rotation (Logo)
`useScrollRotation(0.15)` — `speed=0.15` maps scrollY to degrees, `factor=0.1` lerps in RAF loop.

### Background
Stacked `radial-gradient` layers on `.page` in App.vue — blue/purple/green on `#eef2ff` base. No external image.

### NavBar
Frosted glass: `background: rgba(255,255,255,0.08)` + `backdrop-filter: blur(20px)`. The ROV bubble pops above the bar with `margin: -18px 6px` on `.rov-bubble`.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| Dark navy | `#0d2b5e` | Primary text, nav items |
| Triton blue | `#1a56db` | Accent text, cursive word, model material |
| Sky hover | `#38bdf8` | Nav item hover background |
| Background base | `#eef2ff` | Page bg |

---

## In-Progress / Pending

- **Hero layout**: middle line should have `the` (cursive, left) + large stacked gear+swoosh (center, z-index above text) + `Deep` (right), with text words partially overlapping/going behind the logo — matching the reference "image cuts through text" effect. Top line `Engineering`, bottom line `Frontier`. Each word should have a distinct font personality.
