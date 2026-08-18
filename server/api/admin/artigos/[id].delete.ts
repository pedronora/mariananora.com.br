export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID não informado.' })
  }

  await useFirestore().collection('artigos').doc(id).delete()
  return { ok: true }
})
