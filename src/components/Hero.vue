<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { hero } from '../content/index'
import WaveParticles from './WaveParticles.vue'

const words = [hero.engineering, hero.article, hero.deep, hero.frontier]
const wordRefs = ref<HTMLElement[]>([])

const wordAnims = [
  // Engineering — rises from below with front tilt (original)
  { from: { opacity: 0, y: 60, rotateX: -20 },        ease: 'power3.out',    duration: 0.9 },
  // the — drifts in from the left with a slight lean
  { from: { opacity: 0, x: -50, rotateZ: -14 },        ease: 'back.out(1.3)', duration: 0.85 },
  // Deep — drops from above with a back-tilt
  { from: { opacity: 0, y: -55, rotateX: 22 },         ease: 'expo.out',      duration: 1.0 },
  // Frontier — zooms in with a lateral twist
  { from: { opacity: 0, scale: 0.72, rotateY: -18 },   ease: 'power4.out',    duration: 0.95 },
]

onMounted(() => {
  wordRefs.value.forEach((el, i) => {
    const { from, ease, duration } = wordAnims[i]
    gsap.fromTo(
      el,
      from,
      { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, ease, duration, delay: 0.3 + i * 0.15 },
    )
  })
})
</script>

<template>
  <section class="hero">
    <WaveParticles />
    <div class="sentence">
      <span
        v-for="(word, i) in words"
        :key="word"
        :ref="el => { if (el) wordRefs[i] = el as HTMLElement }"
        :class="['word', `word-${i}`]"
      >{{ word }}</span>
    </div>

    <p class="sub">{{ hero.sub }}</p>
    <div class="scroll-cue">↓</div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 4vw 14vh;
}

/* ── sentence ── */
.sentence {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.25em;
  perspective: 800px;
}

.word {
  display: inline-block;
  opacity: 0;
  line-height: 1;
  will-change: transform, opacity;
}

.word-0 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 900;
  font-size: clamp(3rem, 9vw, 9rem);
  color: #172554;
  letter-spacing: -0.03em;
}

.word-1 {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 600;
  font-size: clamp(2.5rem, 7.5vw, 7.5rem);
  color: rgba(37, 99, 235, 0.75);
}

.word-2 {
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  font-size: clamp(3rem, 9vw, 9rem);
  color: #1e40af;
}

.word-3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 900;
  font-size: clamp(3rem, 9vw, 9rem);
  color: #0c4a6e;
  letter-spacing: -0.04em;
}

/* ── sub & scroll ── */
.sub {
  position: relative;
  z-index: 1;
  margin-top: 2rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  color: rgba(13, 43, 94, 0.5);
  letter-spacing: 0.05em;
  opacity: 0;
  animation: fadeIn 0.8s 1.2s ease forwards;
}

.scroll-cue {
  position: absolute;
  z-index: 1;
  bottom: 2rem;
  font-size: 1.5rem;
  color: rgba(13, 43, 94, 0.3);
  animation: bob 2s ease-in-out infinite;
}

@keyframes fadeIn { to { opacity: 1; } }

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(6px); }
}
</style>
