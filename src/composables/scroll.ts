import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollRotation(speed = 0.15, factor = 0.1) {
  const rotation = ref(0)
  let target = 0
  let rafId: number

  function loop() {
    rotation.value += (target - rotation.value) * factor
    rafId = requestAnimationFrame(loop)
  }

  function onScroll() {
    target = window.scrollY * speed
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(rafId)
  })

  return { rotation }
}
