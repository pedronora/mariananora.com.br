export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug não informado.' })
  }

  const snapshot = await useFirestore()
    .collection('artigos')
    .where('slug', '==', slug)
    .where('status', '==', 'publicado')
    .limit(1)
    .get()

  if (snapshot.empty) {
    throw createError({ statusCode: 404, message: 'Artigo não encontrado.' })
  }

  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() }
})
