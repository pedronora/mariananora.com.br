<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt/runtime'

const route = useRoute()

useHead({
  title: () =>
    route.meta.title ? `${route.meta.title} — Mariana Nora` : 'Psicóloga Mariana Nora — Psicoterapia em Florianópolis',
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <WhatsAppButton />
    <Analytics />
  </div>
</template>
