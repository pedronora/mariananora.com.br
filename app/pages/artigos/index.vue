<script setup lang="ts">
import type { Article } from '#shared/utils/types'
import { site } from '#shared/utils/site'

definePageMeta({ title: 'Artigos' })

useSeoMeta({
  title: 'Artigos — Mariana Nora',
  description:
    'Artigos e textos da psicóloga Mariana Nora sobre psicoterapia, avaliação neuropsicológica e orientação profissional.',
  ogTitle: 'Artigos — Mariana Nora',
  ogDescription:
    'Artigos e textos da psicóloga Mariana Nora sobre psicoterapia, avaliação neuropsicológica e orientação profissional.',
  ogUrl: `${site.domain}/artigos`,
})

type ArticleSummary = Pick<
  Article,
  'id' | 'slug' | 'titulo' | 'resumo' | 'capa' | 'autor' | 'criadoEm' | 'atualizadoEm'
>

const { data: initial, error } = await useFetch<ArticleSummary[]>('/api/artigos')

const artigos = ref<ArticleSummary[]>(initial.value ?? [])
const query = ref('')
const searching = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function runSearch() {
  searching.value = true
  try {
    const result = await $fetch<ArticleSummary[]>('/api/artigos', {
      params: { q: query.value.trim() },
    })
    artigos.value = result
  } catch {
    artigos.value = []
  } finally {
    searching.value = false
  }
}

function clearSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  query.value = ''
  artigos.value = initial.value ?? []
}

if (import.meta.client) {
  watch(query, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!val.trim()) {
      artigos.value = initial.value ?? []
      return
    }
    debounceTimer = setTimeout(runSearch, 300)
  })
}
</script>

<template>
  <div class="container-site py-16 sm:py-20">
    <div class="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="max-w-2xl">
        <h1 class="text-3xl font-bold sm:text-4xl">Artigos</h1>
        <p class="mt-3 text-brand-600">
          Textos e reflexões sobre saúde mental, psicoterapia e desenvolvimento pessoal.
        </p>
      </div>

      <div class="relative w-full md:w-96">
        <AppIcon
          name="search"
          class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-brand-400"
        />
        <input
          v-model="query"
          type="text"
          enterkeyhint="search"
          placeholder="Buscar artigos..."
          aria-label="Buscar artigos"
          class="input-field w-full pl-9 pr-10"
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

    <p v-if="error" class="text-brand-600">Não foi possível carregar os artigos. Tente novamente mais tarde.</p>
    <p v-else-if="searching" class="text-brand-500">Buscando...</p>
    <p v-else-if="artigos.length === 0" class="text-brand-600">
      {{ query.trim() ? `Nenhum resultado para "${query.trim()}".` : 'Nenhum artigo publicado ainda. Volte em breve!' }}
    </p>
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleCard
        v-for="a in artigos"
        :key="a.id"
        :slug="a.slug"
        :titulo="a.titulo"
        :resumo="a.resumo"
        :capa="a.capa"
        :autor="a.autor"
        :criado-em="a.criadoEm"
      />
    </div>
  </div>
</template>
