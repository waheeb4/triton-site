<script setup lang="ts">
import logoUrl from '../assets/triton-logo-2026.png'
import { docs } from '../content/index'
</script>

<template>
  <div class="docs-root">
    <img :src="logoUrl" alt="Triton" class="docs-logo" />

    <div class="docs-card">
      <span class="docs-tag">{{ docs.tag }}</span>
      <h1 class="docs-heading">{{ docs.heading }}</h1>
      <p class="docs-body">{{ docs.body }}</p>
      <a href="#home" class="docs-back">{{ docs.back }}</a>
    </div>
  </div>
</template>

<style scoped>
.docs-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: 40px 24px;
}

.docs-logo {
  height: 52px;
  width: auto;
  opacity: 0.7;
}

.docs-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 560px;
  gap: 20px;
}

.docs-tag {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0F9CD8;
  background: rgba(15, 156, 216, 0.1);
  border: 1px solid rgba(15, 156, 216, 0.25);
  padding: 4px 12px;
  border-radius: 100px;
}

.docs-heading {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(36px, 6vw, 64px);
  font-style: italic;
  font-weight: 400;
  color: #192455;
  margin: 0;
  line-height: 1.1;
}

.docs-body {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
  color: #192455;
  opacity: 0.7;
  margin: 0;
}

.docs-back {
  margin-top: 8px;
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #0F9CD8;
  text-decoration: none;
  transition: opacity 0.15s;
}

.docs-back:hover {
  opacity: 0.7;
}
</style>
