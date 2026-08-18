<script setup lang="ts">
definePageMeta({ title: 'Especialidades' })

useSeoMeta({
  title: 'Especialidades — Mariana Nora',
  description:
    'Orientação profissional, avaliação neuropsicológica e psicoterapia presencial e online em Florianópolis.',
})
</script>

<template>
  <div class="container-site py-16 sm:py-20">
    <div class="mb-12 max-w-2xl">
      <h1 class="text-3xl font-bold sm:text-4xl">Especialidades</h1>
      <p class="mt-3 text-brand-600">Conheça as áreas de atuação e encontre o cuidado certo para o seu momento.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="(esp, i) in especialidades"
        :key="esp.slug"
        :to="`/especialidades/${esp.slug}`"
        class="group flex flex-col overflow-hidden rounded-2xl border border-brand-200 bg-white transition-shadow hover:shadow-lg"
      >
        <div class="h-44 overflow-hidden">
          <NuxtImg
            :src="`/img/especialidade-${['orientacao', 'avaliacao', 'psicoterapia'][i]}.jpg`"
            :alt="esp.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div class="flex flex-1 flex-col p-6">
          <h2 class="text-xl font-semibold">{{ esp.title }}</h2>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-brand-600">{{ esp.short }}</p>
          <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
            Saiba mais <AppIcon name="arrowRight" class="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
