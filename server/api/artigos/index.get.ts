export default defineEventHandler(async () => {
  const snapshot = await useFirestore()
    .collection('artigos')
    .where('status', '==', 'publicado')
    .orderBy('atualizadoEm', 'desc')
    .get()

  return snapshot.docs.map((doc) => {
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
