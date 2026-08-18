<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import type { Article } from '#shared/utils/types'

const props = defineProps<{ articleId?: string }>()

const adminFetch = useAdminFetch()
const router = useRouter()

const form = reactive({
  titulo: '',
  resumo: '',
  conteudo: '',
  capa: '',
  status: 'rascunho' as 'rascunho' | 'publicado',
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const uploading = ref(false)
const uploadingImage = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)
const loadedContent = ref('')

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
      link: false,
      heading: { levels: [2, 3] },
    }),
    Link.configure({ openOnClick: false, autolink: true }),
    Image.configure({ inline: false, allowBase64: false }),
  ],
  editorProps: {
    handlePaste: (view, event) => {
      const items = event.clipboardData?.files
      if (items && items.length > 0) {
        const file = Array.from(items).find((f) => f.type.startsWith('image/'))
        if (file) {
          event.preventDefault()
          insertImage(file)
          return true
        }
      }
      return false
    },
  },
})

watch([editor, loadedContent], () => {
  const current = editor.value
  if (current && loadedContent.value) {
    current.commands.setContent(loadedContent.value, false)
  }
})

if (props.articleId) {
  onMounted(async () => {
    loading.value = true
    error.value = ''
    try {
      const article = await adminFetch<Article>(`/api/admin/artigos/${props.articleId}`)
      Object.assign(form, {
        titulo: article.titulo,
        resumo: article.resumo,
        capa: article.capa || '',
        status: article.status,
      })
      loadedContent.value = article.conteudo
    } catch {
      error.value = 'Não foi possível carregar o artigo.'
    } finally {
      loading.value = false
    }
  })
}

async function insertImage(file: File) {
  if (!editor.value) return
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'A imagem deve ter no máximo 5 MB.'
    return
  }
  uploadingImage.value = true
  error.value = ''
  try {
    const src = await uploadArticleImage(file)
    editor.value.chain().focus().setImage({ src }).run()
  } catch {
    error.value = 'Falha no upload da imagem. Verifique as regras do Firebase Storage.'
  } finally {
    uploadingImage.value = false
  }
}

function onImageSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) insertImage(file)
}

function setLink() {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href as string | undefined
  const url = window.prompt('URL do link:', previousUrl ?? '')
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: normalized }).run()
}

async function onCapaChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'A imagem deve ter no máximo 5 MB.'
    return
  }
  uploading.value = true
  error.value = ''
  try {
    form.capa = await uploadCapa(file)
  } catch {
    error.value = 'Falha no upload da imagem. Verifique as regras do Firebase Storage.'
  } finally {
    uploading.value = false
  }
}

async function save() {
  error.value = ''
  const textLength = editor.value?.getText().trim().length ?? 0
  if (!form.titulo.trim() || textLength < 10) {
    error.value = 'Preencha título e conteúdo (mínimo 10 caracteres).'
    return
  }
  form.conteudo = editor.value?.getHTML() ?? ''
  saving.value = true
  try {
    if (props.articleId) {
      await adminFetch(`/api/admin/artigos/${props.articleId}`, { method: 'PUT', body: form })
    } else {
      await adminFetch('/api/admin/artigos', { method: 'POST', body: form })
    }
    router.push('/admin')
  } catch (err: unknown) {
    const e = err as { data?: { message?: string; statusMessage?: string } }
    error.value = e?.data?.message || e?.data?.statusMessage || 'Não foi possível salvar o artigo.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ articleId ? 'Editar artigo' : 'Novo artigo' }}</h1>
      <NuxtLink to="/admin" class="text-sm text-brand-500 hover:text-accent-700">← Voltar</NuxtLink>
    </div>

    <div v-if="loading" class="py-12 text-center text-brand-500">Carregando...</div>

    <div v-else-if="error" class="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <form v-else class="space-y-6" @submit.prevent="save">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-5 lg:col-span-2">
          <div>
            <label for="ed-titulo" class="label-field">Título*</label>
            <input
              id="ed-titulo"
              v-model="form.titulo"
              type="text"
              required
              class="input-field"
              placeholder="Título do artigo"
            />
          </div>
          <div>
            <label for="ed-resumo" class="label-field">Resumo (aparece na listagem)</label>
            <textarea
              id="ed-resumo"
              v-model="form.resumo"
              rows="2"
              class="input-field resize-none"
              placeholder="Breve resumo do artigo"
            />
          </div>
          <div>
            <label class="label-field">Conteúdo*</label>
            <div class="overflow-hidden rounded-xl border border-brand-200 bg-white">
              <div class="flex flex-wrap items-center gap-1 border-b border-brand-100 bg-brand-50/60 p-2">
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('bold') }"
                  :disabled="!editor"
                  title="Negrito"
                  @click="editor?.chain().focus().toggleBold().run()"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('italic') }"
                  :disabled="!editor"
                  title="Itálico"
                  @click="editor?.chain().focus().toggleItalic().run()"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('strike') }"
                  :disabled="!editor"
                  title="Tachado"
                  @click="editor?.chain().focus().toggleStrike().run()"
                >
                  <s>S</s>
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('underline') }"
                  :disabled="!editor"
                  title="Sublinhado"
                  @click="editor?.chain().focus().toggleUnderline().run()"
                >
                  <u>U</u>
                </button>
                <span class="mx-1 h-5 w-px bg-brand-200" aria-hidden="true"></span>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
                  :disabled="!editor"
                  title="Subtítulo (H2)"
                  @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                >
                  H2
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
                  :disabled="!editor"
                  title="Sub-seção (H3)"
                  @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
                >
                  H3
                </button>
                <span class="mx-1 h-5 w-px bg-brand-200" aria-hidden="true"></span>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('bulletList') }"
                  :disabled="!editor"
                  title="Lista com marcadores"
                  @click="editor?.chain().focus().toggleBulletList().run()"
                >
                  • Lista
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('orderedList') }"
                  :disabled="!editor"
                  title="Lista numerada"
                  @click="editor?.chain().focus().toggleOrderedList().run()"
                >
                  1. Num.
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('blockquote') }"
                  :disabled="!editor"
                  title="Citação"
                  @click="editor?.chain().focus().toggleBlockquote().run()"
                >
                  ❝ Citação
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('code') }"
                  :disabled="!editor"
                  title="Código"
                  @click="editor?.chain().focus().toggleCode().run()"
                >
                  &lt;&gt;
                </button>
                <span class="mx-1 h-5 w-px bg-brand-200" aria-hidden="true"></span>
                <button
                  type="button"
                  class="toolbar-btn"
                  :class="{ 'is-active': editor?.isActive('link') }"
                  :disabled="!editor"
                  title="Inserir link"
                  @click="setLink"
                >
                  Link
                </button>
                <button
                  type="button"
                  class="toolbar-btn"
                  :disabled="!editor || uploadingImage"
                  title="Inserir imagem do computador (ou cole uma imagem)"
                  @click="imageInput?.click()"
                >
                  {{ uploadingImage ? 'Enviando...' : 'Imagem' }}
                </button>
              </div>
              <EditorContent :editor="editor" class="prose-site" />
              <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageSelect" />
            </div>
            <p class="mt-1.5 text-xs text-brand-400">
              Formatos básicos disponíveis. Você também pode colar uma imagem (Ctrl+V) diretamente no editor.
            </p>
          </div>
        </div>

        <aside class="space-y-5">
          <div class="rounded-2xl border border-brand-200 bg-white p-5">
            <label class="label-field">Status</label>
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 rounded-lg border px-3 py-2 text-sm font-medium"
                :class="
                  form.status === 'rascunho'
                    ? 'border-accent-500 bg-accent-50 text-accent-700'
                    : 'border-brand-200 text-brand-600'
                "
                @click="form.status = 'rascunho'"
              >
                Rascunho
              </button>
              <button
                type="button"
                class="flex-1 rounded-lg border px-3 py-2 text-sm font-medium"
                :class="
                  form.status === 'publicado'
                    ? 'border-accent-500 bg-accent-50 text-accent-700'
                    : 'border-brand-200 text-brand-600'
                "
                @click="form.status = 'publicado'"
              >
                Publicar
              </button>
            </div>
          </div>

          <div class="rounded-2xl border border-brand-200 bg-white p-5">
            <label for="ed-capa" class="label-field">Imagem de capa</label>
            <label
              class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 p-6 text-sm text-brand-500 hover:border-accent-400"
            >
              <AppIcon name="plus" class="size-6" />
              {{ uploading ? 'Enviando...' : 'Clique para enviar' }}
              <span class="text-xs">JPG/PNG/WebP até 5 MB</span>
              <input id="ed-capa" type="file" accept="image/*" class="hidden" @change="onCapaChange" />
            </label>
            <NuxtImg
              v-if="form.capa"
              :src="form.capa"
              alt="Capa do artigo"
              class="mt-3 aspect-video w-full rounded-xl object-cover"
            />
            <button
              v-if="form.capa"
              type="button"
              class="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
              @click="form.capa = ''"
            >
              Remover imagem
            </button>
          </div>
        </aside>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <button type="submit" class="btn-primary" :disabled="saving || uploading || uploadingImage">
          {{ saving ? 'Salvando...' : articleId ? 'Salvar alterações' : 'Criar artigo' }}
        </button>
        <NuxtLink to="/admin" class="btn-ghost">Cancelar</NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.toolbar-btn {
  @apply inline-flex min-w-8 items-center justify-center rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40;
}
.toolbar-btn.is-active {
  @apply border-accent-200 bg-accent-600 text-white hover:bg-accent-600;
}

.prose-site :deep(.ProseMirror) {
  @apply min-h-64 px-4 py-3 text-brand-700 outline-none;
}
.prose-site :deep(.ProseMirror p) {
  @apply mb-3 leading-relaxed;
}
.prose-site :deep(.ProseMirror h2) {
  @apply mb-3 mt-6 text-2xl font-bold text-brand-900;
}
.prose-site :deep(.ProseMirror h3) {
  @apply mb-2 mt-5 text-xl font-bold text-brand-900;
}
.prose-site :deep(.ProseMirror ul) {
  @apply mb-3 list-disc space-y-1 pl-5;
}
.prose-site :deep(.ProseMirror ol) {
  @apply mb-3 list-decimal space-y-1 pl-5;
}
.prose-site :deep(.ProseMirror li p) {
  @apply mb-0;
}
.prose-site :deep(.ProseMirror blockquote) {
  @apply mb-3 border-l-4 border-accent-500 pl-4 italic text-brand-600;
}
.prose-site :deep(.ProseMirror a) {
  @apply text-accent-600 underline hover:text-accent-700;
}
.prose-site :deep(.ProseMirror strong) {
  @apply font-semibold text-brand-900;
}
.prose-site :deep(.ProseMirror img) {
  @apply my-3 h-auto max-w-full rounded-xl;
}
.prose-site :deep(.ProseMirror code) {
  @apply rounded bg-brand-100 px-1 py-0.5 font-mono text-sm;
}
.prose-site :deep(.ProseMirror pre) {
  @apply mb-3 rounded-lg bg-brand-100 p-3 font-mono text-sm;
}
.prose-site :deep(.ProseMirror hr) {
  @apply my-4 border-brand-200;
}
</style>
