export type ArticleStatus = 'rascunho' | 'publicado'

export interface Article {
  id: string
  slug: string
  titulo: string
  resumo: string
  conteudo: string
  capa?: string
  status: ArticleStatus
  autor: string
  criadoEm: string
  atualizadoEm: string
}

export interface Lead {
  nome: string
  email: string
  telefone: string
  assunto: string
  mensagem: string
  criadoEm: string
}

export interface LeadWithId extends Lead {
  id: string
}

export interface LeadsPage {
  leads: LeadWithId[]
  nextAfter: string | null
}
