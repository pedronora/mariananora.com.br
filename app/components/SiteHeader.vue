<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre' },
  {
    to: '/especialidades',
    label: 'Especialidades',
    children: [
      { to: '/especialidades/orientacao-profissional', label: 'Orientação Profissional' },
      { to: '/especialidades/avaliacao-neuropsicologica', label: 'Avaliação Neuropsicológica' },
      { to: '/especialidades/psicoterapia', label: 'Psicoterapia' },
    ],
  },
  { to: '/artigos', label: 'Artigos' },
  { to: '/contato', label: 'Contato' },
]

const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-brand-200/60 bg-brand-50/90 backdrop-blur">
    <div class="container-site flex h-16 items-center justify-between gap-4">
      <NuxtLink to="/" class="flex items-center" aria-label="Página inicial">
        <NuxtImg src="/img/logo.png" alt="Psicóloga Mariana Nora" width="172" height="40" class="h-10 w-auto" />
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
        <template v-for="link in navLinks" :key="link.to">
          <div v-if="link.children" class="group relative">
            <NuxtLink
              :to="link.to"
              class="rounded-full px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 hover:text-brand-900"
              :class="{ 'text-accent-700': isActive(link.to) }"
            >
              {{ link.label }}
            </NuxtLink>
            <div
              class="invisible absolute left-1/2 top-full z-10 w-64 -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100"
            >
              <div class="overflow-hidden rounded-xl border border-brand-200 bg-white p-2 shadow-lg">
                <NuxtLink
                  v-for="child in link.children"
                  :key="child.to"
                  :to="child.to"
                  class="block rounded-lg px-3 py-2 text-sm text-brand-700 hover:bg-brand-100 hover:text-brand-900"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>
          </div>
          <NuxtLink
            v-else
            :to="link.to"
            class="rounded-full px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 hover:text-brand-900"
            :class="{ 'text-accent-700': isActive(link.to) }"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </nav>

      <div class="flex items-center gap-3">
        <NuxtLink to="/contato" class="btn-primary hidden sm:inline-flex"> Agendar consulta </NuxtLink>
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full bg-accent-600 text-white shadow-sm transition-colors hover:bg-accent-700 lg:hidden"
          :aria-expanded="mobileOpen"
          :aria-label="mobileOpen ? 'Fechar menu' : 'Abrir menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <AppIcon :name="mobileOpen ? 'close' : 'menu'" />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <nav
        v-if="mobileOpen"
        class="border-t border-brand-200/60 bg-brand-50 px-4 pb-6 pt-2 lg:hidden"
        aria-label="Navegação móvel"
      >
        <template v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block rounded-lg px-3 py-3 text-base font-medium text-brand-800 hover:bg-brand-100"
          >
            {{ link.label }}
          </NuxtLink>
          <template v-if="link.children">
            <NuxtLink
              v-for="child in link.children"
              :key="child.to"
              :to="child.to"
              class="block rounded-lg px-6 py-2.5 text-sm text-brand-600 hover:bg-brand-100"
            >
              — {{ child.label }}
            </NuxtLink>
          </template>
        </template>
        <NuxtLink to="/contato" class="btn-primary mt-4 w-full">Agendar consulta</NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
