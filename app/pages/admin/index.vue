<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const adminFetch = useAdminFetch()

const artigos = ref<{ id: string; titulo: string; status: string; atualizadoEm: string }[] | null>(null)
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    artigos.value = await adminFetch('/api/admin/artigos')
  } catch {
    error.value = 'Não foi possível carregar os artigos.'
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function remove(id: string) {
  if (!confirm('Excluir este artigo? Esta ação não pode ser desfeita.')) return
  await adminFetch(`/api/admin/artigos/${id}`, { method: 'DELETE' })
  await load()
}

function statusLabel(status: string) {
  return status === 'publicado' ? 'Publicado' : 'Rascunho'
}
</script>

<template>
  <div>
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold">Artigos</h1>
        <p class="text-sm text-brand-500">Gerencie as publicações do site.</p>
      </div>
      <NuxtLink to="/admin/editor" class="btn-primary"><AppIcon name="plus" class="size-4" /> Novo artigo</NuxtLink>
    </div>

    <p v-if="error" class="text-brand-600">Não foi possível carregar os artigos.</p>
    <p v-else-if="loading" class="py-8 text-center text-brand-500">Carregando...</p>
    <div v-else class="overflow-hidden rounded-2xl border border-brand-200 bg-white">
      <ul class="divide-y divide-brand-100">
        <li
          v-for="a in artigos"
          :key="a.id"
          class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0">
            <p class="truncate font-semibold text-brand-900">{{ a.titulo }}</p>
            <p class="text-xs text-brand-500">
              <span :class="a.status === 'publicado' ? 'text-accent-600' : 'text-brand-400'">{{
                statusLabel(a.status)
              }}</span>
              <span class="mx-2">·</span>
              {{ new Date(a.atualizadoEm).toLocaleDateString('pt-BR') }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <NuxtLink
              :to="`/admin/editor/${a.id}`"
              class="inline-flex items-center gap-1.5 rounded-full border border-brand-200 px-4 py-2 text-sm text-brand-700 hover:bg-brand-100"
            >
              <AppIcon name="edit" class="size-4" /> Editar
            </NuxtLink>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              @click="remove(a.id)"
            >
              <AppIcon name="trash" class="size-4" /> Excluir
            </button>
          </div>
        </li>
      </ul>
      <p v-if="artigos?.length === 0" class="p-8 text-center text-sm text-brand-500">
        Nenhum artigo ainda. Crie o primeiro!
      </p>
    </div>
  </div>
</template>
