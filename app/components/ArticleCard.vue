<script setup lang="ts">
defineProps<{
  slug: string
  titulo: string
  resumo: string
  capa?: string
  autor?: string
  criadoEm?: string
}>()

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <NuxtLink
    :to="`/artigos/${slug}`"
    class="group flex flex-col overflow-hidden rounded-2xl border border-brand-200 bg-white transition-shadow hover:shadow-lg"
  >
    <div class="aspect-[16/9] overflow-hidden bg-brand-100">
      <NuxtImg
        v-if="capa"
        :src="capa"
        :alt="titulo"
        :fallback="'/img/retrato.jpg'"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="grid h-full place-items-center text-brand-300">
        <AppIcon name="calendar" class="size-10" />
      </div>
    </div>
    <div class="flex flex-1 flex-col p-6">
      <p v-if="criadoEm" class="text-xs font-medium uppercase tracking-wide text-accent-600">
        {{ formatDate(criadoEm) }}
      </p>
      <h2 class="mt-2 text-lg font-bold leading-snug group-hover:text-accent-700">{{ titulo }}</h2>
      <p class="mt-2 flex-1 text-sm leading-relaxed text-brand-600 line-clamp-3">{{ resumo }}</p>
      <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
        Ler artigo <AppIcon name="arrowRight" class="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </NuxtLink>
</template>
