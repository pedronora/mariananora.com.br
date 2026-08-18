<script setup lang="ts">
definePageMeta({ title: 'Contato' })

useSeoMeta({
  title: 'Contato — Mariana Nora',
  description: 'Entre em contato com a psicóloga Mariana Nora para agendar sua consulta em Florianópolis ou online.',
  ogType: 'website',
})
</script>

<template>
  <div class="container-site py-16 sm:py-20">
    <div class="mb-12 max-w-2xl">
      <h1 class="text-3xl font-bold sm:text-4xl">Contato</h1>
      <p class="mt-3 text-brand-600">Solicite o agendamento da sua consulta. Em breve retornarei o contato.</p>
    </div>

    <div class="grid gap-10 lg:grid-cols-5">
      <div class="rounded-3xl border border-brand-200 bg-white p-6 sm:p-8 lg:col-span-3">
        <h2 class="mb-6 text-xl font-bold">Envie uma mensagem</h2>
        <ContactForm />
      </div>

      <aside class="space-y-6 lg:col-span-2">
        <div class="rounded-3xl border border-brand-200 bg-white p-6 sm:p-8">
          <h2 class="mb-5 text-xl font-bold">Consultório</h2>
          <ul class="space-y-4 text-sm text-brand-700">
            <li>
              <a
                :href="site.address.mapsUrl"
                target="_blank"
                rel="noopener"
                class="flex items-start gap-3 hover:text-accent-700"
              >
                <span class="grid size-10 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
                  ><AppIcon name="mapPin"
                /></span>
                <span>
                  <span class="block font-semibold text-brand-900">{{ site.address.name }}</span>
                  {{ site.address.street }}<br />{{ site.address.district }} — {{ site.address.city }}
                </span>
              </a>
            </li>
            <li>
              <a :href="site.phoneHref" class="flex items-center gap-3 hover:text-accent-700">
                <span class="grid size-10 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
                  ><AppIcon name="phone"
                /></span>
                {{ site.phone }}
              </a>
            </li>
            <li>
              <a :href="`mailto:${site.email}`" class="flex items-center gap-3 hover:text-accent-700">
                <span class="grid size-10 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
                  ><AppIcon name="mail"
                /></span>
                {{ site.email }}
              </a>
            </li>
          </ul>
        </div>

        <div class="rounded-3xl border border-brand-200 bg-white p-6 sm:p-8">
          <h2 class="mb-5 text-xl font-bold">Horário de atendimento</h2>
          <ul class="space-y-3 text-sm text-brand-700">
            <li v-for="h in site.hours" :key="h.days" class="flex items-center gap-3">
              <span class="grid size-10 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"
                ><AppIcon name="clock"
              /></span>
              <span
                ><span class="font-semibold text-brand-900">{{ h.days }}:</span> {{ h.time }}</span
              >
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>
