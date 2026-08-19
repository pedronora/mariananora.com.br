<script setup lang="ts">
import type { LeadWithId, LeadsPage } from '#shared/utils/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const adminFetch = useAdminFetch()

const ASSUNTOS: Record<string, string> = {
  agendamento: 'Agendamento de consulta',
  psicoterapia: 'Psicoterapia',
  avaliacao: 'Avaliação Neuropsicológica',
  orientacao: 'Orientação Profissional',
  outro: 'Outro assunto',
}

const leads = ref<LeadWithId[] | null>(null)
const nextAfter = ref<string | null>(null)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref('')
const selected = ref<LeadWithId | null>(null)
const query = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function load(reset = false, q = query.value.trim()) {
  error.value = ''
  if (reset) {
    loading.value = true
  } else {
    loadingMore.value = true
  }
  try {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (!reset && nextAfter.value) params.set('after', nextAfter.value)
    const qs = params.toString()
    const page: LeadsPage = await adminFetch(`/api/admin/leads${qs ? `?${qs}` : ''}`)
    leads.value = reset ? page.leads : [...(leads.value ?? []), ...page.leads]
    nextAfter.value = page.nextAfter
  } catch {
    error.value = 'Não foi possível carregar as mensagens.'
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

onMounted(() => {
  load(true)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
  }
  document.addEventListener('keydown', onKey)
  onUnmounted(() => document.removeEventListener('keydown', onKey))
})

function clearSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  query.value = ''
  load(true, '')
}

if (import.meta.client) {
  watch(query, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => load(true, val.trim()), 300)
  })
}

function assuntoLabel(assunto: string) {
  return ASSUNTOS[assunto] ?? assunto
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function openMessage(lead: LeadWithId) {
  selected.value = lead
}

function closeModal() {
  selected.value = null
}
</script>

<template>
  <div>
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold">Mensagens</h1>
        <p class="text-sm text-brand-500">Mensagens recebidas pelo formulário de contato.</p>
      </div>
      <div class="relative w-full sm:w-72">
        <AppIcon
          name="search"
          class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-brand-400"
        />
        <input
          v-model="query"
          type="text"
          placeholder="Buscar mensagens..."
          aria-label="Buscar mensagens"
          class="input-field w-full pl-9 pr-9"
        />
        <button
          v-if="query"
          type="button"
          class="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-brand-400 hover:bg-brand-100 hover:text-brand-700"
          aria-label="Limpar busca"
          @click="clearSearch"
        >
          <AppIcon name="close" class="size-3" />
        </button>
      </div>
    </div>

    <p v-if="error" class="text-brand-600">{{ error }}</p>
    <p v-else-if="loading" class="py-8 text-center text-brand-500">Carregando...</p>
    <template v-else>
      <div class="overflow-hidden rounded-2xl border border-brand-200 bg-white">
        <div
          class="hidden grid-cols-[110px_1.4fr_1.2fr_2fr] gap-4 border-b border-brand-100 bg-brand-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-400 sm:grid"
        >
          <span>Data</span>
          <span>Remetente</span>
          <span>Assunto</span>
          <span>Mensagem</span>
        </div>
        <ul class="divide-y divide-brand-100">
          <li
            v-for="lead in leads"
            :key="lead.id"
            class="cursor-pointer px-4 py-3 transition-colors hover:bg-accent-50/50"
            @click="openMessage(lead)"
          >
            <div class="grid gap-1 sm:grid-cols-[110px_1.4fr_1.2fr_2fr] sm:items-center sm:gap-4">
              <p class="text-xs text-brand-500">{{ formatDate(lead.criadoEm) }}</p>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-brand-900">{{ lead.nome }}</p>
                <p class="truncate text-xs text-brand-400">{{ lead.email }}</p>
              </div>
              <p class="truncate text-sm text-brand-700">{{ assuntoLabel(lead.assunto) }}</p>
              <p class="truncate text-sm text-brand-500">{{ lead.mensagem }}</p>
            </div>
          </li>
        </ul>
        <p v-if="leads?.length === 0" class="p-8 text-center text-sm text-brand-500">
          {{
            query.trim() ? `Nenhuma mensagem encontrada para "${query.trim()}".` : 'Nenhuma mensagem recebida ainda.'
          }}
        </p>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          v-if="nextAfter"
          type="button"
          class="btn-primary w-full sm:w-auto"
          :disabled="loadingMore"
          @click="load(false)"
        >
          <AppIcon v-if="loadingMore" name="clock" class="size-5 animate-spin" />
          {{ loadingMore ? 'Carregando...' : 'Carregar mais 10' }}
        </button>
      </div>
    </template>

    <div
      v-if="selected"
      class="fixed inset-0 z-50 flex items-end justify-center bg-brand-950/50 p-4 sm:items-center"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mensagem"
      >
        <div class="flex items-start justify-between gap-4 border-b border-brand-100 p-5">
          <div class="min-w-0">
            <p class="text-lg font-bold text-brand-900">{{ selected.nome }}</p>
            <p class="text-xs text-brand-500">
              {{ selected.email }}<span v-if="selected.telefone"> · {{ selected.telefone }}</span>
            </p>
          </div>
          <button
            type="button"
            class="grid size-8 shrink-0 place-items-center rounded-full text-brand-400 hover:bg-brand-100 hover:text-brand-700"
            aria-label="Fechar"
            @click="closeModal"
          >
            <AppIcon name="close" class="size-4" />
          </button>
        </div>
        <div class="space-y-4 p-5">
          <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-500">
            <p><span class="font-medium text-brand-700">Assunto:</span> {{ assuntoLabel(selected.assunto) }}</p>
            <p><span class="font-medium text-brand-700">Data:</span> {{ formatDate(selected.criadoEm) }}</p>
          </div>
          <p class="whitespace-pre-wrap text-sm leading-relaxed text-brand-800">{{ selected.mensagem }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
