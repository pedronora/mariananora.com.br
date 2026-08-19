import { matchesQuery, stripHtml } from '../../../utils/search'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const q = (getQuery(event).q ?? '').toString().trim()

  const snapshot = await useFirestore().collection('artigos').orderBy('atualizadoEm', 'desc').get()

  const docs = q
    ? snapshot.docs.filter((doc) => {
        const data = doc.data()
        return matchesQuery([data.titulo, data.resumo, data.slug, stripHtml(data.conteudo)], q)
      })
    : snapshot.docs

  return docs.map((doc) => ({
    id: doc.id,
    slug: doc.data().slug,
    titulo: doc.data().titulo,
    resumo: doc.data().resumo,
    status: doc.data().status,
    capa: doc.data().capa ?? '',
    criadoEm: doc.data().criadoEm,
    atualizadoEm: doc.data().atualizadoEm,
  }))
})
