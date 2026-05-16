<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { team } from '@/content/index'

// Doubled card array for seamless loop
const cards = [...team, ...team]

const sectionRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
const beltRef = ref<HTMLElement>()

const CARD_W = 280
const GAP = 24
const CARD_STRIDE = CARD_W + GAP          // 308px per slot
const TOTAL_W = CARD_STRIDE * team.length // width of one full set

const BASE_SPEED = 130                    // px/s auto-scroll
let currentX = 0
let isDragging = false
let dragLastX = 0
let dragVelocity = 0                      // px per frame from mouse movement
let velocityBoost = 0
const boostObj = { val: 0 }
let boostTween: gsap.core.Tween | null = null
let tickerFn: gsap.TickerCallback

function onPointerDown(e: PointerEvent) {
  isDragging = true
  dragLastX = e.clientX
  dragVelocity = 0
  boostTween?.kill()
  boostObj.val = 0
  velocityBoost = 0
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging) return
  dragVelocity = dragLastX - e.clientX   // drag left → positive → belt moves forward
  dragLastX = e.clientX
}

function onPointerUp() {
  if (!isDragging) return
  isDragging = false
  // hand off drag momentum to boost, then decay to normal pace
  boostObj.val = dragVelocity * 6
  velocityBoost = boostObj.val
  boostTween = gsap.to(boostObj, {
    val: 0,
    duration: 2,
    ease: 'power2.out',
    onUpdate() { velocityBoost = boostObj.val },
  })
}

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  tickerFn = (_time, deltaTime) => {
    if (reducedMotion) return
    const dt = Math.min(deltaTime, 33)

    if (isDragging) {
      currentX -= dragVelocity              // belt tracks mouse directly
      dragVelocity *= 0.75                  // friction: belt settles if mouse stops
    } else {
      currentX -= ((BASE_SPEED + velocityBoost) * dt) / 1000
    }

    if (currentX < -TOTAL_W) currentX += TOTAL_W
    beltRef.value!.style.transform = `translateX(${currentX}px)`
  }

  gsap.ticker.add(tickerFn)

  // Entrance animation — animate the track element directly
  // (filter on a parent of will-change:transform children is ignored by the compositor)
  gsap.set(trackRef.value!, { opacity: 0, y: 32 })
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        gsap.to(trackRef.value!, {
          opacity: 1, y: 0,
          duration: 0.6, ease: 'power3.out',
        })
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )
  observer.observe(sectionRef.value!)
})

onUnmounted(() => {
  gsap.ticker.remove(tickerFn)
  boostTween?.kill()
})
</script>

<template>
  <section ref="sectionRef" class="team-section">
    <div
      ref="trackRef"
      class="team-track"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <div ref="beltRef" class="team-belt">
        <div
          v-for="(member, i) in cards"
          :key="i"
          class="team-card"
        >
          <div class="card-photo">
            <img
              :src="`/team/${member.photo}`"
              :alt="`${member.firstName} ${member.lastName}`"
              :draggable="false"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="card-info">
            <p class="card-first-name">{{ member.firstName }}</p>
            <p class="card-last-name">{{ member.lastName }}</p>
            <p class="card-role">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.team-section {
  width: 100vw;
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.team-track {
  width: 100%;
  height: 460px;
  overflow: hidden;
  perspective: 1200px;
  cursor: grab;
  user-select: none;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

@media (max-width: 768px) {
  .team-section { padding: 24px 0; }
  .team-track { height: 300px; }
  .team-card { width: 200px; height: 280px; }
  .card-first-name { font-size: 20px; }
  .card-last-name { font-size: 12px; }
  .card-role { font-size: 12px; margin-top: 2px; }
}

.team-track:active {
  cursor: grabbing;
}

.team-belt {
  display: flex;
  gap: 24px;
  will-change: transform;
  align-items: center;
  height: 100%;
  padding: 20px 0;
  width: max-content;
  transform-style: preserve-3d;
}

.team-card {
  flex-shrink: 0;
  width: 280px;
  height: 400px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(25, 36, 85, 0.12);
  overflow: hidden;
  background: #fff;
  will-change: transform;
}

.card-photo {
  width: 100%;
  height: 68%;
  overflow: hidden;
}

.card-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  pointer-events: none;
}

.card-info {
  height: 32%;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  background: #fff;
}

.card-first-name {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #192455;
  line-height: 1.15;
  margin: 0;
}

.card-last-name {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: rgba(25, 36, 85, 0.65);
  line-height: 1.2;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.card-role {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #0F9CD8;
  margin: 5px 0 0;
}
</style>
