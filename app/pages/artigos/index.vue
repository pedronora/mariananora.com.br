<script setup lang="ts">
definePageMeta({ title: 'Artigos' })

useSeoMeta({
  title: 'Artigos — Mariana Nora',
  description:
    'Artigos e textos da psicóloga Mariana Nora sobre psicoterapia, avaliação neuropsicológica e orientação profissional.',
})

const { data: artigos, error } = await useFetch('/api/artigos')
</script>

<template>
  <div class="container-site py-16 sm:py-20">
    <div class="mb-12 max-w-2xl">
      <h1 class="text-3xl font-bold sm:text-4xl">Artigos</h1>
      <p class="mt-3 text-brand-600">Textos e reflexões sobre saúde mental, psicoterapia e desenvolvimento pessoal.</p>
    </div>

    <p v-if="error" class="text-brand-600">Não foi possível carregar os artigos. Tente novamente mais tarde.</p>
    <p v-else-if="artigos?.length === 0" class="text-brand-600">Nenhum artigo publicado ainda. Volte em breve!</p>
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
