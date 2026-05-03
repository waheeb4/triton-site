<script setup lang="ts">
import Logo from './components/Logo.vue'
</script>

<template>
  <div class="page">
    <header>
      <Logo />
    </header>
    <main>
      <div class="scroll-space"></div>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 300vh;
}

header {
  position: fixed;
  top: 1rem;
  left: 1rem;
}

.scroll-space {
  height: 300vh;
}
</style>
