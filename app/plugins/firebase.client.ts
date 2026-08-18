import { getApps, getApp, initializeApp, type FirebaseApp } from 'firebase/app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.firebase
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config)

  return {
    provide: {
      firebaseApp: app,
    },
  }
})
