<script setup lang="ts">
import Logo from './components/Logo.vue'
import ModelViewer from './components/ModelViewer.vue'
</script>

<template>
  <div class="page">
    <header>
      <Logo />
    </header>
    <div class="model">
      <ModelViewer />
    </div>
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

.model {
  position: fixed;
  top: 0;
  right: 1rem;
}

.scroll-space {
  height: 300vh;
}
</style>
