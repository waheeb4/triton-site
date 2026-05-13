<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about } from '@/content/index'
import teamUrl from '@/assets/team.jpeg'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const panelRefs = ref<HTMLElement[]>([])

// card 0 = team.jpeg; cards 1–4 await photos — show gradient placeholders
const cardImages: (string | null)[] = [teamUrl, ...Array(about.length - 1).fill(null)]
// index 0 is intentionally empty — card 0 always has a real image (teamUrl)
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

let stInstance: ScrollTrigger | null = null
const tickerUpdate = () => ScrollTrigger.update()
let cardTl: gsap.core.Timeline | null = null

onMounted(() => {
  gsap.ticker.add(tickerUpdate)

  const section = sectionRef.value!
  const cards = cardRefs.value
  const panels = panelRefs.value

  if (!section || cards.some(c => !c) || panels.some(p => !p)) {
    console.warn('[AboutSection] template refs not ready — animation skipped')
    return
  }

  const fanOffsets = [
    { x: 0,   y: 0,  rotation: 0    },
    { x: -6,  y: 9,  rotation: -2.5 },
    { x: 8,   y: 16, rotation: 4.0  },
    { x: -3,  y: 24, rotation: -1.5 },
    { x: 10,  y: 32, rotation: 5.5  },
  ]
  cards.forEach((card, i) => {
    const f = fanOffsets[i] ?? fanOffsets[fanOffsets.length - 1]!
    gsap.set(card, { x: f.x, y: f.y, rotation: f.rotation, zIndex: cards.length - i })
  })

  panels.forEach((panel, i) => {
    gsap.set(panel, { rotateX: 0, opacity: i === 0 ? 1 : 0 })
  })

  const totalUnits = cards.length - 1

  cardTl = gsap.timeline()
  cards.forEach((card, i) => {
    if (i < cards.length - 1) {
      const flyX = i % 2 === 0 ? '120vw' : '-120vw'
      const flyRot = i % 2 === 0 ? 22 : -22
      cardTl!.to(card, { x: flyX, rotation: flyRot, ease: 'power1.inOut', duration: 0.8 }, i + 0.1)
    }
  })
  cardTl.set(section, {}, totalUnits)

  const snapPoints = Array.from({ length: cards.length }, (_, i) => i / totalUnits)

  let activeTextIndex = 0
  let lastProgress = 0

  function switchText(toIndex: number) {
    if (toIndex === activeTextIndex) return
    const from = panels[activeTextIndex]!
    const to = panels[toIndex]!
    gsap.to(from, { rotateX: -90, opacity: 0, duration: 0.25, ease: 'power2.in' })
    gsap.fromTo(to, { rotateX: 90, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 0.25, ease: 'power2.out', delay: 0.15 })
    activeTextIndex = toIndex
  }

  stInstance = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: `+=${totalUnits * 300}vh`,
    pin: true,
    animation: cardTl,
    scrub: 2,
    snap: {
      snapTo: snapPoints,
      duration: { min: 0.6, max: 1.2 },
      delay: 0.3,
      ease: 'power2.inOut',
    },
    onUpdate: (self) => {
      const p = self.progress
      const raw = p * totalUnits
      const forward = p >= lastProgress
      lastProgress = p

      // Forward: switch at midpoint (50% toward next card)
      if (forward && raw > activeTextIndex + 0.5 && activeTextIndex < panels.length - 1) {
        switchText(activeTextIndex + 1)
      // Backward: switch only when 85% of the way back (card nearly snapped home)
      } else if (!forward && raw < activeTextIndex - 0.85 && activeTextIndex > 0) {
        switchText(activeTextIndex - 1)
      }
    },
  })
})

onUnmounted(() => {
  gsap.ticker.remove(tickerUpdate)
  stInstance?.kill()
  cardTl?.kill()
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

    <!-- Right: card stack -->
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

/* First panel sits in normal flow to give the wrapper its height */
.text-panel--first {
  position: relative;
}

.card-title {
  font-family: 'Dx Wideground', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: #0f9cd8;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.card-body {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: 21px;
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
  overflow: hidden;
  will-change: transform;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-placeholder {
  width: 100%;
  height: 100%;
}
</style>
