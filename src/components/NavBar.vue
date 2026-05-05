<script setup lang="ts">
import ModelViewer from './ModelViewer.vue'
import { nav } from '../content/index'

const leftItems  = nav.left.map(label => ({ label, href: `#${label.toLowerCase()}` }))
const rightItems = nav.right.map(label => ({ label, href: `#${label.toLowerCase()}` }))
</script>

<template>
  <nav class="navbar">
    <div class="nav-group">
      <a v-for="item in leftItems" :key="item.label" :href="item.href" class="nav-item">
        {{ item.label }}
      </a>
    </div>

    <div class="rov-bubble">
      <ModelViewer />
    </div>

    <div class="nav-group">
      <a v-for="item in rightItems" :key="item.label" :href="item.href" class="nav-item">
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 2px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
  white-space: nowrap;
  overflow: visible;
}

.nav-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-item {
  padding: 7px 18px;
  border-radius: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #0d2b5e;
  text-decoration: none;
  transition: background 0.15s, color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.nav-item:hover {
  background: #38bdf8;
  color: #0d2b5e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.45);
}

.rov-bubble {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1.5px solid rgba(13, 43, 94, 0.25);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: -18px 6px;
  box-shadow: 0 4px 20px rgba(13, 43, 94, 0.15);
}
</style>
