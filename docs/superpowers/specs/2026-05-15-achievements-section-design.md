# Achievements Section — Design Spec
Date: 2026-05-15

## Overview

A new full-viewport section placed after `TeamSection` in `App.vue`. Two spinning photo wheels flank a centered title and achievement text. The wheels are CSS-animated circles with their centers anchored off-screen on each side, making only the inner arc visible — like two Ferris wheels emerging from the edges of the page.

---

## Layout

```
[ left wheel (half visible) ] [ center content ] [ right wheel (half visible) ]
```

- Section: `100vh`, `overflow: hidden`, `position: relative`
- Left band: ~28% of viewport width, wheel center at x ≈ -60px
- Center: ~44% of viewport width, vertically centered
- Right band: ~28% of viewport width, wheel center at x ≈ 100vw + 60px

---

## Photo Wheels

### Structure
Each wheel is a single `.wheel` div that rotates continuously. Inside, `.photo-slot` divs are positioned radially. Each slot counter-rotates at the same speed/duration in reverse so the image stays upright as it travels the arc.

```
.wheel (rotates)
  .photo-slot (counter-rotates, positioned at angle N)
    img
  .photo-slot (counter-rotates, positioned at angle N+60)
    img
  ...
```

### Geometry
- Radius: `520px`
- Photos per wheel: `6`
- Angular spacing: `60deg` (360 / 6)
- Photo slot size: `180px × 220px`, `border-radius: 16px`, `overflow: hidden`, `object-fit: cover`

### Positioning formula (inline style per slot)
```
transform: rotate(${i * 60}deg) translateX(520px)
```

### Animation
```css
@keyframes spin-cw  { from { transform: rotate(0deg)   } to { transform: rotate(360deg)  } }
@keyframes spin-ccw { from { transform: rotate(0deg)   } to { transform: rotate(-360deg) } }
```

- Left wheel: `spin-cw`, duration `28s`, `linear`, `infinite`
- Right wheel: `spin-ccw`, duration `28s`, `linear`, `infinite`
- Each photo slot: opposite keyframe at same duration (cancels wheel rotation, keeps image upright)

### Photo distribution
Assets used (from `src/assets/`):

| Wheel | Slot 0° | Slot 60° | Slot 120° | Slot 180° | Slot 240° | Slot 300° |
|-------|---------|----------|-----------|-----------|-----------|-----------|
| Left  | DSC05900.jpg | team-intro.jpg | DSC04371.JPG.jpeg | DSC04383.JPG.jpeg | IMG_0635.jpg | team.jpeg |
| Right | DSC04387.JPG.jpeg | DSC04401.JPG.jpeg | IMG_0639.jpg | WhatsApp Image 2026-04-27 at 2.04.08 PM.jpeg | rov.jpeg | DSC05900.jpg |

---

## Center Content

### Title
- Text: `ACHIEVEMENTS`
- Font: `Dx Wideground`, `font-weight: 400`
- Color: `#0F9CD8` (Celestial Blue)
- `text-transform: uppercase`, `letter-spacing: 0.08em`
- Font size: `clamp(38px, 5vw, 76px)` — matches AboutSection title

### Achievement Blocks

Two year blocks stacked with a gap between them.

**2026 block:**
```
MATE 2026
1st Place Overall  ·  Best ROV Design  ·  Best Technical Report
Best Team Spirit  ·  Best Engineering Presentation
Regional Champions — Advancing to Worlds, Canada
```

**2025 block:**
```
MATE 2025
1st Place Overall  ·  Best Engineering Presentation
Regional Champions  ·  4th Place Globally (USA)
Highest Egyptian Team
```

### Typography
- Year label: `Plus Jakarta Sans Variable`, `font-weight: 800`, `font-size: 13px`, `letter-spacing: 0.12em`, `text-transform: uppercase`, `color: #0F9CD8`
- Achievement line: `Plus Jakarta Sans Variable`, `font-weight: 400`, `font-size: 16px`, `color: #192455`, `line-height: 1.8`
- Separator dot `·`: `color: #0F9CD8`, `opacity: 0.6`

---

## Entrance Animation

On scroll into view (IntersectionObserver, threshold 0.15):
- Center content: blur-in fade — same pattern as `AboutSection` (`opacity 0→1, y 24→0, blur 14→0, 0.6s, power3.out`)
- Wheels: already spinning via CSS animation, no separate entrance needed — they're always in motion once mounted

---

## Component

New file: `src/components/AchievementsSection.vue`

Registered and inserted in `App.vue` between `<TeamSection />` and the `below-section-space` div.

---

## Constraints

- No GSAP ticker — pure CSS animations for wheel rotation (start with Option A)
- `overflow: hidden` on section to clip off-screen wheel halves
- Images use `loading="lazy"` and `draggable="false"`
- No external dependencies needed
- Fallback: if `Dx Wideground` hasn't loaded, system sans-serif renders acceptably
