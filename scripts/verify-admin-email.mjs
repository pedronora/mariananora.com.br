import { initializeApp, cert, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function parseCredential(raw) {
  const cleaned = raw.replace(/\r?\n/g, '').trim()
  for (const candidate of [cleaned, Buffer.from(cleaned, 'base64').toString('utf8')]) {
    try {
      const value = JSON.parse(candidate)
      if (typeof value === 'object' && value !== null) return value
    } catch {
      // tenta o próximo
    }
  }
  return null
}

const raw = process.env.FIREBASE_ADMIN_CREDENTIAL || ''
let app
let source = 'GOOGLE_APPLICATION_CREDENTIALS (credenciais padrão)'

if (raw.trim()) {
  const parsed = parseCredential(raw)
  if (parsed) {
    app = initializeApp({ credential: cert(parsed) })
    source = 'FIREBASE_ADMIN_CREDENTIAL'
  } else {
    console.warn('FIREBASE_ADMIN_CREDENTIAL não parece ser JSON válido; usando credenciais padrão.')
  }
}

if (!app) {
  app = initializeApp({ credential: applicationDefault() })
}

const email = process.env.ADMIN_EMAIL
if (!email) {
  console.error(
    'ADMIN_EMAIL não definido. Configure no .env e rode com: node --env-file=.env scripts/verify-admin-email.mjs',
  )
  process.exit(1)
}

try {
  const user = await getAuth(app).getUserByEmail(email)
  if (user.emailVerified) {
    console.log(`OK: ${email} já está com e-mail verificado.`)
  } else {
    await getAuth(app).updateUser(user.uid, { emailVerified: true })
    console.log(`OK: e-mail de ${email} marcado como verificado.`)
  }
  console.log(`Credenciais usadas: ${source}`)
} catch (err) {
  console.error('Erro ao verificar e-mail:', err.message)
  process.exit(1)
}
