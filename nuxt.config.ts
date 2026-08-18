// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxt/eslint'],
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
        apiKey: 'AIzaSyC_SBeM5Sfw_1PeWwWi_P1ND95YHuwIrxY',
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
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
      ],
    },
  },
})
