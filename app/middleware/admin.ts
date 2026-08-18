export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { user, loading } = useAuth()

  if (loading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(loading, (l) => {
        if (!l) {
          stop()
          resolve()
        }
      })
    })
  }

  if (!user.value) {
    return navigateTo('/admin/login', { replace: true })
  }
})
