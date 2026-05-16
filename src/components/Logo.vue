<script setup lang="ts">
import LogoImg from '../assets/triton-logo-2026.png'
</script>

<template>
  <img :src="LogoImg" class="logo" alt="Triton" />
</template>

<style scoped>
.logo {
  height: 52px;
  width: auto;
  display: block;
}

@media (max-width: 768px) {
  .logo { height: 36px; }
}
</style>
