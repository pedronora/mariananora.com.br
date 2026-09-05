<script setup lang="ts">
import { site } from '#shared/utils/site'

definePageMeta({ title: 'Sobre' })

useSeoMeta({
  title: 'Sobre — Mariana Nora',
  description:
    'Conheça a trajetória da psicóloga Mariana Macedo Nora, graduada pela UNISUL e mestre pela UFSC, atuante em Florianópolis.',
  ogTitle: 'Sobre — Mariana Nora',
  ogDescription:
    'Conheça a trajetória da psicóloga Mariana Macedo Nora, graduada pela UNISUL e mestre pela UFSC, atuante em Florianópolis.',
  ogType: 'website',
  ogUrl: `${site.domain}/sobre`,
})
</script>

<template>
  <div class="container-site py-16 sm:py-20">
    <div class="grid items-start gap-10 lg:grid-cols-5">
      <div class="lg:col-span-2">
        <NuxtImg
          src="/img/retrato.jpg"
          alt="Psicóloga Mariana Nora"
          class="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg"
        />
      </div>
      <div class="lg:col-span-3">
        <h1 class="text-3xl font-bold sm:text-4xl">Mariana Macedo Nora, MsC</h1>
        <p class="mt-2 text-sm font-semibold uppercase tracking-wide text-accent-600">{{ site.crp }}</p>

        <div class="mt-6 space-y-5 leading-relaxed text-brand-700">
          <p>
            O interesse por compreender as relações humanas e poder contribuir de alguma forma para o crescimento e
            desenvolvimento do próximo foram fatores cruciais para a minha escolha profissional.
          </p>
          <p>
            Psicóloga graduada pela Universidade do Sul de Santa Catarina (UNISUL), com título de mestre conferido pela
            Universidade Federal de Santa Catarina (UFSC), atuo em Florianópolis com psicoterapia nas modalidades
            presencial e online, avaliação neuropsicológica e orientação profissional.
          </p>
          <p>
            Acredito que o cuidado com a saúde mental é um processo contínuo e individual. Por isso, cada atendimento é
            planejado a partir das necessidades, do contexto e da história de cada pessoa, em um espaço de acolhimento,
            sigilo e respeito.
          </p>
        </div>

        <h2 class="mt-10 text-2xl font-bold">Formação</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="edu in site.education"
            :key="edu.institution"
            class="flex items-start gap-3 rounded-xl border border-brand-200 bg-white p-4"
          >
            <span class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
              ><AppIcon name="check" class="size-4"
            /></span>
            <span class="text-sm text-brand-700">{{ edu.degree }}</span>
          </li>
        </ul>

        <div class="mt-10 flex flex-col gap-3 sm:flex-row">
          <NuxtLink to="/especialidades" class="btn-primary">Conhecer especialidades</NuxtLink>
          <NuxtLink to="/contato" class="btn-ghost">Agendar consulta</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
