<script setup lang="ts">
import { authErrorMessage, passwordProblem } from '#shared/utils/password'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { user, changePassword } = useAuth()

const current = ref('')
const next = ref('')
const confirmation = ref('')
const showPasswords = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

async function submit() {
  error.value = ''
  success.value = ''

  const problem = passwordProblem(next.value)
  if (problem) {
    error.value = problem
    return
  }
  if (next.value !== confirmation.value) {
    error.value = 'A confirmação não confere com a nova senha.'
    return
  }
  if (next.value === current.value) {
    error.value = 'A nova senha deve ser diferente da senha atual.'
    return
  }

  loading.value = true
  try {
    await changePassword(current.value, next.value)
    current.value = ''
    next.value = ''
    confirmation.value = ''
    success.value = 'Senha alterada com sucesso.'
  } catch (err) {
    const authError = err as { code?: string; message?: string }
    error.value = authError.code ? authErrorMessage(authError.code) : authError.message || authErrorMessage()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl">
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Minha conta</h1>
      <p class="text-sm text-brand-500">Dados de acesso à área administrativa.</p>
    </div>

    <div class="rounded-3xl border border-brand-200 bg-white p-6 sm:p-8">
      <div class="flex items-center gap-3 border-b border-brand-100 pb-5">
        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700">
          <AppIcon name="user" class="size-5" />
        </span>
        <div class="min-w-0">
          <p class="text-xs font-medium uppercase tracking-wide text-brand-400">E-mail</p>
          <p class="truncate text-sm font-medium text-brand-800">{{ user?.email || '—' }}</p>
        </div>
      </div>

      <h2 class="mt-6 text-lg font-semibold">Alterar senha</h2>
      <p class="mt-1 text-sm text-brand-500">Mínimo de 8 caracteres, com letras e números.</p>

      <div v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ error }}
      </div>
      <div v-if="success" class="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-3 text-sm text-accent-800">
        {{ success }}
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label for="account-current-password" class="label-field">Senha atual</label>
          <div class="relative">
            <input
              id="account-current-password"
              v-model="current"
              :type="showPasswords ? 'text' : 'password'"
              required
              class="input-field pr-11"
              placeholder="Sua senha atual"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-brand-400 hover:text-brand-600"
              :aria-label="showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'"
              @click="showPasswords = !showPasswords"
            >
              <AppIcon :name="showPasswords ? 'eyeOff' : 'eye'" class="size-5" />
            </button>
          </div>
        </div>
        <div>
          <label for="account-new-password" class="label-field">Nova senha</label>
          <input
            id="account-new-password"
            v-model="next"
            :type="showPasswords ? 'text' : 'password'"
            required
            class="input-field"
            placeholder="Nova senha"
            autocomplete="new-password"
          />
        </div>
        <div>
          <label for="account-confirmation" class="label-field">Confirme a nova senha</label>
          <input
            id="account-confirmation"
            v-model="confirmation"
            :type="showPasswords ? 'text' : 'password'"
            required
            class="input-field"
            placeholder="Repita a nova senha"
            autocomplete="new-password"
          />
        </div>
        <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Alterar senha' }}
        </button>
      </form>
    </div>
  </div>
</template>
