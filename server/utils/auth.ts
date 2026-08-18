import type { H3Event } from 'h3'

export async function requireAdmin(event: H3Event) {
  const runtime = useRuntimeConfig()
  const authorization = getHeader(event, 'authorization')
  if (!authorization?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Não autorizado.' })
  }

  const token = authorization.slice(7)
  try {
    const decoded = await useAdminAuth().verifyIdToken(token)
    const adminEmail = (runtime.adminEmail || '').toLowerCase()
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL não configurado')
    }
    const allowed = (decoded.email ?? '').toLowerCase() === adminEmail
    if (!allowed || !decoded.email_verified) {
      throw new Error(allowed ? 'e-mail não verificado' : 'e-mail não permitido')
    }
    return decoded
  } catch (err) {
    console.error('[auth] Acesso negado a /api/admin:', (err as Error).message)
    throw createError({ statusCode: 401, message: 'Sessão inválida ou usuário sem permissão.' })
  }
}
