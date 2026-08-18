export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID não informado.' })
  }

  const ref = useFirestore().collection('artigos').doc(id)
  const doc = await ref.get()
  if (!doc.exists) {
    throw createError({ statusCode: 404, message: 'Artigo não encontrado.' })
  }

  return { id: doc.id, ...doc.data() }
})
