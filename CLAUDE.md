# Triton ROV Site — Project Context

Vue 3 + Vite + TypeScript. Student ROV team website.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) |
| Build | Vite |
| Language | TypeScript |
| Animation | GSAP (entrance + idle animations) |
| Smooth scroll | Lenis (`lenis/vue` — driven by GSAP ticker, `autoRaf: false`) |
| 3D | Three.js (GLTFLoader + DRACOLoader) |
| Fonts | Self-hosted via Fontsource (no Google Fonts CDN) |
| Package manager | bun |

---

## File Map

```
src/
  App.vue                   — root layout: radial-gradient bg, Logo (fixed top-left), NavBar, Hero, Lenis
  main.ts                   — mounts app, imports Fontsource CSS, preloads logo image, imports style.css
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
    Hero.vue                — full-viewport hero: ROV PNG center + 4 words + artboard scale system
    SplashScreen.vue        — dark overlay with rotating wave rings; fades out after fonts + 2.2s
    WaveParticles.vue       — 320-particle canvas animation (background of hero)
```

---

## Content File (`src/content/index.ts`)

All UI copy lives here. Components import from this file — never hardcode labels.

```ts
export const hero = {
  engineering: 'Charting',  // word 1 — top left
  article: 'the',           // word 2 — top right (italic, small)
  deep: 'Deep',             // word 3 — top right (large, below 'the')
  frontier: 'Frontier',     // word 4 — bottom center
  sub: 'built by triton - tested by the ocean.',
}
export const nav = {
  left: ['Home', 'Competition'],
  right: ['Docs', 'Contact'],
}
```

NavBar derives hrefs automatically: `label.toLowerCase()` → `#home`, `#competition`, etc.

---

## Hero Layout — Artboard Scale System

The hero uses a fixed **1920×1080px artboard** that scales uniformly to fill any viewport width. This is the core responsiveness mechanism — all positions are artboard-relative and scale as a single unit.

### How it works

```
.hero { width: 100vw; height: 100vh; overflow: hidden; }

.artboard {
  position: absolute;
  top: 50%; left: 50%;           ← centered in hero
  width: 1920px; height: 1080px;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(${scale});  ← JS-driven
}
```

`scale = window.innerWidth / 1920` — recalculated on every resize via `window.addEventListener('resize', syncScale)`. Artboard is anchored to the viewport center so empty space (when viewport is taller than the scaled artboard) distributes evenly top and bottom.

### ctrl — reactive layout state

All positions, sizes, and ROV geometry live in one `reactive` object in `Hero.vue`. **There are no hardcoded positions in CSS** — the CSS classes only carry font-family and color.

```ts
const ctrl = reactive({
  eng:      { x: 13.96, y: 18.15, fs: 223 },   // % of artboard, fs in artboard px
  the_:     { x: 83.75, y: 14.91, fs: 106 },
  deep:     { x: 84.64, y: 21.48, fs: 206 },
  frontier: { x: 32.55, y: 72.78, fs: 369 },
  rov:      { w: 100,   r: -21,   x: 0,  y: 0,  op: 100 },  // w = % of 1920px
  sub:      { x: 50,    yBottom: 6, fs: 20 },   // x = left%, yBottom = bottom%
})
```

- `x` / `y` for words: percentage of artboard width (1920) / height (1080)
- `wordStyle()` converts: `left: (x/100)*1920 px`, `top: (y/100)*1080 px`
- ROV `w`: percentage of 1920px → `(w/100)*1920 px`
- Sub `x`: left%, `yBottom`: distance from artboard bottom as %, `fs`: artboard px

**localStorage persistence:** `ctrl` is deep-watched and saved to `localStorage` key `triton-hero-ctrl` on every change. Values are loaded on mount. To reset to code defaults: `localStorage.removeItem('triton-hero-ctrl')` in browser console + reload.

### Z-index stacking

| Layer | z-index |
|---|---|
| WaveParticles | 0 |
| Words `.word` | 1 |
| Sub `.sub` | 2 |
| ROV `.rov-positioner` | 5 |

ROV sits in front of words — intentional editorial effect.

### GSAP entrance animations (triggered by `animateReady` prop from App.vue)

All four words use a **blur-in** entrance:
```ts
gsap.fromTo(el, { opacity: 0, y: 35, filter: 'blur(18px)' },
               { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power3.out', delay })
```

| Element | delay |
|---|---|
| Engineering/Charting | 0.05s |
| the | 0.2s |
| Deep | 0.3s |
| Frontier | 0.42s |

ROV: `opacity: 0, scale: 1.06, blur(22px)` → `opacity: 1, scale: 1, blur(0px)`, 1.3s, power3.out, delay 0.1s.

### ROV idle float wobble

After ROV entrance completes, an infinite yoyo loop runs:
```ts
onComplete() {
  gsap.to(rovRef.value!, { y: -14, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
}
```
±14px amplitude, 5.6s full cycle. Feels like hovering in water.

### Subtitle typing animation

After 550ms delay, the `hero.sub` string is typed character by character into `typedText` ref at ~40ms per character. A 550ms pause is inserted after character 15 ("built by triton"). A CSS `step-end` blinking cursor appears and blinks indefinitely.

```ts
setTimeout(() => {
  cursorVisible.value = true
  let i = 0
  function typeNext() {
    if (i < full.length) {
      typedText.value = full.slice(0, ++i)
      setTimeout(typeNext, i === 15 ? 550 : 40)
    }
  }
  typeNext()
}, 550)
```

Cursor CSS: `step-end` blink at 1s, `text-shadow: 0 0 10px rgba(26,86,219,0.65)` glow.

### Debug panel

`Hero.vue` contains a built-in layout debug panel.

**To activate:** set `showDebug = ref(true)` in Hero.vue script. **Off by default.**

When `showDebug = true`:
- A `⚙` toggle button appears fixed bottom-right. Click to open/close the panel without refreshing.
- Full text is shown immediately (typing animation skipped) so the sub is visible for positioning.
- All elements set to `opacity: 1` via `gsap.set` (entrance animations skipped).
- Right-side panel with sliders for every element:
  - **Words**: `fs` (artboard px, 0–500), `x %` (0–100), `y %` (0–100)
  - **ROV**: `w %` (0–100), `rot °` (±180), `x (px)` offset from center (±800), `y (px)` offset (±800), `opacity` (0–100)
  - **SUB**: `x %` (0–100), `bottom %` (0–100), `fs (px)` (0–60)
- All changes persist live to localStorage — no need to hand values back.
- To reset: `localStorage.removeItem('triton-hero-ctrl')` + reload.

---

## Splash Screen Flow (App.vue)

1. `.logo-anchor` starts at `opacity: 0` (CSS) — no flash at corner position.
2. On mount: logo natural anchor position computed from CSS (`top: 17px, left: 20px`).
3. `centerLogo()` — calculates `dx/dy` from current `window.innerWidth/Height`, `gsap.set` to center with `opacity: 1`, starts bob tween (`y: dy-16`, sine.inOut, yoyo, repeat: -1).
4. `window.addEventListener('resize', centerLogo)` — re-centers immediately if Hyprland tiles the window during splash.
5. `Promise.all([document.fonts.ready, 2200ms])` — waits for fonts + minimum splash time.
6. Listener removed, bob killed, logo flies back to corner (`x:0, y:0, scale:1`, power3.inOut, 0.8s).
7. `splashDone = true` → Hero's `animateReady` prop fires → entrance animations run.

Logo splash size: **300px** tall (natural: 52px, `logoScale = 300 / rect.height`).

### Logo preload (main.ts)

Logo image is preloaded before `createApp` to avoid load delay during splash:
```ts
import logoUrl from './assets/triton-logo-2026.png'
const _preloadLogo = document.createElement('link')
_preloadLogo.rel = 'preload'
_preloadLogo.as = 'image'
_preloadLogo.href = logoUrl
document.head.appendChild(_preloadLogo)
```

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

### Units inside the artboard
Inside the scaled artboard, **only `px` and `%` of the artboard dimensions are safe.** Do NOT use `vw`, `vh`, or `rem` for positioning or font sizes inside `.artboard` — those units reference the real viewport/root and will not scale with the artboard transform.

---

## Color Palette

### Brand colors (source of truth)

| Name | Hex | Usage |
|---|---|---|
| Space Cadet | `#192455` | Primary dark — backgrounds, text, nav |
| Celestial Blue | `#0F9CD8` | Primary accent — highlights, hover, ROV recolor |
| White | `#FEFEFE` | Light surfaces, text on dark |

These three are the canonical team palette. All other color values in the codebase are approximations or tints derived from these. When refactoring or adding new UI, reach for these first.

### Current in-code values (to be migrated toward brand colors)

| Token | Value | Usage |
|---|---|---|
| Background base | `#eef2ff` | Page background |
| Splash dark | `#06122b` | Splash screen overlay |
| Dark navy | `#0d2b5e` | Nav item text, sub text |
| Deep navy | `#172554` | Hero word "Charting" |
| Mid blue | `#1e40af` | Hero word "Deep" |
| Ocean dark | `#0c4a6e` | Hero word "Frontier" |
| Triton blue | `#1a56db` | Accent, ROV material recolor, cursor glow |
| Sky blue | `#38bdf8` | Nav item hover |
| Wave particle | `rgba(100, 160, 240, α)` | WaveParticles canvas dots |

### Background gradient blobs (App.vue `.page`)

| Blob | Color | Position |
|---|---|---|
| Soft blue | `rgba(147, 197, 253, 0.75)` | Top-left |
| Lavender | `rgba(196, 181, 253, 0.65)` | Top-right |
| Seafoam | `rgba(110, 231, 183, 0.45)` | Bottom-center |
| Soft blue (mid) | `rgba(147, 197, 253, 0.4)` | Center-right |
| Light indigo | `rgba(224, 231, 255, 0.6)` | Center |

### Splash wave rings (SplashScreen.vue)

| Ring | Color |
|---|---|
| Inner | `rgba(26, 86, 219, 0.22)` — Triton blue tint |
| Mid | `rgba(14, 165, 233, 0.16)` — Sky tint |
| Outer | `rgba(99, 102, 241, 0.12)` — Indigo tint |

---

## Assets Deleted / Removed

- `logo.png` — replaced by `triton-logo-2026.png`
- `gear.png` — replaced by `triton-logo-2026.png`
- `particle-logo-bg.png` — removed (PNG had baked-in black background)
- `triton-logo.glb` — removed (GLB logo viewer abandoned)
- `src/composables/scroll.ts` — deleted (useScrollRotation was never used)
