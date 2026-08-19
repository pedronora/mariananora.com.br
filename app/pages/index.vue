<script setup lang="ts">
useSeoMeta({
  title: 'Psicóloga Mariana Nora — Psicoterapia em Florianópolis',
  description: site.description,
  ogTitle: site.name,
  ogDescription: site.description,
  ogType: 'website',
  ogUrl: site.domain,
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-brand-950 text-white">
      <div class="container-site grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div class="order-2 lg:order-1">
          <p
            class="mb-4 inline-block rounded-full border border-accent-400/40 bg-accent-900/40 px-4 py-1.5 text-sm font-medium text-accent-200"
          >
            {{ site.crp }} · Florianópolis/SC
          </p>
          <h1 class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Acolhimento e <span class="text-accent-300">cuidado</span> com a sua saúde mental
          </h1>
          <p class="mt-5 max-w-xl text-lg leading-relaxed text-brand-200">
            Psicoterapia presencial e online, avaliação neuropsicológica e orientação profissional para todas as fases
            da vida.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/contato" class="btn-primary">Agendar consulta</NuxtLink>
            <NuxtLink
              to="/sobre"
              class="btn-ghost !text-white !border-white/30 hover:!text-white hover:!border-white/60"
              >Conhecer a Mariana</NuxtLink
            >
          </div>
        </div>
        <div class="order-1 lg:order-2">
          <div class="relative mx-auto max-w-md lg:max-w-none">
            <div class="absolute -inset-4 rounded-[2rem] bg-accent-600/20 blur-2xl"></div>
            <NuxtImg
              src="/img/retrato.jpg"
              alt="Psicóloga Mariana Nora"
              class="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="container-site -mt-10 relative z-10">
      <div class="grid gap-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-lg sm:grid-cols-3">
        <div class="flex items-center gap-3">
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
            ><AppIcon name="mapPin"
          /></span>
          <div>
            <p class="text-sm font-semibold">{{ site.address.name }}</p>
            <p class="text-xs text-brand-500">{{ site.address.street }} — {{ site.address.city }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
            ><AppIcon name="phone"
          /></span>
          <div>
            <p class="text-sm font-semibold">Atendimento</p>
            <a :href="site.phoneHref" class="text-xs text-brand-500 hover:text-accent-700">{{ site.phone }}</a>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
            ><AppIcon name="clock"
          /></span>
          <div>
            <p class="text-sm font-semibold">Horário</p>
            <p class="text-xs text-brand-500">{{ site.hours[0].days }} — {{ site.hours[0].time }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container-site py-16 sm:py-24">
      <div class="mb-10 max-w-2xl">
        <h2 class="text-3xl font-bold sm:text-4xl">Especialidades</h2>
        <p class="mt-3 text-brand-600">
          Conheça as áreas de atuação da Mariana e encontre o cuidado certo para o seu momento.
        </p>
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
            <h3 class="text-xl font-semibold">{{ esp.title }}</h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-brand-600">{{ esp.short }}</p>
            <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
              Saiba mais <AppIcon name="arrowRight" class="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="bg-white py-16 sm:py-24">
      <div class="container-site grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 class="text-3xl font-bold sm:text-4xl">Mariana Macedo Nora, MsC</h2>
          <p class="mt-4 text-brand-700">
            O interesse por compreender as relações humanas e poder contribuir de alguma forma para o crescimento e
            desenvolvimento do próximo foram fatores cruciais para a minha escolha profissional.
          </p>
          <p class="mt-4 text-sm font-medium text-accent-700">{{ site.crp }}</p>
          <NuxtLink to="/sobre" class="btn-ghost mt-6">Leia mais sobre mim</NuxtLink>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="edu in site.education" :key="edu" class="rounded-2xl border border-brand-200 bg-brand-50 p-6">
            <p class="font-semibold text-brand-900">UNISUL / UFSC</p>
            <p class="mt-2 text-sm text-brand-600">{{ edu }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-accent-900 text-white">
      <div class="container-site grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div class="order-2 lg:order-1">
          <h2 class="text-3xl font-bold sm:text-4xl">Marque sua consulta</h2>
          <p class="mt-4 text-accent-100">
            Utilize o formulário de contato para solicitar o agendamento da sua consulta. Em breve retornarei o contato.
          </p>
          <NuxtLink to="/contato" class="btn-primary mt-6 !bg-white !text-accent-900 hover:!bg-accent-100"
            >Enviar mensagem</NuxtLink
          >
        </div>
        <div class="order-1 lg:order-2">
          <NuxtImg
            src="/img/agenda.jpg"
            alt="Agende sua consulta"
            class="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>

    <section class="container-site py-16 sm:py-24">
      <div class="mb-10 max-w-2xl">
        <h2 class="text-3xl font-bold sm:text-4xl">O consultório</h2>
        <p class="mt-3 text-brand-600">
          Um espaço pensado para o seu bem-estar, no Ceisa Center, Centro de Florianópolis.
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NuxtImg
          v-for="n in 3"
          :key="n"
          :src="`/img/consultorio${n}.jpg`"
          :alt="`Consultório — foto ${n}`"
          class="aspect-[5/3] w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  </div>
</template>
