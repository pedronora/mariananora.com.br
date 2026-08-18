import { articleSchema } from '../../../utils/validate'
import { sanitizeContent } from '../../../utils/sanitize'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID não informado.' })
  }

  const body = await readBody(event)
  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message ?? 'Dados inválidos.' })
  }

  const ref = useFirestore().collection('artigos').doc(id)
  const existing = await ref.get()
  if (!existing.exists) {
    throw createError({ statusCode: 404, message: 'Artigo não encontrado.' })
  }

  await ref.update({
    titulo: parsed.data.titulo,
    resumo: parsed.data.resumo,
    conteudo: sanitizeContent(parsed.data.conteudo),
    capa: parsed.data.capa || '',
    status: parsed.data.status,
    atualizadoEm: new Date().toISOString(),
  })

  return { id, ok: true }
})
