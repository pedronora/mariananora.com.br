import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

async function uploadImage(file: File, folder: string, maxWidth: number): Promise<string> {
  const optimized = await resizeImage(file, { maxWidth })
  const storage = getStorage(useNuxtApp().$firebaseApp)
  const safeName = optimized.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${folder}/${Date.now()}-${safeName}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, optimized)
  return getDownloadURL(fileRef)
}

export function uploadCapa(file: File): Promise<string> {
  return uploadImage(file, 'artigos', 1600)
}

export function uploadArticleImage(file: File): Promise<string> {
  return uploadImage(file, 'artigos/inline', 1200)
}
