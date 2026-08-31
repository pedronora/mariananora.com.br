import { inject, type BeforeSendEvent } from '@vercel/analytics'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  inject({
    framework: 'nuxt',
    beforeSend: (event: BeforeSendEvent) => {
      if (event.url.includes('/admin')) {
        return null
      }
      return event
    },
  })
})
