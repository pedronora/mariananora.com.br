import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type { Lead } from '#shared/utils/types'

let transporter: Transporter | null = null

export function getTransporter(): Transporter {
  if (transporter) return transporter
  const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass } = useRuntimeConfig()
  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER/SMTP_PASS não configurados.')
  }
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  })
  return transporter
}

const ASSUNTOS: Record<Lead['assunto'], string> = {
  agendamento: 'Agendamento de consulta',
  orientacao: 'Orientação Profissional',
  avaliacao: 'Avaliação Neuropsicológica',
  psicoterapia: 'Psicoterapia',
  outro: 'Outro assunto',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function contactEmailTemplate(lead: Lead): string {
  const assuntoLabel = escapeHtml(ASSUNTOS[lead.assunto] ?? lead.assunto)
  const nome = escapeHtml(lead.nome)
  const email = escapeHtml(lead.email)
  const telefone = escapeHtml(lead.telefone || '—')
  const mensagem = escapeHtml(lead.mensagem).replace(/\n/g, '<br>')
  const rows = [
    ['Nome', nome],
    ['E-mail', email],
    ['Telefone', telefone],
    ['Assunto', assuntoLabel],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 16px;width:130px;background:#f6f4f1;color:#5c4839;font-weight:600;border-bottom:1px solid #e9e3dc;font-size:13px;">${label}</td>
        <td style="padding:10px 16px;color:#3f342b;border-bottom:1px solid #e9e3dc;font-size:14px;">${value}</td>
      </tr>`,
    )
    .join('')

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nova mensagem do site</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f4f1;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4f1;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(34,27,21,0.08);">
            <tr>
              <td style="background:#10866f;padding:28px 32px;">
                <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;">Psicóloga Mariana Nora</p>
                <p style="margin:6px 0 0;font-size:13px;color:#d7ece0;">Nova mensagem recebida pelo site</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <p style="margin:0 0 18px;font-size:15px;color:#3f342b;line-height:1.6;">Você recebeu um novo contato do formulário do site. Seguem os dados:</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9e3dc;border-radius:10px;overflow:hidden;">
                  ${rows}
                  <tr>
                    <td style="padding:10px 16px;width:130px;background:#f6f4f1;color:#5c4839;font-weight:600;font-size:13px;">Mensagem</td>
                    <td style="padding:10px 16px;color:#3f342b;font-size:14px;line-height:1.6;">${mensagem}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 28px;">
                <a href="mailto:${email}" style="display:inline-block;background:#10866f;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 24px;border-radius:999px;">Responder para ${email}</a>
              </td>
            </tr>
            <tr>
              <td style="background:#3f342b;padding:20px 32px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#d3c6b9;">www.mariananora.com.br · ${site.crp} · Florianópolis/SC</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`
}

export async function sendContactEmail(lead: Lead) {
  const runtime = useRuntimeConfig()
  const subject = `[Site] Nova mensagem — ${lead.nome.replace(/[\r\n]+/g, ' ')}`
  await getTransporter().sendMail({
    from: `"${site.name}" <${runtime.smtpUser}>`,
    to: runtime.contactTo,
    replyTo: lead.email,
    subject,
    html: contactEmailTemplate(lead),
  })
}
