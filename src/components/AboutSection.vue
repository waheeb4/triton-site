<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import gsap from 'gsap'
import { about } from '@/content/index'
import card1Url from '@/assets/team-intro.jpg'
import card2Url from '@/assets/test.jpg'
import card4Url from '@/assets/team.jpeg'

const sectionRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const panelRefs = ref<HTMLElement[]>([])

const cardImages: (string | null)[] = [card1Url, card2Url, card4Url]
const placeholderGradients = [
  '',
  'linear-gradient(135deg, #192455 0%, #0F9CD8 100%)',
  'linear-gradient(135deg, #0F9CD8 0%, #192455 100%)',
  'linear-gradient(135deg, #192455 0%, #1e3a8a 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0F9CD8 100%)',
]

function setCardRef(el: Element | ComponentPublicInstance | null, i: number) {
  if (el instanceof Element) cardRefs.value[i] = el as HTMLElement
}
function setPanelRef(el: Element | ComponentPublicInstance | null, i: number) {
  if (el instanceof Element) panelRefs.value[i] = el as HTMLElement
}

const fanOffsets = [
  { x: 0,   y: 0,  rotation: 0    },
  { x: -6,  y: 9,  rotation: -2.5 },
  { x: 8,   y: 16, rotation: 4.0  },
  { x: -3,  y: 24, rotation: -1.5 },
]

const currentIndex = ref(0)
let isAnimating = false

const showLeft  = computed(() => currentIndex.value > 0)
const showRight = computed(() => currentIndex.value < about.length - 1)

function switchText(fromIndex: number, toIndex: number) {
  const panels = panelRefs.value
  panels.forEach((p, i) => {
    gsap.killTweensOf(p)
    if (i !== fromIndex && i !== toIndex) gsap.set(p, { rotateX: 0, opacity: 0 })
  })
  gsap.to(panels[fromIndex]!, { rotateX: -90, opacity: 0, duration: 0.25, ease: 'power2.in' })
  gsap.fromTo(panels[toIndex]!,
    { rotateX: 90, opacity: 0 },
    { rotateX: 0, opacity: 1, duration: 0.25, ease: 'power2.out', delay: 0.15 }
  )
}

function goNext() {
  if (isAnimating || currentIndex.value >= about.length - 1) return
  isAnimating = true
  const i = currentIndex.value
  const flyX   = i % 2 === 0 ? '120vw' : '-120vw'
  const flyRot  = i % 2 === 0 ? 22 : -22
  switchText(i, i + 1)
  gsap.to(cardRefs.value[i]!, {
    x: flyX, rotation: flyRot, ease: 'power1.inOut', duration: 0.5,
    onComplete: () => { currentIndex.value++; isAnimating = false },
  })
}

function goPrev() {
  if (isAnimating || currentIndex.value <= 0) return
  isAnimating = true
  const i = currentIndex.value - 1
  const f       = fanOffsets[i] ?? fanOffsets[fanOffsets.length - 1]!
  const fromX   = i % 2 === 0 ? '120vw' : '-120vw'
  const fromRot = i % 2 === 0 ? 22 : -22
  switchText(currentIndex.value, i)
  gsap.fromTo(cardRefs.value[i]!,
    { x: fromX, rotation: fromRot },
    {
      x: f.x, y: f.y, rotation: f.rotation, ease: 'power1.inOut', duration: 0.5,
      onComplete: () => { currentIndex.value--; isAnimating = false },
    }
  )
}

onMounted(() => {
  const cards  = cardRefs.value
  const panels = panelRefs.value

  fanOffsets.forEach((f, i) => {
    const card = cards[i]
    if (card) gsap.set(card, { x: f.x, y: f.y, rotation: f.rotation, zIndex: cards.length - i })
  })
  panels.forEach((panel, i) => {
    gsap.set(panel, { rotateX: 0, opacity: i === 0 ? 1 : 0 })
  })

  // Blur-in entrance on scroll into view
  gsap.set(sectionRef.value!, { opacity: 0, y: 24, filter: 'blur(14px)' })
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        gsap.to(sectionRef.value!, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.6, ease: 'power3.out',
        })
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )
  observer.observe(sectionRef.value!)
})
</script>

<template>
  <section ref="sectionRef" class="about-section">
    <!-- Left: text column -->
    <div class="text-col">
      <div class="text-wrapper">
        <div
          v-for="(card, i) in about"
          :key="i"
          :ref="(el) => setPanelRef(el, i)"
          class="text-panel"
          :class="{ 'text-panel--first': i === 0 }"
        >
          <h2 class="card-title">{{ card.title }}</h2>
          <p class="card-body">{{ card.body }}</p>
        </div>
      </div>
    </div>

    <!-- Right: card stack with arrow navigation -->
    <div class="card-col">
      <div class="card-stack">
        <div
          v-for="(card, i) in about"
          :key="i"
          :ref="(el) => setCardRef(el, i)"
          class="card"
        >
          <img v-if="cardImages[i]" :src="cardImages[i]!" :alt="card.title" loading="lazy" />
          <div
            v-else
            class="card-placeholder"
            :style="{ background: placeholderGradients[i] }"
          />

          <!-- Full-height transparent hit zones — only visible on hover -->
          <div
            v-if="i === currentIndex && showLeft"
            class="nav-zone nav-zone--left"
            role="button"
            aria-label="Previous"
            @click.stop="goPrev"
          >
            <svg class="zone-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>

          <div
            v-if="i === currentIndex && showRight"
            class="nav-zone nav-zone--right"
            role="button"
            aria-label="Next"
            @click.stop="goNext"
          >
            <svg class="zone-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.text-col {
  width: 42%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 4% 0 8%;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

.text-wrapper {
  position: relative;
  width: 100%;
  perspective: 900px;
}

.text-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform-origin: top center;
  backface-visibility: hidden;
}

.text-panel--first {
  position: relative;
}

.card-title {
  font-family: 'Dx Wideground', sans-serif;
  font-size: clamp(30px, 3.8vw, 60px);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #0f9cd8;
  text-transform: uppercase;
  margin-bottom: 24px;
  line-height: 1.05;
  white-space: nowrap;
  overflow: hidden;
}

@media (max-width: 768px) {
  .about-section {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding-bottom: 48px;
  }

  .text-col {
    width: 100%;
    padding: 80px 6% 24px;
    height: auto;
    order: 2;
  }

  .card-col {
    width: 100%;
    height: 52vw;
    min-height: 240px;
    order: 1;
    padding-top: 80px;
  }

  .card-stack {
    width: 82vw;
    height: 100%;
  }

  .card-title {
    white-space: normal;
    font-size: clamp(28px, 8vw, 48px);
  }

  .card-body {
    font-size: clamp(14px, 3.8vw, 18px);
  }
}

.card-body {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(13px, 1.4vw, 20px);
  font-weight: 400;
  color: #192455;
  line-height: 1.7;
}

.card-col {
  width: 58%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
  flex-shrink: 0;
}

.card-stack {
  position: relative;
  width: 52vw;
  height: 65vh;
}

.card {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  will-change: transform;
}

.card img,
.card-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.card img {
  object-fit: cover;
  display: block;
}

/* Full-height nav zones — transparent strip on left/right of the card */
.nav-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6%;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  backdrop-filter: blur(0px);
  cursor: pointer;
  transition: background 0.25s ease, backdrop-filter 0.25s ease;
}

.nav-zone--left  { left: 0;  border-radius: 20px 0 0 20px; }
.nav-zone--right { right: 0; border-radius: 0 20px 20px 0; }

.nav-zone:hover {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}

.zone-chevron {
  width: 34px;
  height: 34px;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.25s ease;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
}

.nav-zone:hover .zone-chevron {
  color: rgba(255, 255, 255, 0.9);
}
</style>
