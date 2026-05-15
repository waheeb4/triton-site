<script setup lang="ts">
import { watch, ref, reactive, onMounted, onUnmounted } from 'vue'
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
const typedText    = ref('')
const cursorVisible = ref(false)
const typingTimeouts: ReturnType<typeof setTimeout>[] = []

// ── Debug panel (off by default — set showDebug = true to re-enable) ──
const showDebug  = ref(false)
const panelOpen  = ref(true)
const ctrl = reactive({
  eng:      { x: 13.96, y: 18.15, fs: 223 },
  the_:     { x: 83.75, y: 14.91, fs: 106 },
  deep:     { x: 84.64, y: 21.48, fs: 206 },
  frontier: { x: 32.55, y: 72.78, fs: 369 },
  rov:      { w: 65,    r: -21,   x: 0,   y: 0,  op: 100 },
  sub:      { x: 50,   yBottom: 6, fs: 20 },
})
// x/y are % of artboard (1920×1080); fs stays in artboard px
const wordStyle = (c: { x: number; y: number; fs: number }) => ({
  left: `${(c.x / 100) * 1920}px`,
  top:  `${(c.y / 100) * 1080}px`,
  fontSize: `${c.fs}px`,
})

// ── Artboard scale: design is 1920px wide, scale to fill viewport ──
const scale = ref(1)
function syncScale() {
  scale.value = window.innerWidth / 1920
}
const CTRL_KEY = 'triton-hero-ctrl'

onMounted(() => {
  syncScale()
  window.addEventListener('resize', syncScale)
  try {
    const saved = localStorage.getItem(CTRL_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      for (const k of Object.keys(parsed) as (keyof typeof ctrl)[]) {
        if (ctrl[k]) Object.assign(ctrl[k], parsed[k])
      }
    }
  } catch {}
})

watch(ctrl, (val) => {
  localStorage.setItem(CTRL_KEY, JSON.stringify(val))
}, { deep: true })
onUnmounted(() => {
  window.removeEventListener('resize', syncScale)
  typingTimeouts.forEach(clearTimeout)
})

function animate() {
  const blur = (el: HTMLElement, delay: number) =>
    gsap.fromTo(el, { opacity: 0, y: 35, filter: 'blur(18px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power3.out', delay })
  blur(engRef.value!,      0.05)
  blur(theRef.value!,      0.2)
  blur(deepRef.value!,     0.3)
  blur(frontierRef.value!, 0.42)
  gsap.fromTo(rovRef.value!, { opacity: 0, scale: 1.06, filter: 'blur(22px)' }, {
    opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out', delay: 0.1,
    onComplete() {
      gsap.to(rovRef.value!, { y: -14, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
  })
  typingTimeouts.push(setTimeout(() => {
    const full = hero.sub
    cursorVisible.value = true
    let i = 0
    function typeNext() {
      if (i < full.length) {
        typedText.value = full.slice(0, ++i)
        typingTimeouts.push(setTimeout(typeNext, i === 15 ? 550 : 40))
      }
    }
    typeNext()
  }, 550))
}

watch(() => props.animateReady, (ready) => {
  if (!ready) return
  if (showDebug.value) {
    [engRef.value, theRef.value, deepRef.value, frontierRef.value, rovRef.value, subRef.value]
      .forEach(el => el && gsap.set(el, { opacity: 1 }))
    return
  }
  animate()
})
</script>

<template>
  <section class="hero">
    <!--
      Artboard: fixed 1920×1080px canvas, absolutely positioned so it never
      affects document flow. The parent .hero clips it to the viewport.
      transform: scale(scale) shrinks/grows the whole thing as one unit.
    -->
    <div
      class="artboard"
      :style="{ transform: `translate(-50%, -50%) scale(${scale})` }"
    >
      <WaveParticles />

      <span ref="engRef"      class="word word-eng"      :style="wordStyle(ctrl.eng)">{{ hero.engineering }}</span>
      <span ref="theRef"      class="word word-the"      :style="wordStyle(ctrl.the_)">{{ hero.article }}</span>
      <span ref="deepRef"     class="word word-deep"     :style="wordStyle(ctrl.deep)">{{ hero.deep }}</span>
      <span ref="frontierRef" class="word word-frontier" :style="wordStyle(ctrl.frontier)">{{ hero.frontier }}</span>

      <div class="rov-positioner" :style="{ transform: `translate(calc(-50% + ${ctrl.rov.x}px), calc(-50% + ${ctrl.rov.y}px))` }">
        <div ref="rovRef" class="rov-inner">
          <img :src="rovImg" class="rov-img" :style="{ width: `${(ctrl.rov.w / 100) * 1920}px`, transform: `rotate(${ctrl.rov.r}deg)`, opacity: ctrl.rov.op / 100 }" alt="Triton ROV" draggable="false" />
        </div>
      </div>

      <p ref="subRef" class="sub" :style="{ left: `${ctrl.sub.x}%`, bottom: `${ctrl.sub.yBottom}%`, fontSize: `${ctrl.sub.fs}px` }">{{ showDebug ? hero.sub : typedText }}<span class="cursor" :class="{ 'cursor--on': cursorVisible || showDebug }">|</span></p>
      <div class="scroll-cue">↓</div>
    </div>

    <!-- Debug panel: position:fixed — unaffected by the artboard scale -->
    <template v-if="showDebug">
      <button class="debug-toggle" @click="panelOpen = !panelOpen">{{ panelOpen ? '✕' : '⚙' }}</button>
      <aside v-if="panelOpen" class="debug-panel">
        <template v-for="(cfg, key) in { Engineering: ctrl.eng, 'the': ctrl.the_, Deep: ctrl.deep, Frontier: ctrl.frontier }" :key="key">
          <div class="dp-section">
            <div class="dp-title">{{ key }}</div>
            <div v-for="prop in ['fs','x','y'] as const" :key="prop" class="dp-row">
              <span class="dp-label">{{ prop === 'fs' ? 'fs' : prop + ' %' }}</span>
              <input type="range" class="dp-slider" v-model.number="cfg[prop as 'fs'|'x'|'y']" :min="0" :max="prop==='fs'?500:100" :step="prop==='fs'?1:0.1" />
              <input type="number" class="dp-num" v-model.number="cfg[prop as 'fs'|'x'|'y']" />
            </div>
          </div>
        </template>
        <div class="dp-section">
          <div class="dp-title">ROV</div>
          <div v-for="[label, key, min, max, step] in [['w %','w',0,100,0.1],['rot °','r',-180,180,1],['x (px)','x',-800,800,1],['y (px)','y',-800,800,1],['opacity','op',0,100,1]]" :key="key" class="dp-row">
            <span class="dp-label">{{ label }}</span>
            <input type="range" class="dp-slider" v-model.number="ctrl.rov[key as 'w'|'r'|'x'|'y'|'op']" :min="min" :max="max" :step="step" />
            <input type="number" class="dp-num" v-model.number="ctrl.rov[key as 'w'|'r'|'x'|'y'|'op']" />
          </div>
        </div>
        <div class="dp-section">
          <div class="dp-title">SUB</div>
          <div v-for="[label, key, min, max, step] in [['x %','x',0,100,0.1],['bottom %','yBottom',0,100,0.1],['fs (px)','fs',0,60,1]]" :key="key" class="dp-row">
            <span class="dp-label">{{ label }}</span>
            <input type="range" class="dp-slider" v-model.number="ctrl.sub[key as 'x'|'yBottom'|'fs']" :min="min" :max="max" :step="step" />
            <input type="number" class="dp-num" v-model.number="ctrl.sub[key as 'x'|'yBottom'|'fs']" />
          </div>
        </div>
      </aside>
    </template>
  </section>
</template>

<style scoped>
/* Viewport clip: always 100vw × 100vh, never scrolls */
.hero {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/*
  Artboard: the actual 1920×1080 design canvas.
  Centered in the hero via top/left 50% + translate(-50%,-50%) so that
  any leftover space (when viewport is taller than the scaled artboard)
  is distributed evenly rather than piling up at the bottom.
*/
.artboard {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
}

/* ── ROV ── */
.rov-positioner {
  position: absolute;
  top: 46%;
  left: 50%;
  z-index: 5;
}

.rov-inner {
  opacity: 0;
}

.rov-img {
  display: block;
  height: auto;
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
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-weight: 800;
  color: #172554;
  letter-spacing: -0.03em;
}

.word-the {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 600;
  color: rgba(37, 99, 235, 0.75);
}

.word-deep {
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  color: #1e40af;
}

.word-frontier {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-weight: 800;
  color: #0c4a6e;
  letter-spacing: -0.04em;
}

/* ── Sub & scroll ── */
.sub {
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: 'Space Grotesk Variable', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: rgba(13, 43, 94, 0.5);
  letter-spacing: 0.05em;
  z-index: 2;
}

.cursor {
  opacity: 0;
  color: rgba(13, 43, 94, 0.5);
  text-shadow: 0 0 10px rgba(26, 86, 219, 0.65);
  font-weight: 300;
}

.cursor--on {
  animation: blink 1s step-end infinite;
}

.scroll-cue {
  position: absolute;
  z-index: 2;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26px;
  color: rgba(13, 43, 94, 0.3);
  animation: bob 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
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
