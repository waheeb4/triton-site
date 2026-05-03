<script setup lang="ts">

import { useScrollRotation } from '../composables/scroll'
import GearImg from '../assets/gear.png'
import LogoImg from '../assets/logo.png'

const { rotation } = useScrollRotation(0.15)
</script>

<template>
  <div class="logo-wrapper">
    <img :src="GearImg" class="gear" :style="{ transform: `rotate(${rotation}deg)` }" alt="Gear logo"/>
    <img :src="LogoImg" class="logo" alt="Triton logo" />
  </div>
</template>

<style scoped>
.logo-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.gear {
  position: relative;
  height: 48px;
  width: auto;
  z-index: 0;
}

.logo {
  position: relative;
  height: 48px;
  width: auto;
  z-index: 1;
  margin-top: -39.5px;
  margin-right: -1px;
}
</style>
