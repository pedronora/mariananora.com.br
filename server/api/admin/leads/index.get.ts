import type { LeadWithId, LeadsPage } from '#shared/utils/types'
import { matchesQuery } from '../../../utils/search'

const PAGE_SIZE = 10
const SEARCH_CAP = 200

export default defineEventHandler(async (event): Promise<LeadsPage> => {
  await requireAdmin(event)

  const query = getQuery(event)
  const afterId = typeof query.after === 'string' ? query.after : undefined
  const q = (query.q ?? '').toString().trim()

  const db = useFirestore()

  if (q) {
    const snapshot = await db.collection('leads').orderBy('criadoEm', 'desc').limit(SEARCH_CAP).get()
    const matches = snapshot.docs.filter((doc) => {
      const data = doc.data()
      return matchesQuery([data.nome, data.email, data.telefone, data.assunto, data.mensagem], q)
    })

    const startIndex = afterId ? matches.findIndex((doc) => doc.id === afterId) + 1 : 0
    const page = matches.slice(startIndex, startIndex + PAGE_SIZE)

    return {
      leads: page.map((doc) => {
        const data = doc.data() as Omit<LeadWithId, 'id'>
        return { id: doc.id, ...data }
      }),
      nextAfter: page.length === PAGE_SIZE ? page[page.length - 1].id : null,
    }
  }

  let ref = db
    .collection('leads')
    .orderBy('criadoEm', 'desc')
    .limit(PAGE_SIZE + 1)

  if (afterId) {
    const last = await db.collection('leads').doc(afterId).get()
    if (last.exists) ref = ref.startAfter(last)
  }

  const snapshot = await ref.get()
  const docs = snapshot.docs

  const hasMore = docs.length > PAGE_SIZE
  const page = docs.slice(0, PAGE_SIZE)

  return {
    leads: page.map((doc) => {
      const data = doc.data() as Omit<LeadWithId, 'id'>
      return { id: doc.id, ...data }
    }),
    nextAfter: hasMore ? page[page.length - 1].id : null,
  }
})
