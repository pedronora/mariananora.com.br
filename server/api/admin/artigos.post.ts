import { articleSchema, slugify } from '../../utils/validate'
import { sanitizeContent } from '../../utils/sanitize'

export default defineEventHandler(async (event) => {
  const decoded = await requireAdmin(event)
  const body = await readBody(event)
  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message ?? 'Dados inválidos.' })
  }

  const db = useFirestore()
  const base = slugify(parsed.data.titulo)
  let slug = base
  let counter = 2
  while (true) {
    const existing = await db.collection('artigos').where('slug', '==', slug).limit(1).get()
    if (existing.empty) break
    slug = `${base}-${counter}`
    counter++
  }

  const now = new Date().toISOString()
  const doc = await db.collection('artigos').add({
    slug,
    titulo: parsed.data.titulo,
    resumo: parsed.data.resumo,
    conteudo: sanitizeContent(parsed.data.conteudo),
    capa: parsed.data.capa || '',
    status: parsed.data.status,
    autor: decoded.name || decoded.email || 'Mariana Nora',
    criadoEm: now,
    atualizadoEm: now,
  })

  return { id: doc.id, slug }
})
