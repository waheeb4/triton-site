<script setup lang="ts">
import { watch, ref, reactive } from 'vue'
import gsap from 'gsap'
import { hero } from '../content/index'
import WaveParticles from './WaveParticles.vue'
import rovImg from '../assets/rov-hero.png'

const props = defineProps<{ animateReady: boolean }>()

const engRef      = ref<HTMLElement>()
const theRef      = ref<HTMLElement>()
const deepRef     = ref<HTMLElement>()
const frontierRef = ref<HTMLElement>()
const rovRef      = ref<HTMLElement>()
const subRef      = ref<HTMLElement>()

// ── Debug panel (off by default — set showDebug = true to re-enable) ──
const showDebug = ref(false)
const ctrl = reactive({
  eng:      { x: 268,  y: 196, fs: 223 },
  the_:     { x: 1608, y: 161, fs: 106 },
  deep:     { x: 1625, y: 232, fs: 206 },
  frontier: { x: 625,  y: 786, fs: 369 },
  rov:      { w: 100,  r: -21, x: 0,   y: 0 },
})
const wordStyle = (c: { x: number; y: number; fs: number }) => ({
  left: `${c.x}px`, top: `${c.y}px`, fontSize: `${c.fs}px`,
})

watch(() => props.animateReady, (ready) => {
  if (!ready) return

  if (showDebug.value) {
    [engRef.value, theRef.value, deepRef.value, frontierRef.value, rovRef.value, subRef.value]
      .forEach(el => el && gsap.set(el, { opacity: 1 }))
    return
  }

  gsap.fromTo(engRef.value!,
    { opacity: 0, x: -80 },
    { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay: 0.05 })

  gsap.fromTo(theRef.value!,
    { opacity: 0, x: 80 },
    { opacity: 1, x: 0, duration: 0.85, ease: 'back.out(1.3)', delay: 0.18 })

  gsap.fromTo(deepRef.value!,
    { opacity: 0, x: 100 },
    { opacity: 1, x: 0, duration: 1.0, ease: 'expo.out', delay: 0.28 })

  gsap.fromTo(frontierRef.value!,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 0.95, ease: 'power4.out', delay: 0.4 })

  gsap.fromTo(rovRef.value!,
    { opacity: 0, scale: 0.88, y: 40 },
    { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.1 })

  gsap.fromTo(subRef.value!,
    { opacity: 0 },
    { opacity: 1, duration: 0.8, delay: 0.55, ease: 'power2.out' })
})
</script>

<template>
  <section class="hero">
    <WaveParticles />

    <span ref="engRef"      class="word word-eng"      :style="showDebug ? wordStyle(ctrl.eng)      : {}">{{ hero.engineering }}</span>
    <span ref="theRef"      class="word word-the"      :style="showDebug ? wordStyle(ctrl.the_)     : {}">{{ hero.article }}</span>
    <span ref="deepRef"     class="word word-deep"     :style="showDebug ? wordStyle(ctrl.deep)     : {}">{{ hero.deep }}</span>
    <span ref="frontierRef" class="word word-frontier" :style="showDebug ? wordStyle(ctrl.frontier) : {}">{{ hero.frontier }}</span>

    <div class="rov-positioner" :style="showDebug ? { transform: `translate(calc(-50% + ${ctrl.rov.x}px), calc(-50% + ${ctrl.rov.y}px))` } : {}">
      <div ref="rovRef" class="rov-inner">
        <img :src="rovImg" class="rov-img" :style="showDebug ? { width: `${ctrl.rov.w}vw`, transform: `rotate(${ctrl.rov.r}deg)` } : {}" alt="Triton ROV" draggable="false" />
      </div>
    </div>

    <p ref="subRef" class="sub">{{ hero.sub }}</p>
    <div class="scroll-cue">↓</div>

    <!-- Debug panel: set showDebug = true in script to activate -->
    <template v-if="showDebug">
      <button class="debug-toggle" @click="showDebug = false">✕ close</button>
      <aside class="debug-panel">
        <template v-for="(cfg, key) in { Engineering: ctrl.eng, 'the': ctrl.the_, Deep: ctrl.deep, Frontier: ctrl.frontier }" :key="key">
          <div class="dp-section">
            <div class="dp-title">{{ key }}</div>
            <div v-for="prop in ['fs','x','y'] as const" :key="prop" class="dp-row">
              <span class="dp-label">{{ prop }}</span>
              <input type="range" class="dp-slider" v-model.number="cfg[prop as 'fs'|'x'|'y']" :min="prop==='fs'?0:-500" :max="prop==='fs'?400:2000" />
              <input type="number" class="dp-num" v-model.number="cfg[prop as 'fs'|'x'|'y']" />
            </div>
          </div>
        </template>
        <div class="dp-section">
          <div class="dp-title">ROV</div>
          <div v-for="[label, key, min, max] in [['w (vw)','w',0,200],['rot °','r',-180,180],['x (px)','x',-800,800],['y (px)','y',-800,800]]" :key="key" class="dp-row">
            <span class="dp-label">{{ label }}</span>
            <input type="range" class="dp-slider" v-model.number="ctrl.rov[key as 'w'|'r'|'x'|'y']" :min="min" :max="max" />
            <input type="number" class="dp-num" v-model.number="ctrl.rov[key as 'w'|'r'|'x'|'y']" />
          </div>
        </div>
      </aside>
    </template>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* ── ROV ── */
.rov-positioner {
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.rov-inner {
  opacity: 0;
}

.rov-img {
  display: block;
  width: 100vw;
  height: auto;
  transform: rotate(-21deg);
  user-select: none;
  filter:
    drop-shadow(0px 60px 120px rgba(0, 5, 40, 0.65))
    drop-shadow(0px 16px 40px rgba(26, 86, 219, 0.35));
}

/* ── Words ── */
.word {
  position: absolute;
  opacity: 0;
  line-height: 1;
  will-change: transform, opacity;
  white-space: nowrap;
  z-index: 1;
}

.word-eng {
  left: 268px;
  top: 196px;
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-weight: 800;
  font-size: 223px;
  color: #172554;
  letter-spacing: -0.03em;
}

.word-the {
  left: 1608px;
  top: 161px;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 106px;
  color: rgba(37, 99, 235, 0.75);
}

.word-deep {
  left: 1625px;
  top: 232px;
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  font-size: 206px;
  color: #1e40af;
}

.word-frontier {
  left: 625px;
  top: 786px;
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-weight: 800;
  font-size: 369px;
  color: #0c4a6e;
  letter-spacing: -0.04em;
}

/* ── Sub & scroll ── */
.sub {
  position: absolute;
  bottom: 6vh;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: 'Space Grotesk Variable', sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  color: rgba(13, 43, 94, 0.5);
  letter-spacing: 0.05em;
  opacity: 0;
  z-index: 2;
}

.scroll-cue {
  position: absolute;
  z-index: 2;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: rgba(13, 43, 94, 0.3);
  animation: bob 2s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(6px); }
}

/* ── Debug panel (only rendered when showDebug = true) ── */
.debug-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100000;
  padding: 6px 12px;
  background: rgba(10, 12, 20, 0.85);
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.debug-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 270px;
  height: 100vh;
  overflow-y: auto;
  background: rgba(8, 10, 18, 0.93);
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255,255,255,0.08);
  color: #cbd5e1;
  font-family: monospace;
  font-size: 11px;
  z-index: 99999;
  padding: 12px 10px 80px;
  box-sizing: border-box;
}

.dp-section { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.dp-title   { font-size: 10px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
.dp-row     { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.dp-label   { width: 44px; flex-shrink: 0; color: #94a3b8; }
.dp-slider  { flex: 1; height: 2px; accent-color: #3b82f6; cursor: pointer; }
.dp-num     { width: 54px; flex-shrink: 0; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 3px; color: #e2e8f0; font-family: monospace; font-size: 11px; padding: 2px 4px; text-align: right; }
.dp-num:focus { outline: 1px solid #3b82f6; }
</style>
