<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import modelUrl from '../assets/baymax-final.glb'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let cleanup = () => {}

onMounted(() => {
  const canvas = canvasRef.value!
  const SIZE = 64

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(SIZE, SIZE)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)

  scene.add(new THREE.AmbientLight(0xffffff, 2))
  const dir = new THREE.DirectionalLight(0xffffff, 2)
  dir.position.set(1, 2, 3)
  scene.add(dir)

  let model: THREE.Object3D | null = null
  let maxDim = 1

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(modelUrl, (gltf) => {
    model = gltf.scene

    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    maxDim = Math.max(size.x, size.y, size.z)

    model.position.sub(center)
    camera.position.set(0, 0, maxDim * 1.6)
    camera.near = maxDim * 0.01
    camera.far = maxDim * 10
    camera.updateProjectionMatrix()

    // recolor red accent parts (thrusters/grippers) to Triton blue
    const tritonBlue = new THREE.MeshStandardMaterial({ color: 0x1a56db, metalness: 0.45, roughness: 0.4 })
    const redMats = new Set(['candyappleredcarpainthq', 'redsofttouchplastic', 'redlowglossplastic'])
    model.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((mat, i) => {
        if (redMats.has((mat as THREE.Material).name)) {
          if (Array.isArray(mesh.material)) mesh.material[i] = tritonBlue
          else mesh.material = tritonBlue
        }
      })
    })

    scene.add(model)
  }, undefined, (err) => {
    console.error('[ModelViewer] failed to load GLB:', err)
  })

  let targetRotX = 0, targetRotY = 0
  let currentRotX = 0, currentRotY = 0

  let canvasRect = canvas.getBoundingClientRect()
  function onResize() { canvasRect = canvas.getBoundingClientRect() }
  window.addEventListener('resize', onResize)

  function onMouseMove(e: MouseEvent) {
    const cx = canvasRect.left + canvasRect.width / 2
    const cy = canvasRect.top + canvasRect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    targetRotY = -Math.atan2(-dx, 400)
    targetRotX = Math.atan2(dy, 400)
  }
  window.addEventListener('mousemove', onMouseMove)

  let lastFrameTime = performance.now()
  let rafId: number
  function animate(now: number) {
    rafId = requestAnimationFrame(animate)
    const dt = Math.min(now - lastFrameTime, 100)
    lastFrameTime = now
    const f = 1 - Math.pow(0.1, dt / 16.67)
    currentRotX += (targetRotX - currentRotX) * f
    currentRotY += (targetRotY - currentRotY) * f
    if (model) {
      model.rotation.x = currentRotX
      model.rotation.y = currentRotY
    }
    renderer.render(scene, camera)
  }
  rafId = requestAnimationFrame(animate)

  cleanup = () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.geometry.dispose()
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => m.dispose())
      }
    })
    renderer.dispose()
  }
})

onUnmounted(() => cleanup())
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  display: block;
  width: 64px;
  height: 64px;
}
</style>
