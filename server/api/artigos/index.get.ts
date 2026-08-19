import { matchesQuery, stripHtml } from '../../utils/search'

export default defineEventHandler(async (event) => {
  const q = (getQuery(event).q ?? '').toString().trim()

  const snapshot = await useFirestore()
    .collection('artigos')
    .where('status', '==', 'publicado')
    .orderBy('atualizadoEm', 'desc')
    .get()

  const docs = q
    ? snapshot.docs.filter((doc) => {
        const data = doc.data()
        return matchesQuery([data.titulo, data.resumo, data.autor, data.slug, stripHtml(data.conteudo)], q)
      })
    : snapshot.docs

  return docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      slug: data.slug,
      titulo: data.titulo,
      resumo: data.resumo,
      capa: data.capa ?? '',
      autor: data.autor,
      criadoEm: data.criadoEm,
      atualizadoEm: data.atualizadoEm,
    }
  })
})
