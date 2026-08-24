// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxt/eslint', '@vercel/speed-insights'],
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/admin/**': {
      ssr: false,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    preset: 'vercel',
  },

  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: Number(process.env.SMTP_PORT) || 465,
    smtpSecure: process.env.SMTP_SECURE !== 'false',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    contactTo: process.env.CONTACT_TO || 'psicologia@mariananora.com.br',
    adminEmail: process.env.ADMIN_EMAIL || '',
    firebaseAdminCredential: process.env.FIREBASE_ADMIN_CREDENTIAL || '',
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: 'piscomariana.firebaseapp.com',
        projectId: 'piscomariana',
        storageBucket: 'piscomariana.firebasestorage.app',
        messagingSenderId: '994351682866',
        appId: '1:994351682866:web:1c85a08877f08468dcb32b',
        measurementId: 'G-HZRL0DDMXW',
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Psicóloga Mariana Nora — Psicoterapia em Florianópolis',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        {
          name: 'description',
          content:
            'Psicóloga Mariana Nora, CRP 12/15000. Psicoterapia presencial e online, avaliação neuropsicológica e orientação profissional em Florianópolis/SC.',
        },
        { property: 'og:site_name', content: 'Psicóloga Mariana Nora' },
        { property: 'og:locale', content: 'pt_BR' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://mariananora.com.br/' },
        {
          property: 'og:title',
          content: 'Psicóloga Mariana Nora — Psicoterapia em Florianópolis',
        },
        {
          property: 'og:description',
          content:
            'Psicóloga Mariana Nora, CRP 12/15000. Psicoterapia presencial e online, avaliação neuropsicológica e orientação profissional em Florianópolis/SC.',
        },
        { property: 'og:image', content: 'https://mariananora.com.br/img/og-default.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'Psicóloga Mariana Nora — Psicoterapia em Florianópolis',
        },
        {
          name: 'twitter:description',
          content:
            'Psicóloga Mariana Nora, CRP 12/15000. Psicoterapia presencial e online, avaliação neuropsicológica e orientação profissional em Florianópolis/SC.',
        },
        { name: 'twitter:image', content: 'https://mariananora.com.br/img/og-default.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
})
