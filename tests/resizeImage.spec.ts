import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resizeImage } from '../app/composables/useImageResize'

interface MockBitmap {
  width: number
  height: number
  close: ReturnType<typeof vi.fn>
}

interface MockCanvas {
  width: number
  height: number
  getContext: ReturnType<typeof vi.fn>
  toDataURL: ReturnType<typeof vi.fn>
  toBlob: ReturnType<typeof vi.fn>
}

let lastCanvas: MockCanvas | null
let bitmapCloseMock: ReturnType<typeof vi.fn> | null

function createCanvasMock(dataUrl: string): MockCanvas {
  return {
    width: 0,
    height: 0,
    getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
    toDataURL: vi.fn().mockReturnValue(dataUrl),
    toBlob: vi.fn().mockImplementation((cb: (blob: Blob | null) => void, mimeType: string) => {
      cb(new Blob(['x'], { type: mimeType }))
    }),
  }
}

function stubBrowserApis(bitmap: MockBitmap, dataUrl: string) {
  lastCanvas = createCanvasMock(dataUrl)
  bitmapCloseMock = bitmap.close
  vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap))
  vi.stubGlobal('document', { createElement: () => lastCanvas })
}

beforeEach(() => {
  lastCanvas = null
  bitmapCloseMock = null
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('resizeImage', () => {
  it('retorna o mesmo arquivo para tipos não-imagem', async () => {
    const file = new File(['dado'], 'nota.txt', { type: 'text/plain' })
    const result = await resizeImage(file, { maxWidth: 1600 })
    expect(result).toBe(file)
  })

  it('retorna o mesmo arquivo quando o decode falha', async () => {
    stubBrowserApis({ width: 4000, height: 3000, close: vi.fn() }, 'data:image/webp')
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('decode fail')))
    const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' })

    const result = await resizeImage(file, { maxWidth: 1600 })

    expect(result).toBe(file)
  })

  it('retorna o mesmo arquivo quando a largura já é menor ou igual ao maxWidth', async () => {
    stubBrowserApis({ width: 800, height: 600, close: vi.fn() }, 'data:image/webp')
    const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' })

    const result = await resizeImage(file, { maxWidth: 1600 })

    expect(result).toBe(file)
  })

  it('redimensiona para maxWidth, escala a altura e converte para WebP', async () => {
    stubBrowserApis({ width: 4000, height: 3000, close: vi.fn() }, 'data:image/webp')
    const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' })

    const result = await resizeImage(file, { maxWidth: 1600 })

    expect(lastCanvas?.width).toBe(1600)
    expect(lastCanvas?.height).toBe(1200)
    expect(result.name).toBe('foto.webp')
    expect(result.type).toBe('image/webp')
    expect(bitmapCloseMock).toHaveBeenCalled()
  })

  it('preserva o nome base quando há múltiplos pontos', async () => {
    stubBrowserApis({ width: 4000, height: 3000, close: vi.fn() }, 'data:image/webp')
    const file = new File(['x'], 'foto.teste.jpg', { type: 'image/jpeg' })

    const result = await resizeImage(file, { maxWidth: 1600 })

    expect(result.name).toBe('foto.teste.webp')
  })

  it('cai para JPEG quando o canvas não suporta WebP', async () => {
    stubBrowserApis({ width: 4000, height: 3000, close: vi.fn() }, 'data:image/png')
    const file = new File(['x'], 'foto.png', { type: 'image/png' })

    const result = await resizeImage(file, { maxWidth: 1600 })

    expect(result.name).toBe('foto.jpg')
    expect(result.type).toBe('image/jpeg')
  })

  it('retorna o mesmo arquivo quando toBlob devolve null', async () => {
    lastCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toDataURL: vi.fn().mockReturnValue('data:image/webp'),
      toBlob: vi.fn().mockImplementation((cb: (blob: Blob | null) => void) => cb(null)),
    }
    bitmapCloseMock = vi.fn()
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 4000, height: 3000, close: bitmapCloseMock }))
    vi.stubGlobal('document', { createElement: () => lastCanvas })
    const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' })

    const result = await resizeImage(file, { maxWidth: 1600 })

    expect(result).toBe(file)
  })
})
