export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const snapshot = await useFirestore().collection('artigos').orderBy('atualizadoEm', 'desc').get()

  return snapshot.docs.map((doc) => ({
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
