# mariananora.com.br

Site institucional da psicóloga Mariana Nora (Florianópolis/SC), reconstruído do WordPress para **Nuxt 4 (SSR)** com **Firebase**, deploy na **Vercel**.

## Stack

- **Nuxt 4.5** (SSR) + **Nitro** (backend em `server/`) — preset `vercel`
- **Firebase**: Auth (login admin), Firestore (`leads`, `artigos`), Storage (capas e imagens dos artigos)
- **TipTap** — editor WYSIWYG dos artigos (conteúdo em HTML, sanitizado com `sanitize-html` no servidor)
- **Nodemailer** → SMTP Gmail (formulário de contato)
- **Tailwind CSS 4** + **@nuxt/image**
- **Node 24** (obrigatório — preset vercel exige Node 22+; use `nvm use`)

## Requisitos

- Node 24 (`.nvmrc`)
- Conta Gmail com **App Password** para o SMTP
- Projeto Firebase (`piscomariana`) com service account

## Setup

```bash
nvm use
npm install          # .npmrc já define legacy-peer-deps=true
cp .env.example .env # preencher SMTP_USER, SMTP_PASS, ADMIN_EMAIL, FIREBASE_ADMIN_CREDENTIAL, NUXT_PUBLIC_FIREBASE_API_KEY
npm run dev
```

No local, `FIREBASE_ADMIN_CREDENTIAL` pode ser substituída por `GOOGLE_APPLICATION_CREDENTIALS` apontando para o JSON da service account.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção (gera .vercel/output)
npm run lint         # ESLint
npm run lint:fix     # ESLint --fix
npm run format       # Prettier --write .
npm run format:check # Prettier --check .
npm run firebase:verify # marca o e-mail do admin como verificado (uma única vez)
```

## Variáveis de ambiente

Ver `.env.example`:

- `SMTP_USER` / `SMTP_PASS` — conta Gmail + App Password (senha normal do Gmail não funciona via SMTP)
- `CONTACT_TO` — destinatário dos formulários (default `psicologia@mariananora.com.br`)
- `ADMIN_EMAIL` — único e-mail com permissão de admin
- `FIREBASE_ADMIN_CREDENTIAL` — JSON da service account em **uma única linha** (ou base64); obrigatório em produção, sem ele `/api/artigos*` e `/api/admin/*` retornam 500. No local, `GOOGLE_APPLICATION_CREDENTIALS` serve como alternativa.
- `NUXT_PUBLIC_FIREBASE_API_KEY` — Web API key do Firebase (SDK cliente). Pública por design, mas **não commitar** (secret scanning do GitHub); adicionar em Production/Preview/Development na Vercel. Recomendado restringir por domínio no console.

## Firebase (preparação)

1. **Auth** → Sign-in method: habilitar **E-mail/Senha**; criar o usuário de `ADMIN_EMAIL` no Console (Auth → Users). Em **E-mail/Senha**, **desabilitar o cadastro público** (desmarcar "Create accounts / criar contas") — só usuários criados no Console conseguem entrar.
2. **Marcar o e-mail como verificado** — o Console não verifica e-mail de usuários criados manualmente, e o servidor exige `email_verified`:
   ```bash
   npm run firebase:verify
   ```
3. **Firestore** (regras restritivas — o cliente não acessa Firestore diretamente):
   ```
   rules_version = '2';
   service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if false; } } }
   ```
4. **Firestore → Indexes**: criar os índices compostos (o erro de cada query fornece o link direto do Console):
   - listagem pública: `artigos` `status` ASC, `atualizadoEm` DESC
   - página do artigo: `artigos` `slug` ASC, `status` ASC
5. **Storage** (leitura pública; escrita só pelo e-mail admin, imagens até 5 MB):
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /artigos/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null
           && request.auth.token.email == 'psicologia@mariananora.com.br'
           && request.resource.size < 5 * 1024 * 1024
           && request.resource.contentType.matches('image/(jpeg|png|webp)');
       }
     }
   }
   ```
6. Confirmar que `storageBucket` em `nuxt.config.ts` (`runtimeConfig.public.firebase`) é o bucket real do projeto (formato `.firebasestorage.app`).

## Deploy (Vercel)

- Importar o repositório; definir **Node 24** no projeto (o preset vercel usa `Set.prototype.difference`, exige 22+).
- Configurar as mesmas variáveis de ambiente (incluindo `FIREBASE_ADMIN_CREDENTIAL` com o JSON completo e `NUXT_PUBLIC_FIREBASE_API_KEY`).
- Apontar o domínio `mariananora.com.br` (SSL automático).
- **Speed Insights**: o módulo `@vercel/speed-insights` já está no projeto; habilitar em Vercel → Project Settings → Analytics.

## Pós-go-live

- Repetir os testes em produção: formulário (e-mail chega), admin (login, criar/publicar artigo com capa e imagem inline), páginas públicas.
- Publicar o conteúdo inicial (2–3 artigos).
- SEO: OG tags (`og:title`/`og:description`/`og:url`/`og:image`) já implementadas nas páginas; re-scrapear as prévias de compartilhamento (WhatsApp/opengraph.xyz — testar com `?v=` para furar o cache) e conferir `/robots.txt` e indexação (Google Search Console).
- Testar mobile (formulário, menu, imagens) e performance.
- Verificar os alertas de segurança do GitHub (Security → Alerts) no repo público.

## Estrutura

- `app/` — frontend (páginas, componentes, composables, plugins)
- `server/` — API Nitro (`/api/contato`, `/api/artigos*` com `?q` para busca, `/api/admin/artigos*`, `/api/admin/leads`) e utils (`auth`, `mailer`, `sanitize`, `validate`, `search`, `firebase-admin`)
- `shared/` — dados e tipos compartilhados (`site`, `especialidades`, `Article`/`Lead`)
- `public/img/` — imagens locais; especialidades vêm do Unsplash (licença livre)

A **busca** (`?q`) é feita em memória no Nitro (`server/utils/search.ts`, case-insensitive, casa em título/resumo/autor/slug/conteúdo sem tags) nas listagens de artigos pública e admin e nas mensagens do admin.
