import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'

const user = ref<User | null>(null)
const loading = ref(true)
const token = ref('')
let initialized = false

export function useAuth() {
  if (import.meta.client) {
    if (!initialized) {
      initialized = true
      const auth = getAuth(useNuxtApp().$firebaseApp)
      onAuthStateChanged(auth, (u) => {
        user.value = u
        loading.value = false
      })
      watch(
        user,
        async (u) => {
          if (!u) {
            token.value = ''
            return
          }
          try {
            token.value = await u.getIdToken()
          } catch {
            token.value = ''
          }
        },
        { immediate: true },
      )
    }

    const auth = getAuth(useNuxtApp().$firebaseApp)
    const login = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    }
    const logout = async () => {
      token.value = ''
      await signOut(auth)
    }
    const requestPasswordReset = async (email: string) => {
      await $fetch('/api/auth/recuperar-senha', { method: 'POST', body: { email } })
    }
    const resetPassword = async (resetToken: string, password: string) => {
      await $fetch('/api/auth/redefinir-senha', { method: 'POST', body: { token: resetToken, password } })
    }

    return {
      user,
      loading,
      token,
      login,
      logout,
      requestPasswordReset,
      resetPassword,
    }
  }

  return {
    user,
    loading,
    token,
    login: async () => {},
    logout: async () => {},
    requestPasswordReset: async () => {},
    resetPassword: async () => {},
  }
}
