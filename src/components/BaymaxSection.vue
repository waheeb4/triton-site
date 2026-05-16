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
  panelRefs.value.forEach(el => {
    if (el) gsap.set(el, { opacity: 0, y: 10 })
  })

  videoElRef.value!.addEventListener('loadedmetadata', () => {
    duration = videoElRef.value!.duration
  })

  scrollHandler = () => {
    if (!duration || !sectionRef.value) return
    const rect       = sectionRef.value.getBoundingClientRect()
    const scrollable = sectionRef.value.offsetHeight - window.innerHeight
    const scrolled   = Math.max(0, Math.min(scrollable, -rect.top))
    const t = (scrolled / scrollable) * duration

    videoElRef.value!.currentTime = t

    panels.forEach((panel, i) => {
      const el = panelRefs.value[i]
      if (!el) return
      const active = t >= panel.start && t <= panel.end
      gsap.to(el, { opacity: active ? 1 : 0, y: active ? 0 : 10, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
    })
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', scrollHandler))
</script>

<template>
  <section ref="sectionRef" class="baymax-section">
    <div class="sticky-frame">
      <div class="inner">

        <!-- Left: video -->
        <div class="video-wrap">
          <video ref="videoElRef" muted playsinline preload="auto">
            <source :src="rovVideoUrl" type="video/webm" />
          </video>
        </div>

        <!-- Right: title + subtitle + panels -->
        <div class="text-col">
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
  justify-content: center;
}

/* centered block — gaps on both sides */
.inner {
  width: 90%;
  display: flex;
  align-items: center;
  gap: 4%;
}

/* ── Video ── height-driven so it fills the viewport */
.video-wrap {
  flex: 0 0 auto;
  height: 72vh;
  aspect-ratio: 16 / 9;
  border: 1.5px solid rgba(15, 156, 216, 0.45);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 32px rgba(15, 156, 216, 0.12), 0 8px 40px rgba(25, 36, 85, 0.1);
}

.video-wrap video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* ── Text column ── */
.text-col {
  flex: 1;
  min-width: 0;
}

.baymax-title {
  font-family: 'Dx Wideground', sans-serif;
  font-size: clamp(48px, 6.5vw, 108px);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #0F9CD8;
  text-transform: uppercase;
  line-height: 1.0;
  margin: 0 0 12px;
}

.baymax-sub {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(13px, 1.3vw, 19px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #192455;
  margin: 0 0 40px;
}

/* ── Panels ── */
.panels-area {
  position: relative;
  min-height: 120px;
}

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
  margin: 0 0 10px;
}

.panel-desc {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(14px, 1.4vw, 20px);
  font-weight: 400;
  color: #192455;
  line-height: 1.8;
  max-width: 400px;
  margin: 0;
}
</style>
