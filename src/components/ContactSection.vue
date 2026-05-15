<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { contact } from '@/content/index'
import logoUrl from '@/assets/triton-logo-2026.png'

const sectionRef = ref<HTMLElement>()
const bodyRef    = ref<HTMLElement>()

onMounted(() => {
  gsap.set(bodyRef.value!, { opacity: 0, y: 16, filter: 'blur(10px)' })
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        gsap.to(bodyRef.value!, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' })
        observer.disconnect()
      }
    },
    { threshold: 0.05 }
  )
  observer.observe(sectionRef.value!)
})
</script>

<template>
  <section ref="sectionRef" class="contact-section">
    <div ref="bodyRef">

      <!-- Contact row -->
      <div class="contact-body">
        <h2 class="contact-title">Contact Us</h2>

        <div class="contact-item">
          <!-- envelope -->
          <svg class="ci" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <polyline points="2,4 12,13 22,4"/>
          </svg>
          <a href="mailto:triton.rov1@gmail.com" class="contact-email">triton.rov1@gmail.com</a>
        </div>

        <div class="contact-item">
          <!-- pin -->
          <svg class="ci" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span class="contact-address">{{ contact.address }}</span>
        </div>
      </div>

      <!-- Footer bar -->
      <div class="footer-bar">
        <div class="footer-left">
          <img :src="logoUrl" alt="Triton" class="footer-logo" />
          <span class="footer-copy">© 2026 | Triton</span>
        </div>

        <div class="footer-right">
          <a
            v-for="social in contact.socials"
            :key="social.name"
            :href="social.url"
            :aria-label="social.name"
            target="_blank"
            rel="noopener"
            class="social-link"
          >
            <svg v-if="social.name === 'Facebook'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <svg v-if="social.name === 'Instagram'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <svg v-if="social.name === 'LinkedIn'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.contact-section {
  width: 100vw;
  background: #192455;
  padding: 2.5vh 1.5vw 0;
}

/* ─── Contact row ───────────────────────────────────── */
.contact-body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-bottom: 2vh;
  gap: 1vw;
}

.contact-item {
  min-width: 0;
}

.contact-item:last-child {
  justify-self: end;
}

.contact-title {
  font-family: 'Dx Wideground', sans-serif;
  font-size: clamp(16px, 1.8vw, 28px);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: #0F9CD8;
  text-transform: uppercase;
  line-height: 1;
  margin: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.ci {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  color: #0F9CD8;
}

.contact-email {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: 500;
  color: rgba(254, 254, 254, 0.52);
  text-decoration: none;
  transition: color 0.2s ease;
}
.contact-email:hover { color: #0F9CD8; }

.contact-address {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: 400;
  color: rgba(254, 254, 254, 0.52);
  line-height: 1.55;
  text-align: right;
}

/* ─── Footer bar ────────────────────────────────────── */
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4vh 0 1.8vh;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  height: 24px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.75;
}

.footer-copy {
  font-family: 'Plus Jakarta Sans Variable', sans-serif;
  font-size: clamp(10px, 0.75vw, 12px);
  color: rgba(254, 254, 254, 0.3);
  letter-spacing: 0.05em;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.social-link {
  color: #0F9CD8;
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.social-link:hover { opacity: 0.7; transform: translateY(-2px); }
.social-link svg { width: 100%; height: 100%; }
</style>
