<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import gsap from 'gsap'
import { VueLenis } from 'lenis/vue'
import NavBar from './components/NavBar.vue'
import Logo from './components/Logo.vue'
import Hero from './components/Hero.vue'
import SplashScreen from './components/SplashScreen.vue'

const lenisRef = ref()
const logoAnchorRef = ref<HTMLElement>()
const splashDone = ref(false)
const bgGone = ref(false)
const loaded = ref(false)

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return
  function tick(time: number) { lenisRef.value.lenis.raf(time * 1000) }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  onInvalidate(() => gsap.ticker.remove(tick))
})

onMounted(async () => {
  const el = logoAnchorRef.value!
  const rect = el.getBoundingClientRect()

  // How far to move the logo to reach screen center
  const dx = window.innerWidth  / 2 - (rect.left + rect.width  / 2)
  const dy = window.innerHeight / 2 - (rect.top  + rect.height / 2)
  const scale = 160 / rect.height   // grow from natural 52px to 160px

  gsap.set(el, { x: dx, y: dy, scale })

  // Bob while splash is showing
  const bobTween = gsap.to(el, {
    y: dy - 16,
    duration: 1.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })

  const minWait = new Promise<void>(r => setTimeout(r, 2200))
  await Promise.all([document.fonts.ready, minWait])

  bobTween.kill()
  loaded.value = true  // tells SplashScreen bg to start fading

  // Fly logo back to its natural corner position
  gsap.to(el, {
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'power3.inOut',
    onComplete: () => { splashDone.value = true },
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
    <NavBar />
    <Hero :animate-ready="splashDone" />
    <main>
      <div class="scroll-space" />
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
  top: 17px;
  left: 20px;
  z-index: 10000;  /* above splash bg (9999) so logo is always visible */
}

.scroll-space {
  height: 200vh;
}
</style>
