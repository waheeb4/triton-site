<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { achievements } from '@/content/index'

import lp0 from '@/assets/DSC05900.jpg'
import lp1 from '@/assets/DSC04383.JPG.jpeg'
import lp2 from '@/assets/IMG_0635.jpg'
import lp3 from '@/assets/WhatsApp Image 2026-05-15 at 5.36.21 PM.jpeg'
import lp4 from '@/assets/yehia.jpg'
import lp5 from '@/assets/DSC03845.jpg'
import lp6 from '@/assets/IMG_1530(1).jpg'

import rp0 from '@/assets/DSC04387.JPG.jpeg'
import rp1 from '@/assets/DSC04401.JPG.jpeg'
import rp2 from '@/assets/IMG_0639.jpg'
import rp3 from '@/assets/WhatsApp Image 2026-04-27 at 2.04.08 PM.jpeg'
import rp4 from '@/assets/WhatsApp Image 2026-05-15 at 5.36.17 PM.jpeg'
import rp5 from '@/assets/WhatsApp Image 2026-05-15 at 5.36.20 PM(1).jpeg'

const leftPhotos  = [lp0, lp1, lp2, lp3, lp4, lp5, lp6]
const rightPhotos = [rp0, rp1, rp2, rp3, rp4, rp5]

const sectionRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

onMounted(() => {
  gsap.set(contentRef.value!, { opacity: 0, y: 24, filter: 'blur(14px)' })
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        gsap.to(contentRef.value!, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.7, ease: 'power3.out',
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
  <section ref="sectionRef" class="achievements-section">

    <!-- Left column — scrolls up -->
    <div class="photo-band">
      <div class="photo-belt photo-belt--up">
        <div v-for="(photo, i) in [...leftPhotos, ...leftPhotos]" :key="`l${i}`" class="photo-card">
          <img :src="photo" draggable="false" loading="eager" decoding="async" />
        </div>
      </div>
    </div>

    <!-- Center text -->
    <div ref="contentRef" class="center-content">
      <h2 class="section-title">{{ achievements.title }}</h2>

      <div v-for="year in achievements.years" :key="year.label" class="year-block">
        <p class="year-label">{{ year.label }}</p>
        <p class="achievements-text">{{ year.awards }}</p>
        <p v-if="year.sub" class="achievements-sub">{{ year.sub }}</p>
        <p v-if="year.breakthrough" class="achievements-breakthrough">{{ year.breakthrough }}</p>
      </div>
    </div>

    <!-- Right column — scrolls down -->
    <div class="photo-band">
      <div class="photo-belt photo-belt--down">
        <div v-for="(photo, i) in [...rightPhotos, ...rightPhotos]" :key="`r${i}`" class="photo-card">
          <img :src="photo" draggable="false" loading="eager" decoding="async" />
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* ─── Section ───────────────────────────────────────── */
.achievements-section {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  position: relative;
  padding-top: 10vh;
  box-sizing: border-box;
}

/* ─── Photo bands ───────────────────────────────────── */
.photo-band {
  width: 22vw;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0 1vw;

  /* Gradient mask — graceful fade at top and bottom */
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 18%,
    black 82%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 18%,
    black 82%,
    transparent 100%
  );
}

/* ─── Photo belt — doubled for seamless loop ────────── */
.photo-belt {
  display: flex;
  flex-direction: column;
  gap: 1.4vw;
}

@keyframes scroll-up {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}

@keyframes scroll-down {
  from { transform: translateY(-50%); }
  to   { transform: translateY(0); }
}

.photo-belt--up {
  animation: scroll-up 38s linear infinite;
  will-change: transform;
}

.photo-belt--down {
  animation: scroll-down 32s linear infinite;
  will-change: transform;
}

/* ─── Individual photo cards ────────────────────────── */
.photo-card {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 6px 28px rgba(25, 36, 85, 0.14);
}

.photo-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* ─── Center content ────────────────────────────────── */
.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 3vw;
  text-align: center;
  position: relative;
  z-index: 10;
}

.section-title {
  font-family: 'Dx Wideground', sans-serif;
  font-size: clamp(48px, 6.5vw, 108px);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #0F9CD8;
  text-transform: uppercase;
  line-height: 1.0;
  margin: 0 0 5vh;
}

.year-block {
  margin-bottom: 4vh;
}

.year-block:last-child { margin-bottom: 0; }

.year-label {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(13px, 1.3vw, 19px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0F9CD8;
  margin: 0 0 1vh;
}

.achievements-text {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(15px, 1.6vw, 23px);
  font-weight: 400;
  color: #192455;
  line-height: 1.9;
  margin: 0 0 0.6vh;
}

.achievements-sub {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(13px, 1.3vw, 19px);
  font-weight: 500;
  color: #192455;
  opacity: 0.5;
  font-style: italic;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .photo-belt--up,
  .photo-belt--down {
    animation-play-state: paused;
  }
}

@media (max-width: 768px) {
  .achievements-section {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding-top: 80px;
    padding-bottom: 60px;
  }

  /* Hide right column */
  .photo-band:last-child { display: none; }

  .photo-band {
    width: 28vw;
    flex-shrink: 0;
  }

  .center-content {
    padding: 0 5vw;
  }

  .section-title {
    font-size: clamp(32px, 9vw, 56px);
    margin-bottom: 3vh;
  }

  .achievements-text {
    font-size: clamp(13px, 3.5vw, 17px);
    line-height: 1.7;
  }

  .achievements-sub {
    font-size: clamp(12px, 3vw, 15px);
  }

  .achievements-breakthrough {
    font-size: clamp(15px, 4vw, 20px);
  }

  .year-block {
    margin-bottom: 3vh;
  }
}

.achievements-breakthrough {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(17px, 2vw, 28px);
  font-weight: 700;
  color: #0F9CD8;
  margin: 0.5vh 0 0;
}
</style>
