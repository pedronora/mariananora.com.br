<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { requestPasswordReset } = useAuth()

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await requestPasswordReset(email.value)
    sent.value = true
  } catch (err) {
    error.value =
      (err as { data?: { message?: string } }).data?.message || 'Não foi possível enviar o e-mail. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center">
    <div class="rounded-3xl border border-brand-200 bg-white p-8">
      <span class="grid size-12 place-items-center rounded-full bg-accent-100 text-accent-700"
        ><AppIcon name="lock" class="size-5"
      /></span>

      <template v-if="sent">
        <h1 class="mt-4 text-2xl font-bold">Verifique seu e-mail</h1>
        <p class="mt-2 text-sm leading-relaxed text-brand-600">
          Se este e-mail tiver acesso à área administrativa, enviamos um link para redefinir a senha.
        </p>
        <p class="mt-2 text-sm leading-relaxed text-brand-500">
          O link expira em <strong class="font-semibold text-brand-700">5 minutos</strong>. Confira também a caixa de
          spam.
        </p>
        <div class="mt-6 flex flex-col gap-3">
          <NuxtLink to="/admin/login" class="btn-primary w-full">Voltar para o login</NuxtLink>
          <button type="button" class="text-sm text-accent-700 hover:underline" @click="sent = false">
            Enviar para outro e-mail
          </button>
        </div>
      </template>

      <template v-else>
        <h1 class="mt-4 text-2xl font-bold">Esqueci minha senha</h1>
        <p class="mt-1 text-sm text-brand-500">
          Informe o e-mail com acesso ao admin para receber o link de redefinição.
        </p>

        <div v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ error }}
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label for="reset-email" class="label-field">E-mail</label>
            <input
              id="reset-email"
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="seuemail@exemplo.com"
              autocomplete="email"
            />
          </div>
          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Enviar link de redefinição' }}
          </button>
        </form>

        <NuxtLink
          to="/admin/login"
          class="mt-6 inline-block text-sm text-brand-500 transition-colors hover:text-accent-700"
        >
          Voltar para o login
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
