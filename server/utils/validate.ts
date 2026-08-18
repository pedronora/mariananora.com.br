import { z } from 'zod'

export const leadSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().email('Informe um e-mail válido.'),
  telefone: z.string().trim().min(8, 'Informe um telefone válido.').max(25).optional().or(z.literal('')),
  assunto: z.enum(['agendamento', 'orientacao', 'avaliacao', 'psicoterapia', 'outro'], {
    message: 'Selecione um assunto.',
  }),
  mensagem: z.string().trim().min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.').max(2000),
})

export const articleSchema = z.object({
  titulo: z.string().trim().min(3).max(200),
  resumo: z.string().trim().min(10).max(500),
  conteudo: z
    .string()
    .trim()
    .refine((value) => value.replace(/<[^>]*>/g, '').trim().length >= 10, {
      message: 'Escreva um conteúdo com pelo menos 10 caracteres.',
    }),
  capa: z
    .string()
    .url('URL de capa inválida.')
    .refine((value) => /^https?:\/\//i.test(value), { message: 'URL de capa inválida.' })
    .optional()
    .or(z.literal('')),
  status: z.enum(['rascunho', 'publicado']),
})

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
