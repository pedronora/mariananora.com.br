import { z } from 'zod'
import type { Timestamp } from 'firebase-admin/firestore'
import { passwordProblem } from '#shared/utils/password'

const INVALID_TOKEN = 'Link inválido ou expirado. Solicite uma nova redefinição.'

const bodySchema = z.object({
  token: z.string().trim().min(32).max(128),
  password: z.string().min(1).max(200),
})

export default defineEventHandler(async (event) => {
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Dados inválidos.' })
  }

  const problem = passwordProblem(parsed.data.password)
  if (problem) {
    throw createError({ statusCode: 400, message: problem })
  }

  const resetRef = useFirestore().collection('password_resets').doc(parsed.data.token)
  const snapshot = await resetRef.get()
  if (!snapshot.exists) {
    throw createError({ statusCode: 400, message: INVALID_TOKEN })
  }

  const data = snapshot.data() as { uid?: string; expiraEm?: Timestamp | string }
  // `string` cobre tokens gravados antes da adoção do Timestamp (TTL do Firestore).
  const expiresAt =
    typeof data.expiraEm === 'string' ? new Date(data.expiraEm).getTime() : (data.expiraEm?.toMillis() ?? 0)
  if (!data.uid || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    await resetRef.delete().catch(() => {})
    throw createError({ statusCode: 400, message: INVALID_TOKEN })
  }

  try {
    await useAdminAuth().updateUser(data.uid, { password: parsed.data.password })
    // Invalida sessões antigas: quem tinha a senha anterior perde o acesso.
    await useAdminAuth().revokeRefreshTokens(data.uid)
  } catch (err) {
    console.error('[redefinir-senha] Falha ao atualizar a senha:', err)
    throw createError({ statusCode: 502, message: 'Não foi possível alterar a senha. Tente novamente.' })
  }

  await resetRef.delete().catch(() => {})
  return { ok: true }
})
