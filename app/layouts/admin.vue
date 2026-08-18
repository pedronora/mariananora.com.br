<script setup lang="ts">
const { user, loading, logout } = useAuth()
const route = useRoute()
const router = useRouter()

watchEffect(() => {
  if (import.meta.client && !loading.value) {
    if (!user.value && route.path !== '/admin/login') {
      router.push('/admin/login')
    } else if (user.value && route.path === '/admin/login') {
      router.push('/admin')
    }
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-50">
    <header class="sticky top-0 z-40 border-b border-brand-200 bg-white">
      <div class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <NuxtLink to="/admin" class="font-semibold text-brand-900">Área administrativa</NuxtLink>
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="text-sm text-brand-500 hover:text-accent-700">Ver site</NuxtLink>
          <button
            v-if="user"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-brand-600 hover:bg-brand-100"
            @click="logout"
          >
            <AppIcon name="logout" class="size-4" /> Sair
          </button>
        </div>
      </div>
    </header>
    <nav class="border-b border-brand-200 bg-white">
      <div class="mx-auto flex w-full max-w-6xl items-center gap-1 px-4 sm:px-6">
        <NuxtLink
          to="/admin"
          class="px-3 py-3 text-sm font-medium text-brand-500 transition-colors hover:text-accent-700"
          :class="{ 'border-b-2 border-accent-600 !text-brand-900': route.path === '/admin' }"
        >
          Artigos
        </NuxtLink>
        <NuxtLink
          to="/admin/leads"
          class="px-3 py-3 text-sm font-medium text-brand-500 transition-colors hover:text-accent-700"
          :class="{ 'border-b-2 border-accent-600 !text-brand-900': route.path.startsWith('/admin/leads') }"
        >
          Mensagens
        </NuxtLink>
      </div>
    </nav>
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <slot />
    </main>
  </div>
</template>
