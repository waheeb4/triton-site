/// <reference types="vite/client" />

declare module '*.glb' {
  const url: string
  export default url
}

declare module '*ParticlesSwarm.js' {
  export class ParticlesSwarm {
    renderer: import('three').WebGLRenderer
    camera: import('three').PerspectiveCamera
    composer: { setSize(w: number, h: number): void; render(): void }
    constructor(container: HTMLElement, count?: number): void
    dispose(): void
  }
}
