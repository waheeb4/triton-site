# Cursor Glow — Design Spec
Date: 2026-05-05

## Summary

A single soft radial-gradient blob that lazily follows the cursor across the page, creating a subtle "water mixing" effect on the background. Built with GSAP `quickTo` since GSAP is already a project dependency.

---

## Component

**File:** `src/components/CursorGlow.vue`

Self-contained component: owns both the DOM element and the mousemove listener. No new composable needed — the logic is tightly coupled to the element and has no reuse case.

---

## Blob Element

| Property | Value |
|---|---|
| Position | `fixed` — stays viewport-aligned through scroll |
| Size | `600px × 600px` |
| Center offset | `transform: translate(-50%, -50%)` applied via GSAP targets |
| Pointer events | `none` — never blocks clicks |
| z-index | `0` — below all content, above page background |
| Background | `radial-gradient(circle, rgba(147,197,253,0.35) 0%, rgba(196,181,253,0.2) 45%, transparent 70%)` |
| mix-blend-mode | none — predictable compositing against existing gradient stack |

Colors are drawn from the existing palette: `rgba(147,197,253)` (sky blue) fading into `rgba(196,181,253)` (soft purple), transparent at edges.

---

## GSAP Behavior

- `gsap.quickTo` targets `x` and `y` on the blob element
- `duration: 0.8`, `ease: 'power3.out'` — lazy drift, not instant snapping
- On `window mouseleave`: fade blob to `opacity: 0` via `gsap.to` (`duration: 0.4`)
- On `window mouseenter`: restore `opacity: 1` (`duration: 0.4`)
- Initial position: center of viewport on mount (`window.innerWidth / 2`, `window.innerHeight / 2`)

---

## App.vue Integration

`<CursorGlow />` is the first child inside `.page`, before `NavBar` and `Hero`. No style changes to `.page` required.

```html
<div class="page">
  <CursorGlow />
  <div class="logo-anchor">...</div>
  <NavBar />
  <Hero />
  ...
</div>
```

---

## Out of Scope

- Multiple blobs / trail particles (scope creep — single blob is sufficient)
- Touch support (not needed for this project)
- Color changes based on cursor velocity
