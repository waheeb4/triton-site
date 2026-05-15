<script setup lang="ts">
import { ref, onMounted, watchEffect, watch } from 'vue'
import gsap from 'gsap'
import { VueLenis } from 'lenis/vue'
import NavBar from './components/NavBar.vue'
import Logo from './components/Logo.vue'
import Hero from './components/Hero.vue'
import SplashScreen from './components/SplashScreen.vue'
import AboutSection from './components/AboutSection.vue'
import TeamSection from './components/TeamSection.vue'
import AchievementsSection from './components/AchievementsSection.vue'
import ContactSection from './components/ContactSection.vue'
import uniLogoUrl from './assets/uni-logo.png'

const lenisRef = ref()
const logoAnchorRef = ref<HTMLElement>()
const uniLogoRef = ref<HTMLElement>()
const splashDone = ref(false)
const bgGone = ref(false)
const loaded = ref(false)

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return
  const lenis = lenisRef.value.lenis
  function tick(time: number) { lenis.raf(time * 1000) }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  lenis.stop()  // locked until splash completes
  onInvalidate(() => gsap.ticker.remove(tick))
})

onMounted(async () => {
  const el = logoAnchorRef.value!
  const rect = el.getBoundingClientRect()

  // Natural anchor is position:fixed top:17px left:20px — stable regardless of viewport size.
  // Use these to compute dx/dy fresh on every resize instead of caching stale window dimensions.
  const naturalCx = 8 + rect.width  / 2
  const naturalCy = 20 + rect.height / 2
  const logoScale = 300 / rect.height

  function centerLogo() {
    const dx = window.innerWidth  / 2 - naturalCx
    const dy = window.innerHeight / 2 - naturalCy
    gsap.killTweensOf(el)
    gsap.set(el, { x: dx, y: dy, scale: logoScale, opacity: 1 })
    gsap.to(el, { y: dy - 16, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  }

  centerLogo()

  // Re-center whenever the viewport resizes during splash (Hyprland tiling, devtools, etc.)
  window.addEventListener('resize', centerLogo)

  const minWait = new Promise<void>(r => setTimeout(r, 2200))
  await Promise.all([document.fonts.ready, minWait])

  window.removeEventListener('resize', centerLogo)
  gsap.killTweensOf(el)
  loaded.value = true  // tells SplashScreen bg to start fading

  // Fly logo back to its natural corner position
  gsap.to(el, {
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'power3.inOut',
    onComplete: () => {
      gsap.set(el, { clearProps: 'all' })
      el.style.opacity = '1'
      splashDone.value = true
      lenisRef.value?.lenis?.start()
      gsap.fromTo(uniLogoRef.value!,
        { opacity: 0, y: 10, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', delay: 0.15 }
      )
    },
  })
})
</script>

<template>
  <VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />
  <div class="page">
    <SplashScreen
      v-if="!bgGone"
      :loaded="loaded"
      @done="bgGone = true"
    />

    <div ref="logoAnchorRef" class="logo-anchor">
      <Logo />
    </div>

    <div ref="uniLogoRef" class="uni-logo-anchor">
      <img :src="uniLogoUrl" alt="University logo" class="uni-logo" />
    </div>

    <NavBar />
    <Hero :animate-ready="splashDone" />
    <main>
      <AboutSection />
      <TeamSection />
      <AchievementsSection />
      <ContactSection />
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #eef2ff;
  background-image:
    radial-gradient(ellipse 70% 55% at 15% 25%, rgba(147, 197, 253, 0.75) 0%, transparent 65%),
    radial-gradient(ellipse 55% 65% at 85% 15%, rgba(196, 181, 253, 0.65) 0%, transparent 65%),
    radial-gradient(ellipse 60% 45% at 55% 85%, rgba(110, 231, 183, 0.45) 0%, transparent 65%),
    radial-gradient(ellipse 45% 55% at 75% 55%, rgba(147, 197, 253, 0.4) 0%, transparent 60%),
    radial-gradient(ellipse 80% 40% at 30% 75%, rgba(255, 255, 255, 0.9) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 40%, rgba(224, 231, 255, 0.6) 0%, transparent 70%);
}

.logo-anchor {
  position: fixed;
  top: 20px;
  left: 8px;
  z-index: 10000;  /* above splash bg (9999) so logo is always visible */
  opacity: 0;      /* hidden until centerLogo() positions and reveals it */
}

.uni-logo-anchor {
  position: fixed;
  top: 23px;
  right: 24px;
  z-index: 10000;
  opacity: 0;      /* hidden until splash completes */
}

.uni-logo {
  height: 45px;
  width: auto;
}
</style>
