<script setup lang="ts">
import ModelViewer from './ModelViewer.vue'
import { nav } from '../content/index'

const leftItems  = nav.left.map(label => ({ label, href: `#${label.toLowerCase()}` }))
const rightItems = nav.right.map(label => ({ label, href: `#${label.toLowerCase()}` }))
</script>

<template>
  <nav class="nav-root">
    <div class="nav-arm nav-arm--left">
      <a v-for="item in leftItems" :key="item.label" :href="item.href" class="nav-item">
        {{ item.label }}
      </a>
    </div>

    <div class="model-slot">
      <ModelViewer />
    </div>

    <div class="nav-arm nav-arm--right">
      <a v-for="item in rightItems" :key="item.label" :href="item.href" class="nav-item">
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>

<style scoped>
.nav-root {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0;
  z-index: 100;
  white-space: nowrap;
  height: 52px;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.10);
  border-radius: 10px;
  overflow: visible;
}

.nav-arm {
  height: 52px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 12px;
}

.model-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  flex-shrink: 0;
}

.nav-item {
  padding: 7px 16px;
  border-radius: 5px;
  font-family: 'Space Grotesk Variable', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #0d2b5e;
  text-decoration: none;
  transition: background 0.15s, color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.nav-item:hover {
  background: rgba(56, 189, 248, 0.2);
  color: #0d2b5e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.35);
}
</style>
