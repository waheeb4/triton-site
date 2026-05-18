<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps<{ loaded: boolean }>()
const emit = defineEmits<{ done: [] }>()

const bgRef      = ref<HTMLElement>()
const ring1Ref   = ref<HTMLElement>()
const ring23Ref  = ref<HTMLElement>()

watch(() => props.loaded, (ready) => {
  if (!ready || !bgRef.value || !ring1Ref.value || !ring23Ref.value) return
  gsap.to([bgRef.value, ring1Ref.value, ring23Ref.value], {
    opacity: 0,
    duration: 0.9,
    ease: 'power2.inOut',
    onComplete: () => emit('done'),
  })
})
</script>

<template>
  <Teleport to="body">
    <div ref="bgRef"     class="splash-bg" />       <!-- z-9997: background -->
    <div ref="ring1Ref"  class="splash-ring r1">    <!-- z-9998: big blue arc, BEHIND logo -->
      <div class="wave-ring wave-ring--1" />
    </div>
                                                    <!-- logo lives at z-9999 in App.vue -->
    <div ref="ring23Ref" class="splash-ring r23">   <!-- z-10000: dark navy + inner blue, IN FRONT of logo -->
      <div class="wave-ring wave-ring--2" />
      <div class="wave-ring wave-ring--3" />
    </div>
  </Teleport>
</template>

<style scoped>
.splash-bg {
  position: fixed;
  inset: 0;
  z-index: 9996;
  background-color: #eef2ff;
  background-image:
    radial-gradient(ellipse 70% 55% at 15% 25%, rgba(147, 197, 253, 0.75) 0%, transparent 65%),
    radial-gradient(ellipse 55% 65% at 85% 15%, rgba(196, 181, 253, 0.65) 0%, transparent 65%),
    radial-gradient(ellipse 60% 45% at 55% 85%, rgba(110, 231, 183, 0.45) 0%, transparent 65%),
    radial-gradient(ellipse 45% 55% at 75% 55%, rgba(147, 197, 253, 0.4) 0%, transparent 60%),
    radial-gradient(ellipse 80% 40% at 30% 75%, rgba(255, 255, 255, 0.9) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 40%, rgba(224, 231, 255, 0.6) 0%, transparent 70%);
  overflow: hidden;
  pointer-events: none;
}

.splash-ring {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.r1  { z-index: 9998; }   /* behind logo (9999) */
.r23 { z-index: 10000; }  /* in front of logo (9999) */

.wave-ring {
  position: absolute;
  border-radius: 42%;
}

.wave-ring--1 {
  width: 140vw;
  height: 140vw;
  bottom: -108vw;
  left: -20vw;
  background: rgba(15, 156, 216, 0.5);
  animation: waveRotate 10s linear infinite;
}

.wave-ring--2 {
  width: 125vw;
  height: 125vw;
  bottom: -98vw;
  left: -12.5vw;
  background: rgba(25, 36, 85, 0.45);
  animation: waveRotate 15s linear infinite reverse;
}

.wave-ring--3 {
  width: 110vw;
  height: 110vw;
  bottom: -88vw;
  left: -5vw;
  background: rgba(58, 184, 232, 0.4);
  animation: waveRotate 20s linear infinite;
}

@keyframes waveRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
