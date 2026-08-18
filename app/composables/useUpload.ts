import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

async function uploadImage(file: File, folder: string): Promise<string> {
  const storage = getStorage(useNuxtApp().$firebaseApp)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${folder}/${Date.now()}-${safeName}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

export function uploadCapa(file: File): Promise<string> {
  return uploadImage(file, 'artigos')
}

export function uploadArticleImage(file: File): Promise<string> {
  return uploadImage(file, 'artigos/inline')
}
