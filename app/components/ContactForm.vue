<script setup lang="ts">
const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  assunto: 'agendamento',
  mensagem: '',
})

const assuntoOptions = [
  { value: 'agendamento', label: 'Agendamento de consulta' },
  { value: 'psicoterapia', label: 'Psicoterapia' },
  { value: 'avaliacao', label: 'Avaliação Neuropsicológica' },
  { value: 'orientacao', label: 'Orientação Profissional' },
  { value: 'outro', label: 'Outro assunto' },
]

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''
  if (digits.length < 3) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function onPhoneInput(event: Event) {
  const target = event.target as HTMLInputElement
  const before = target.value
  const formatted = formatPhone(before)
  form.telefone = formatted
  if (formatted !== before) {
    const cursor = target.selectionStart ?? target.value.length
    target.value = formatted
    const diff = formatted.length - before.length
    target.setSelectionRange(cursor + diff, cursor + diff)
  }
}

const submitting = ref(false)
const error = ref('')
const success = ref(false)

async function submit() {
  error.value = ''
  success.value = false
  submitting.value = true
  try {
    await $fetch('/api/contato', { method: 'POST', body: form })
    success.value = true
    Object.assign(form, { nome: '', email: '', telefone: '', assunto: 'agendamento', mensagem: '' })
  } catch (err: unknown) {
    const e = err as { data?: { message?: string; statusMessage?: string } }
    error.value = e?.data?.message || e?.data?.statusMessage || 'Não foi possível enviar a mensagem. Tente novamente.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <div
      v-if="success"
      class="flex items-start gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-800"
    >
      <AppIcon name="check" class="mt-0.5 shrink-0 text-accent-600" />
      Mensagem enviada com sucesso! Retornarei o contato em breve.
    </div>
    <div
      v-if="error"
      class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      <AppIcon name="close" class="mt-0.5 shrink-0" />
      {{ error }}
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="nome" class="label-field">Nome*</label>
        <input
          id="nome"
          v-model="form.nome"
          type="text"
          required
          class="input-field"
          placeholder="Seu nome completo"
          autocomplete="name"
        />
      </div>
      <div>
        <label for="telefone" class="label-field">Telefone</label>
        <input
          id="telefone"
          :value="form.telefone"
          type="tel"
          class="input-field"
          placeholder="(00) 00000-0000"
          autocomplete="tel"
          inputmode="tel"
          @input="onPhoneInput"
          @change="onPhoneInput"
        />
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="email" class="label-field">E-mail*</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="input-field"
          placeholder="seuemail@exemplo.com"
          autocomplete="email"
        />
      </div>
      <div>
        <label for="assunto" class="label-field">Assunto*</label>
        <select id="assunto" v-model="form.assunto" class="input-field" required>
          <option v-for="opt in assuntoOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </div>

    <div>
      <label for="mensagem" class="label-field">Mensagem*</label>
      <textarea
        id="mensagem"
        v-model="form.mensagem"
        required
        rows="5"
        class="input-field resize-none"
        placeholder="Como posso ajudar?"
      />
    </div>

    <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="submitting">
      <AppIcon v-if="submitting" name="clock" class="animate-spin" />
      <AppIcon v-else name="send" />
      {{ submitting ? 'Enviando...' : 'Enviar mensagem' }}
    </button>
  </form>
</template>
