interface ResizeOptions {
  maxWidth: number
  quality?: number
}

export async function resizeImage(file: File, options: ResizeOptions): Promise<File> {
  const { maxWidth, quality = 0.8 } = options

  if (!file.type.startsWith('image/')) return file

  const bitmap = await decode(file)
  if (!bitmap) return file

  try {
    const { width, height } = bitmap

    if (width <= maxWidth) return file

    const scale = maxWidth / width
    const targetWidth = Math.round(width * scale)
    const targetHeight = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)

    const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp')
    const mimeType = supportsWebP ? 'image/webp' : 'image/jpeg'
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, quality))
    if (!blob) return file

    const baseName = file.name.replace(/\.[^.]+$/, '')
    const ext = mimeType === 'image/webp' ? 'webp' : 'jpg'
    return new File([blob], `${baseName}.${ext}`, { type: mimeType })
  } finally {
    bitmap.close()
  }
}

async function decode(file: File): Promise<ImageBitmap | null> {
  try {
    return await createImageBitmap(file)
  } catch {
    return null
  }
}
