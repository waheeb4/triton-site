import { createApp } from 'vue'
import logoUrl from './assets/triton-logo-2026.png'
import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource-variable/plus-jakarta-sans/index.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/dm-serif-display/400-italic.css'
import './style.css'
import App from './App.vue'

// Kick off the logo image fetch before the app even mounts
const _preloadLogo = document.createElement('link')
_preloadLogo.rel = 'preload'
_preloadLogo.as = 'image'
_preloadLogo.href = logoUrl
document.head.appendChild(_preloadLogo)

createApp(App).mount('#app')
