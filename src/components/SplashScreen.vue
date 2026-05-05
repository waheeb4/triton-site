<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps<{ loaded: boolean }>()
const emit = defineEmits<{ done: [] }>()

const bgRef = ref<HTMLElement>()

watch(() => props.loaded, (ready) => {
  if (!ready || !bgRef.value) return
  gsap.to(bgRef.value, {
    opacity: 0,
    duration: 0.9,
    ease: 'power2.inOut',
    onComplete: () => emit('done'),
  })
})
</script>

<template>
  <Teleport to="body">
    <div ref="bgRef" class="splash-bg">
      <div class="wave-ring wave-ring--1" />
      <div class="wave-ring wave-ring--2" />
      <div class="wave-ring wave-ring--3" />
    </div>
  </Teleport>
</template>

<style scoped>
.splash-bg {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #06122b;
  overflow: hidden;
}

.wave-ring {
  position: absolute;
  border-radius: 42%;
  pointer-events: none;
}

.wave-ring--1 {
  width: 140vw;
  height: 140vw;
  bottom: -108vw;
  left: -20vw;
  background: rgba(26, 86, 219, 0.22);
  animation: waveRotate 10s linear infinite;
}

.wave-ring--2 {
  width: 125vw;
  height: 125vw;
  bottom: -98vw;
  left: -12.5vw;
  background: rgba(14, 165, 233, 0.16);
  animation: waveRotate 15s linear infinite reverse;
}

.wave-ring--3 {
  width: 110vw;
  height: 110vw;
  bottom: -88vw;
  left: -5vw;
  background: rgba(99, 102, 241, 0.12);
  animation: waveRotate 20s linear infinite;
}

@keyframes waveRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
