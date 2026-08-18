import type { LeadWithId, LeadsPage } from '#shared/utils/types'

const PAGE_SIZE = 10

export default defineEventHandler(async (event): Promise<LeadsPage> => {
  await requireAdmin(event)

  const query = getQuery(event)
  const afterId = typeof query.after === 'string' ? query.after : undefined

  const db = useFirestore()
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
