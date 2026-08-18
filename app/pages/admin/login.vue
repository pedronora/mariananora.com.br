<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const { login } = useAuth()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
  } catch {
    error.value = 'E-mail ou senha inválidos.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center">
    <div class="rounded-3xl border border-brand-200 bg-white p-8">
      <span class="grid size-12 place-items-center rounded-full bg-accent-100 text-accent-700"
        ><AppIcon name="lock"
      /></span>
      <h1 class="mt-4 text-2xl font-bold">Acesso restrito</h1>
      <p class="mt-1 text-sm text-brand-500">Entre para gerenciar os artigos do site.</p>

      <div v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ error }}
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label for="admin-email" class="label-field">E-mail</label>
          <input
            id="admin-email"
            v-model="email"
            type="email"
            required
            class="input-field"
            placeholder="seuemail@exemplo.com"
            autocomplete="username"
          />
        </div>
        <div>
          <label for="admin-password" class="label-field">Senha</label>
          <div class="relative">
            <input
              id="admin-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input-field pr-11"
              placeholder="Sua senha"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-brand-400 hover:text-brand-600"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showPassword = !showPassword"
            >
              <AppIcon :name="showPassword ? 'eyeOff' : 'eye'" class="size-5" />
            </button>
          </div>
        </div>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>
