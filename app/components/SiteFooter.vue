<script setup lang="ts">
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/especialidades', label: 'Especialidades' },
  { to: '/artigos', label: 'Artigos' },
  { to: '/contato', label: 'Contato' },
]
</script>

<template>
  <footer class="border-t border-brand-200 bg-brand-950 text-brand-100">
    <div class="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p class="mb-3 text-lg font-semibold text-white">Sobre</p>
        <p class="text-sm leading-relaxed text-brand-300">
          Psicóloga graduada pela UNISUL e título de mestre conferido pela UFSC, atuante em Florianópolis.
          <span class="mt-2 block text-brand-200">{{ site.crp }}</span>
        </p>
      </div>

      <div>
        <p class="mb-3 text-lg font-semibold text-white">Navegação</p>
        <ul class="space-y-2 text-sm">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink :to="link.to" class="text-brand-300 transition-colors hover:text-white">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-3 text-lg font-semibold text-white">Consultório</p>
        <ul class="space-y-3 text-sm text-brand-300">
          <li>
            <a
              :href="site.address.mapsUrl"
              target="_blank"
              rel="noopener"
              class="flex items-start gap-2 hover:text-white"
            >
              <AppIcon name="mapPin" class="mt-0.5 shrink-0 text-accent-400" />
              <span>
                <span class="block font-medium text-brand-100">{{ site.address.name }}</span>
                {{ site.address.street }}<br />{{ site.address.district }} — {{ site.address.city }}
              </span>
            </a>
          </li>
          <li>
            <a :href="site.phoneHref" class="flex items-center gap-2 hover:text-white">
              <AppIcon name="phone" class="shrink-0 text-accent-400" /> {{ site.phone }}
            </a>
          </li>
          <li>
            <a :href="`mailto:${site.email}`" class="flex items-center gap-2 hover:text-white">
              <AppIcon name="mail" class="shrink-0 text-accent-400" /> {{ site.email }}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-3 text-lg font-semibold text-white">Horário</p>
        <p class="mb-3 text-sm text-brand-300">
          Os atendimentos podem ser agendados nestes horários. Consulte disponibilidade.
        </p>
        <ul class="space-y-2 text-sm">
          <li v-for="h in site.hours" :key="h.days" class="flex items-center gap-2 text-brand-300">
            <AppIcon name="clock" class="shrink-0 text-accent-400" />
            <span
              ><span class="text-brand-100">{{ h.days }}:</span> {{ h.time }}</span
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-brand-800">
      <div class="container-site flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p class="text-xs text-brand-400">
          © {{ new Date().getFullYear() }} {{ site.name }} · {{ site.crp }} · Todos os direitos reservados
        </p>
        <div class="flex items-center gap-3">
          <a
            v-for="(href, name) in { instagram: site.instagram, facebook: site.facebook, whatsapp: site.whatsapp }"
            :key="name"
            :href="href"
            target="_blank"
            rel="noopener"
            class="grid size-9 place-items-center rounded-full bg-brand-800 text-brand-200 transition-colors hover:bg-accent-600 hover:text-white"
            :aria-label="`${name} da ${site.name}`"
          >
            <AppIcon :name="name" class="size-4.5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
