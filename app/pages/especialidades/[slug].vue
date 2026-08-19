<script setup lang="ts">
import { site } from '#shared/utils/site'

const route = useRoute()
const slug = route.params.slug as string
const esp = especialidades.find((e) => e.slug === slug)

if (!esp) {
  throw createError({ statusCode: 404, message: 'Especialidade não encontrada.' })
}

const imageIndex = { 'orientacao-profissional': 0, 'avaliacao-neuropsicologica': 1, psicoterapia: 2 }[slug]

useSeoMeta({
  title: `${esp.title} — Mariana Nora`,
  description: esp.description,
  ogTitle: `${esp.title} — Mariana Nora`,
  ogDescription: esp.description,
  ogType: 'website',
  ogUrl: `${site.domain}/especialidades/${slug}`,
})
</script>

<template>
  <div class="container-site py-16 sm:py-20">
    <nav class="mb-6 text-sm text-brand-500" aria-label="Breadcrumb">
      <NuxtLink to="/especialidades" class="hover:text-accent-700">Especialidades</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-brand-800">{{ esp.title }}</span>
    </nav>

    <div class="grid items-start gap-10 lg:grid-cols-2">
      <div>
        <h1 class="text-3xl font-bold sm:text-4xl">{{ esp.title }}</h1>
        <p class="mt-5 leading-relaxed text-brand-700">{{ esp.description }}</p>

        <h2 class="mt-8 text-xl font-bold">Como funciona</h2>
        <ul class="mt-4 space-y-3">
          <li v-for="topic in esp.topics" :key="topic" class="flex items-start gap-3">
            <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
              ><AppIcon name="check" class="size-3.5"
            /></span>
            <span class="text-sm text-brand-700">{{ topic }}</span>
          </li>
        </ul>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <NuxtLink to="/contato" class="btn-primary">Agendar consulta</NuxtLink>
          <NuxtLink to="/sobre" class="btn-ghost">Sobre a Mariana</NuxtLink>
        </div>
      </div>
      <NuxtImg
        :src="`/img/especialidade-${['orientacao', 'avaliacao', 'psicoterapia'][imageIndex]}.jpg`"
        :alt="esp.title"
        class="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg"
      />
    </div>
  </div>
</template>
