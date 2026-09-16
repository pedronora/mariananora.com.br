import { describe, expect, it } from 'vitest'
import { sanitizeContent } from '../server/utils/sanitize'

describe('sanitizeContent', () => {
  it('adiciona loading="lazy" em img sem o atributo', () => {
    const result = sanitizeContent('<img src="https://exemplo.com/imagem.jpg" alt="Teste">')
    expect(result).toContain('loading="lazy"')
  })

  it('preserva loading="eager" quando explicitamente definido', () => {
    const result = sanitizeContent('<img src="https://exemplo.com/imagem.jpg" loading="eager">')
    expect(result).toContain('loading="eager"')
    expect(result).not.toContain('loading="lazy"')
  })

  it('mantém loading="lazy" já existente', () => {
    const html = sanitizeContent('<img src="https://exemplo.com/imagem.jpg" loading="lazy">')
    expect(html).toContain('loading="lazy"')
    expect(html).not.toContain('loading="lazy" loading="lazy"')
  })

  it('removes tags fora da whitelist (script)', () => {
    const result = sanitizeContent('<script>alert("x")</script><p>ok</p>')
    expect(result).not.toContain('script')
    expect(result).toContain('<p>ok</p>')
  })

  it('acrescenta rel="noopener noreferrer" em link com target="_blank"', () => {
    const result = sanitizeContent('<a href="https://exemplo.com" target="_blank">link</a>')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it('não altera link sem target externo', () => {
    const html = '<a href="https://exemplo.com">link</a>'
    expect(sanitizeContent(html)).toBe(html)
  })
})
