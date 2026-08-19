<script setup lang="ts">
import { site } from '#shared/utils/site'
const route = useRoute()
const slug = route.params.slug as string

const { data: artigo } = await useFetch(`/api/artigos/${slug}`)

if (!artigo.value) {
  throw createError({ statusCode: 404, message: 'Artigo não encontrado.' })
}

const html = computed(() => artigo.value?.conteudo ?? '')

useSeoMeta({
  title: () => (artigo.value ? `${artigo.value.titulo} — Mariana Nora` : 'Artigo'),
  description: () => artigo.value?.resumo ?? '',
  ogType: 'article',
  ogUrl: () => `${site.domain}/artigos/${slug}`,
  ogImage: () => artigo.value?.capa || undefined,
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <article class="container-site py-16 sm:py-20">
    <nav class="mb-6 text-sm text-brand-500" aria-label="Breadcrumb">
      <NuxtLink to="/artigos" class="hover:text-accent-700">Artigos</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-brand-800">{{ artigo.titulo }}</span>
    </nav>

    <header class="mx-auto max-w-3xl">
      <p v-if="artigo.criadoEm" class="text-sm font-medium uppercase tracking-wide text-accent-600">
        {{ formatDate(artigo.criadoEm) }}
      </p>
      <h1 class="mt-3 text-3xl font-bold sm:text-4xl">{{ artigo.titulo }}</h1>
      <p class="mt-4 text-lg text-brand-600">{{ artigo.resumo }}</p>
    </header>

    <div v-if="artigo.capa" class="mx-auto mt-8 max-w-3xl">
      <NuxtImg :src="artigo.capa" :alt="artigo.titulo" class="aspect-[16/9] w-full rounded-3xl object-cover" />
    </div>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prose-site mx-auto mt-10 max-w-3xl" v-html="html"></div>

    <div class="mx-auto mt-12 max-w-3xl border-t border-brand-200 pt-8">
      <NuxtLink to="/contato" class="btn-primary">Agendar consulta</NuxtLink>
    </div>
  </article>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.prose-site :deep(h2) {
  @apply mt-8 mb-3 text-2xl font-bold text-brand-900;
}
.prose-site :deep(h3) {
  @apply mt-6 mb-2 text-xl font-bold text-brand-900;
}
.prose-site :deep(p) {
  @apply mb-4 leading-relaxed text-brand-700;
}
.prose-site :deep(ul),
.prose-site :deep(ol) {
  @apply mb-4 space-y-1 pl-5 text-brand-700;
}
.prose-site :deep(ul) {
  @apply list-disc;
}
.prose-site :deep(ol) {
  @apply list-decimal;
}
.prose-site :deep(blockquote) {
  @apply border-l-4 border-accent-500 pl-4 italic text-brand-600;
}
.prose-site :deep(a) {
  @apply text-accent-600 underline hover:text-accent-700;
}
.prose-site :deep(strong) {
  @apply font-semibold text-brand-900;
}
.prose-site :deep(img) {
  @apply my-6 h-auto max-w-full rounded-2xl;
}
.prose-site :deep(hr) {
  @apply my-6 border-brand-200;
}
.prose-site :deep(code) {
  @apply rounded bg-brand-100 px-1 py-0.5 font-mono text-sm;
}
.prose-site :deep(pre) {
  @apply mb-4 overflow-x-auto rounded-xl bg-brand-100 p-4 font-mono text-sm;
}
</style>
