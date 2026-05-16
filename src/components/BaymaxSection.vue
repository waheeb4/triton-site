<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import rovVideoUrl from '@/assets/rov-animation.webm'
import { baymax } from '@/content/index'

const { title, sub, panels } = baymax

const sectionRef = ref<HTMLElement>()
const videoElRef = ref<HTMLVideoElement>()
const panelRefs  = ref<(HTMLElement | null)[]>([])

let duration = 0
let scrollHandler: () => void

onMounted(() => {
  // initialise panels hidden
  panelRefs.value.forEach(el => {
    if (el) gsap.set(el, { opacity: 0, x: 18 })
  })

  videoElRef.value!.addEventListener('loadedmetadata', () => {
    duration = videoElRef.value!.duration
  })

  scrollHandler = () => {
    if (!duration || !sectionRef.value) return
    const rect      = sectionRef.value.getBoundingClientRect()
    const scrollable = sectionRef.value.offsetHeight - window.innerHeight
    const scrolled  = Math.max(0, Math.min(scrollable, -rect.top))
    const t = (scrolled / scrollable) * duration

    videoElRef.value!.currentTime = t

    panels.forEach((panel, i) => {
      const el = panelRefs.value[i]
      if (!el) return
      const active = t >= panel.start && t <= panel.end
      gsap.to(el, { opacity: active ? 1 : 0, x: active ? 0 : 18, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
    })
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', scrollHandler))
</script>

<template>
  <section ref="sectionRef" class="baymax-section">
    <div class="sticky-frame">

      <!-- Left: video bleeds off the left edge -->
      <div class="left-col">
        <div class="video-wrap">
          <video ref="videoElRef" muted playsinline preload="metadata">
            <source :src="rovVideoUrl" type="video/webm" />
          </video>
        </div>
      </div>

      <!-- Right: title + scroll-driven panels -->
      <div class="right-col">
        <div class="right-content">
          <h2 class="baymax-title">{{ title }}</h2>
          <p  class="baymax-sub">{{ sub }}</p>

          <div class="panels-area">
            <div
              v-for="(panel, i) in panels"
              :key="panel.id"
              :ref="(el) => { panelRefs[i] = el as HTMLElement | null }"
              class="panel"
            >
              <p class="panel-label">{{ panel.label }}</p>
              <p class="panel-desc">{{ panel.desc }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.baymax-section {
  width: 100%;
  height: 550vh;
  position: relative;
  margin-top: 120px;
}

.sticky-frame {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* ── Left column ─────────────────────────────── */
.left-col {
  flex: 0 0 58%;
  height: 100%;
  display: flex;
  align-items: center;
  /* bleed video off the left edge */
  margin-left: -5vw;
}

.video-wrap {
  width: 100%;
}

.video-wrap video {
  width: 100%;
  display: block;
}

/* ── Right column ────────────────────────────── */
.right-col {
  flex: 0 0 42%;
  height: 100%;
  display: flex;
  align-items: center;
}

.right-content {
  padding-left: 2vw;
}

.baymax-title {
  font-family: 'Dx Wideground', sans-serif;
  font-size: clamp(48px, 6.5vw, 108px);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #0F9CD8;
  text-transform: uppercase;
  line-height: 1.0;
  margin: 0 0 14px;
}

.baymax-sub {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(13px, 1.3vw, 19px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0F9CD8;
  margin: 0 0 48px;
}

/* ── Panels ──────────────────────────────────── */
.panels-area {
  position: relative;
}

/* all panels stack in the same spot; only one is visible at a time */
.panel {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.panel-label {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(13px, 1.3vw, 19px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0F9CD8;
  margin: 0 0 12px;
}

.panel-desc {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(14px, 1.4vw, 20px);
  font-weight: 400;
  color: #192455;
  line-height: 1.8;
  max-width: 380px;
  margin: 0;
}
</style>
