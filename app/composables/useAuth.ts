import {
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type User,
} from 'firebase/auth'

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
    /**
     * Reautentica com a senha atual antes de trocar a senha: o Firebase exige
     * login recente e, sem isso, `updatePassword` falha com `auth/requires-recent-login`.
     */
    const changePassword = async (currentPassword: string, newPassword: string) => {
      const current = auth.currentUser
      if (!current?.email) {
        throw new Error('Sessão inválida. Entre novamente.')
      }
      const credential = EmailAuthProvider.credential(current.email, currentPassword)
      await reauthenticateWithCredential(current, credential)
      await updatePassword(current, newPassword)
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
      changePassword,
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
    changePassword: async () => {},
    requestPasswordReset: async () => {},
    resetPassword: async () => {},
  }
}
