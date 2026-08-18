import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let app: App | null = null

function parseCredential(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/\r?\n/g, '').trim()
  for (const candidate of [cleaned, Buffer.from(cleaned, 'base64').toString('utf8')]) {
    try {
      const value = JSON.parse(candidate)
      if (typeof value === 'object' && value !== null) return value
    } catch {
      // tenta a próxima representação
    }
  }
  return null
}

export function useFirebaseAdmin(): App {
  if (app) return app

  const runtime = useRuntimeConfig()
  const credentialRaw = runtime.firebaseAdminCredential

  let options: Record<string, unknown> = { projectId: 'piscomariana' }
  if (credentialRaw) {
    const parsed = parseCredential(credentialRaw)
    if (parsed) {
      options = { ...options, credential: cert(parsed) }
    } else {
      console.warn(
        '[firebase-admin] FIREBASE_ADMIN_CREDENTIAL não é um JSON válido. Espera-se o JSON da service account em ' +
          'uma única linha (ou em base64). Usando credenciais padrão (GOOGLE_APPLICATION_CREDENTIALS).',
      )
    }
  } else {
    console.warn(
      '[firebase-admin] FIREBASE_ADMIN_CREDENTIAL não definida. Local: exporte GOOGLE_APPLICATION_CREDENTIALS ' +
        'com o arquivo da service account. Produção: defina a variável na Vercel.',
    )
  }

  const existing = getApps().find((a) => a.name === 'piscomariana-admin')
  app = existing ?? initializeApp(options, 'piscomariana-admin')
  return app
}

export function useFirestore() {
  return getFirestore(useFirebaseAdmin())
}

export function useAdminAuth() {
  return getAuth(useFirebaseAdmin())
}
