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
| Smooth scroll | Lenis (`lenis/vue` — driven by GSAP ticker, `autoRaf: false`) |
| 3D | Three.js (GLTFLoader + DRACOLoader) |
| Fonts | Self-hosted via Fontsource (no Google Fonts CDN) |
| Package manager | bun |

---

## File Map

```
src/
  App.vue                   — root layout: radial-gradient bg, Logo (fixed top-left), NavBar, Hero, Lenis
  main.ts                   — mounts app, imports Fontsource CSS, imports style.css
  style.css                 — global reset (box-sizing, margin/padding 0)
  env.d.ts                  — declares *.glb and *.png modules for Vite

  assets/
    triton-logo-2026.png    — Triton gear+waves+wordmark PNG
    baymax-final.glb        — 463 KB Draco-compressed ROV model (22 SolidWorks materials preserved)
    rov-hero.png            — 1921×851 RGBA PNG of ROV (transparent bg) — hero centerpiece

  content/
    index.ts                — single source of truth for all UI text (hero words, nav labels)

  components/
    Logo.vue                — renders triton-logo-2026.png, fixed top-left at 52px height
    ModelViewer.vue         — Three.js canvas, cursor-tracking ROV model, material recoloring
    NavBar.vue              — frosted-glass pill navbar; labels sourced from content/index.ts
    Hero.vue                — full-viewport hero: ROV PNG center + 4 absolutely-positioned words + GSAP
    SplashScreen.vue        — dark overlay with rotating wave rings; fades out after fonts + 2.2s
    WaveParticles.vue       — 320-particle canvas animation (background of hero)
```

---

## Content File (`src/content/index.ts`)

All UI copy lives here. Components import from this file — never hardcode labels.

```ts
export const hero = {
  engineering: 'Engineering',   // word 1 — top left
  article: 'the',               // word 2 — top right (italic, small)
  deep: 'Deep',                 // word 3 — top right (large, below 'the')
  frontier: 'Frontier',         // word 4 — bottom center
  sub: 'built by triton, tested by the ocean.',
}
export const nav = {
  left: ['Home', 'Competition'],
  right: ['Docs', 'Contact'],
}
```

NavBar derives hrefs automatically: `label.toLowerCase()` → `#home`, `#competition`, etc.

---

## Hero Layout

The hero uses a large ROV PNG as the centerpiece with 4 words absolutely positioned around it — inspired by editorial magazine layouts (image breaking through typography).

### Word positions (hardcoded px — tuned via debug panel)

| Word | left | top | font-size | Font | Color |
|---|---|---|---|---|---|
| Engineering (word 1) | 268px | 196px | 223px | Plus Jakarta Sans Variable 800 | `#172554` |
| the (word 2) | 1608px | 161px | 106px | Cormorant Garamond italic 600 | `rgba(37,99,235,0.75)` |
| Deep (word 3) | 1625px | 232px | 206px | DM Serif Display italic | `#1e40af` |
| Frontier (word 4) | 625px | 786px | 369px | Plus Jakarta Sans Variable 800 | `#0c4a6e` |

### ROV image

- File: `src/assets/rov-hero.png` (1921×851 RGBA, transparent background)
- Width: `100vw` | Rotation: `-21deg`
- Centered via `.rov-positioner` at `top: 46%; left: 50%; transform: translate(-50%, -50%)`
- Drop shadow: `drop-shadow(0px 60px 120px rgba(0,5,40,0.65)) drop-shadow(0px 16px 40px rgba(26,86,219,0.35))`

### Z-index stacking

| Layer | z-index |
|---|---|
| WaveParticles | 0 |
| Words `.word` | 1 |
| ROV `.rov-positioner` | 5 |

ROV sits in front of words — words bleed behind the image at overlap points (intentional editorial effect).

### GSAP entrance animations (triggered by `animateReady` prop from App.vue)

- Engineering: `x: -80 → 0`, power3.out, 0.9s, delay 0.05s
- the: `x: 80 → 0`, back.out(1.3), 0.85s, delay 0.18s
- Deep: `x: 100 → 0`, expo.out, 1.0s, delay 0.28s
- Frontier: `y: 60 → 0`, power4.out, 0.95s, delay 0.4s
- ROV: `scale: 0.88, y: 40 → scale: 1, y: 0`, power3.out, 1.2s, delay 0.1s
- Sub: opacity 0→1, power2.out, 0.8s, delay 0.55s

### Debug panel

`Hero.vue` contains a built-in layout debug panel. **Off by default.**

To activate: set `showDebug = ref(true)` in Hero.vue script.

When active:
- All words and ROV immediately appear (skips GSAP entrance)
- Right-side overlay with sliders + number inputs for each word (fs, x, y) and ROV (w, r, x, y)
- Words use `ctrl` reactive state; ROV width/rotation use inline styles
- When satisfied, screenshot the panel values, give them to Claude, and set `showDebug = ref(false)`

---

## Fonts (Self-hosted via Fontsource)

Imported in `main.ts` — no Google Fonts CDN dependency.

```ts
import '@fontsource-variable/space-grotesk/index.css'    // 300–700 variable
import '@fontsource-variable/plus-jakarta-sans/index.css' // 200–800 variable (max weight = 800)
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/dm-serif-display/400-italic.css'
```

CSS font-family names to use:
- `'Space Grotesk Variable'`
- `'Plus Jakarta Sans Variable'`
- `'Cormorant Garamond'`
- `'DM Serif Display'`

**Plus Jakarta Sans tops out at weight 800** — use `font-weight: 800`, not 900.

---

## Lenis (Smooth Scroll)

Integrated in `App.vue` via `VueLenis root` component. GSAP ticker drives Lenis (not its own rAF):

```ts
watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return
  function tick(time: number) { lenisRef.value.lenis.raf(time * 1000) }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  onInvalidate(() => gsap.ticker.remove(tick))
})
```

`<VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />` — `autoRaf: false` is required.

---

## Key Implementation Details

### Splash screen flow (App.vue)

1. On mount: logo element measured → moved to screen center via GSAP, scaled to 160px, bobs
2. `Promise.all([document.fonts.ready, 2200ms delay])` — waits for fonts + minimum splash time
3. Logo flies back to corner → `splashDone = true` → Hero's `animateReady` prop fires

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
Uses `atan2` from cached canvas rect (updated on resize only — not per mousemove):
```ts
targetRotY = -Math.atan2(-dx, 400)
targetRotX = Math.atan2(dy, 400)
```
Lerp is frame-rate independent: `f = 1 - Math.pow(0.1, dt / 16.67)`, dt clamped to 100ms.

### Background
Stacked `radial-gradient` layers on `.page` in App.vue — blue/purple/green on `#eef2ff` base. No external image.

### NavBar
Frosted glass: `background: rgba(255,255,255,0.08)` + `backdrop-filter: blur(20px)`. Labels and hrefs are derived from `content/index.ts nav` — do not hardcode them in the component.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| Dark navy | `#0d2b5e` | Primary text, nav items |
| Triton blue | `#1a56db` | Accent, model material recolor |
| Sky hover | `#38bdf8` | Nav item hover background |
| Background base | `#eef2ff` | Page bg |

---

## Assets Deleted / Removed

- `logo.png` — replaced by `triton-logo-2026.png`
- `gear.png` — replaced by `triton-logo-2026.png`
- `particle-logo-bg.png` — removed (PNG had baked-in black background)
- `triton-logo.glb` — removed (GLB logo viewer abandoned)
- `src/composables/scroll.ts` — deleted (useScrollRotation was never used)
