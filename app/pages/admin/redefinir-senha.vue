<script setup lang="ts">
import { passwordProblem } from '#shared/utils/password'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const { resetPassword } = useAuth()

const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const password = ref('')
const confirmation = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function submit() {
  error.value = ''
  const problem = passwordProblem(password.value)
  if (problem) {
    error.value = problem
    return
  }
  if (password.value !== confirmation.value) {
    error.value = 'As senhas não conferem.'
    return
  }
  loading.value = true
  try {
    await resetPassword(token.value, password.value)
    done.value = true
  } catch (err) {
    error.value =
      (err as { data?: { message?: string } }).data?.message || 'Não foi possível alterar a senha. Tente novamente.'
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

      <template v-if="!token">
        <h1 class="mt-4 text-2xl font-bold">Link inválido</h1>
        <p class="mt-2 text-sm leading-relaxed text-brand-600">
          Este endereço não contém um link de redefinição válido. Solicite um novo link para continuar.
        </p>
        <NuxtLink to="/admin/esqueci-senha" class="btn-primary mt-6 w-full">Solicitar novo link</NuxtLink>
      </template>

      <template v-else-if="done">
        <h1 class="mt-4 text-2xl font-bold">Senha alterada</h1>
        <p class="mt-2 text-sm leading-relaxed text-brand-600">
          Sua nova senha já está ativa. Entre na área administrativa para continuar.
        </p>
        <NuxtLink to="/admin/login" class="btn-primary mt-6 w-full">Ir para o login</NuxtLink>
      </template>

      <template v-else>
        <h1 class="mt-4 text-2xl font-bold">Definir nova senha</h1>
        <p class="mt-1 text-sm text-brand-500">Mínimo de 8 caracteres, com letras e números.</p>

        <div v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ error }}
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label for="reset-password" class="label-field">Nova senha</label>
            <div class="relative">
              <input
                id="reset-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-11"
                placeholder="Nova senha"
                autocomplete="new-password"
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
          <div>
            <label for="reset-confirmation" class="label-field">Confirme a nova senha</label>
            <input
              id="reset-confirmation"
              v-model="confirmation"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input-field"
              placeholder="Repita a nova senha"
              autocomplete="new-password"
            />
          </div>
          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Definir nova senha' }}
          </button>
        </form>

        <NuxtLink
          to="/admin/esqueci-senha"
          class="mt-6 inline-block text-sm text-brand-500 transition-colors hover:text-accent-700"
        >
          O link expirou? Solicite outro
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
