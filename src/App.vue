<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Logo from './components/Logo.vue'
import Hero from './components/Hero.vue'
</script>

<template>
  <div class="page">
    <div class="logo-anchor">
      <Logo />
    </div>
    <NavBar />
    <Hero />
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
  top: 12px;
  left: 20px;
  z-index: 100;
}

.scroll-space {
  height: 200vh;
}
</style>
