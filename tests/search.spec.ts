import { describe, expect, it } from 'vitest'
import { matchesQuery, stripHtml } from '../server/utils/search'

describe('stripHtml', () => {
  it('remove tags HTML', () => {
    expect(stripHtml('<p>Olá</p>')).toBe(' Olá ')
  })

  it('retorna string vazia para undefined ou nulo', () => {
    expect(stripHtml(undefined)).toBe('')
    expect(stripHtml('')).toBe('')
  })

  it('mantém texto sem tags', () => {
    expect(stripHtml('apenas texto')).toBe('apenas texto')
  })
})

describe('matchesQuery', () => {
  it('é case-insensitive', () => {
    expect(matchesQuery(['Psicoterapia Online'], 'psicoterapia')).toBe(true)
    expect(matchesQuery(['Psicoterapia Online'], 'ONLINE')).toBe(true)
  })

  it('busca em múltiplos campos tratando undefined', () => {
    expect(matchesQuery([undefined, 'psicoterapia online'], 'psicoterapia')).toBe(true)
    expect(matchesQuery([undefined, undefined], 'algo')).toBe(false)
  })

  it('retorna true quando a busca está vazia', () => {
    expect(matchesQuery(['qualquer coisa'], '')).toBe(true)
    expect(matchesQuery(['qualquer coisa'], '   ')).toBe(true)
  })

  it('retorna false sem correspondência', () => {
    expect(matchesQuery(['orientação profissional'], 'avaliação')).toBe(false)
  })
})
