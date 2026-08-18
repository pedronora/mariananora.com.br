import type { Lead } from '#shared/utils/types'
import { leadSchema } from '../utils/validate'

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000
const attempts = new Map<string, { count: number; resetAt: number }>()

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const now = Date.now()
  const entry = attempts.get(ip)
  if (entry && entry.resetAt > now) {
    if (entry.count >= RATE_LIMIT) {
      throw createError({ statusCode: 429, message: 'Muitas solicitações. Tente novamente mais tarde.' })
    }
    entry.count++
  } else {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
  }

  const body = await readBody(event)
  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message ?? 'Dados inválidos.' })
  }

  const lead: Lead = {
    ...parsed.data,
    telefone: parsed.data.telefone ?? '',
    criadoEm: new Date().toISOString(),
  }

  try {
    await useFirestore().collection('leads').add(lead)
  } catch (err) {
    console.error('[contato] Falha ao salvar lead no Firestore:', lead.nome, lead.email, err)
  }

  try {
    await sendContactEmail(lead)
  } catch (err) {
    console.error('[contato] Falha ao enviar e-mail:', err)
    throw createError({ statusCode: 502, message: 'Não foi possível enviar o e-mail. Tente novamente.' })
  }

  return { ok: true, message: 'Mensagem enviada com sucesso!' }
})
