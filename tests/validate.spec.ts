import { describe, expect, it } from 'vitest'
import { articleSchema, leadSchema, slugify } from '../server/utils/validate'

describe('slugify', () => {
  it('remove acentos e caracteres especiais', () => {
    expect(slugify('Avaliação Neuropsicológica!')).toBe('avaliacao-neuropsicologica')
  })

  it('normaliza espaços e maiúsculas', () => {
    expect(slugify('  Olá   Mundo  ')).toBe('ola-mundo')
  })

  it('remove hífens das bordas e limita a 80 caracteres', () => {
    expect(slugify('-psicoterapia-')).toBe('psicoterapia')
    expect(slugify('a'.repeat(100)).length).toBeLessThanOrEqual(80)
  })
})

describe('articleSchema', () => {
  const validArticle = {
    titulo: 'Ansiedade no dia a dia',
    resumo: 'Dicas práticas para lidar com a ansiedade no cotidiano.',
    conteudo: '<p>Texto do artigo com mais de dez caracteres.</p>',
    capa: 'https://firebasestorage.googleapis.com/imagem.jpg',
    status: 'publicado',
  }

  it('aceita um artigo válido', () => {
    expect(articleSchema.safeParse(validArticle).success).toBe(true)
  })

  it('rejeita título curto demais', () => {
    const result = articleSchema.safeParse({ ...validArticle, titulo: 'ab' })
    expect(result.success).toBe(false)
  })

  it('rejeita conteúdo com menos de 10 caracteres de texto', () => {
    const result = articleSchema.safeParse({ ...validArticle, conteudo: '<p>curto</p>' })
    expect(result.success).toBe(false)
  })

  it('rejeita URL de capa inválida', () => {
    const result = articleSchema.safeParse({ ...validArticle, capa: 'nao-e-uma-url' })
    expect(result.success).toBe(false)
  })

  it('aceita capa vazia', () => {
    const result = articleSchema.safeParse({ ...validArticle, capa: '' })
    expect(result.success).toBe(true)
  })
})

describe('leadSchema', () => {
  const validLead = {
    nome: 'Maria Silva',
    email: 'maria@exemplo.com',
    telefone: '(48) 99999-9999',
    assunto: 'agendamento',
    mensagem: 'Gostaria de agendar uma consulta.',
  }

  it('aceita um lead válido', () => {
    expect(leadSchema.safeParse(validLead).success).toBe(true)
  })

  it('aceita telefone ausente ou vazio', () => {
    const semTelefone = { ...validLead, telefone: undefined }
    const telefoneVazio = { ...validLead, telefone: '' }
    expect(leadSchema.safeParse(semTelefone).success).toBe(true)
    expect(leadSchema.safeParse(telefoneVazio).success).toBe(true)
  })

  it('rejeita e-mail inválido', () => {
    const result = leadSchema.safeParse({ ...validLead, email: 'nao-e-email' })
    expect(result.success).toBe(false)
  })

  it('rejeita mensagem curta demais', () => {
    const result = leadSchema.safeParse({ ...validLead, mensagem: 'oi' })
    expect(result.success).toBe(false)
  })
})
