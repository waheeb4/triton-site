<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let rafId = 0
let t = 0
let W = 0
let H = 0

interface FoamP { baseX: number; baseY: number; rx: number; ry: number; sx: number; sy: number; ox: number; oy: number; size: number }
let foamPs: FoamP[] = []

function initParticles() {
  foamPs = Array.from({ length: 320 }, () => ({
    baseX: Math.random() * W,
    baseY: Math.random() * H,
    rx: 8 + Math.random() * 18,
    ry: 6 + Math.random() * 14,
    sx: 0.5 + Math.random() * 0.8,
    sy: 0.4 + Math.random() * 0.7,
    ox: Math.random() * Math.PI * 2,
    oy: Math.random() * Math.PI * 2,
    size: 0.6 + Math.random() * 1.4,
  }))
}

function draw(ctx: CanvasRenderingContext2D) {
  for (const p of foamPs) {
    const x = p.baseX + p.rx * Math.sin(t * p.sx + p.ox)
    const y = p.baseY + p.ry * Math.cos(t * p.sy + p.oy)
    const flicker = 0.5 + 0.5 * Math.sin(t * 3.1 + p.ox * 7)
    const alpha = 0.25 + flicker * 0.45

    ctx.beginPath()
    ctx.arc(x, y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(100,160,240,${alpha})`
    ctx.fill()
  }
}

let last = 0
function loop(now: number) {
  t += (now - last) * 0.001
  last = now
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)
    draw(ctx)
  }
  rafId = requestAnimationFrame(loop)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  W = canvas.width = canvas.offsetWidth
  H = canvas.height = canvas.offsetHeight
  initParticles()
}

onMounted(() => {
  resize()
  last = performance.now()
  rafId = requestAnimationFrame(loop)
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div class="wave-wrap">
    <canvas ref="canvasRef" class="wave-canvas" />
  </div>
</template>

<style scoped>
.wave-wrap {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.wave-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
