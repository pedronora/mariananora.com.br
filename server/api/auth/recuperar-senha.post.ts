import { randomBytes } from 'node:crypto'
import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
import { site } from '#shared/utils/site'

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000
/** O link enviado por e-mail (token próprio, não o oobCode do Firebase) vale por 5 minutos. */
const RESET_TTL_MS = 5 * 60 * 1000

const attempts = new Map<string, { count: number; resetAt: number }>()

const bodySchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.').max(200),
})

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

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message ?? 'Dados inválidos.' })
  }

  const email = parsed.data.email.toLowerCase()
  const adminEmail = (useRuntimeConfig().adminEmail || '').toLowerCase()
  if (!adminEmail) {
    console.error('[recuperar-senha] ADMIN_EMAIL não configurado.')
    throw createError({ statusCode: 500, message: 'Recuperação de senha indisponível.' })
  }

  // Resposta uniforme: não revela se o e-mail informado tem acesso ao admin.
  if (email !== adminEmail) {
    console.warn('[recuperar-senha] Solicitação ignorada para e-mail sem permissão:', email)
    return { ok: true }
  }

  let uid: string
  try {
    uid = (await useAdminAuth().getUserByEmail(email)).uid
  } catch (err) {
    console.warn('[recuperar-senha] Usuário admin não encontrado no Firebase Auth:', (err as Error).message)
    return { ok: true }
  }

  const token = randomBytes(32).toString('hex')
  const resetRef = useFirestore().collection('password_resets').doc(token)
  try {
    await resetRef.set({
      uid,
      email,
      criadoEm: Timestamp.now(),
      expiraEm: Timestamp.fromMillis(Date.now() + RESET_TTL_MS),
    })
  } catch (err) {
    console.error('[recuperar-senha] Falha ao registrar o token de redefinição:', err)
    throw createError({ statusCode: 502, message: 'Não foi possível enviar o e-mail. Tente novamente.' })
  }

  try {
    await sendPasswordResetEmail({ to: email, url: `${site.domain}/admin/redefinir-senha?token=${token}` })
  } catch (err) {
    console.error('[recuperar-senha] Falha ao enviar o e-mail:', err)
    await resetRef.delete().catch(() => {})
    throw createError({ statusCode: 502, message: 'Não foi possível enviar o e-mail. Tente novamente.' })
  }

  return { ok: true }
})
