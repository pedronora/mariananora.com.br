# AGENTS.md

Site institucional da psicóloga Mariana Nora (mariananora.com.br), reconstruído do WordPress para Nuxt 4 (SSR) com Firebase.

## Stack e arquitetura

- **Nuxt 4.5 (SSR)** deployado na Vercel (preset `vercel` em `nuxt.config.ts`). Requer **Node 22+** — o preset vercel usa `Set.prototype.difference`; use o Node 24 do `.nvmrc` (`nvm use`).
- Frontend em `app/` (Nuxt 4 usa `app/`, não pasta raiz), backend em `server/` (Nitro). `shared/` tem utils/ tipos auto-importados nos dois lados (ex.: `site`, `especialidades`, tipos `Article`/`Lead`).
- **Firebase**: SDK web no cliente (config em `runtimeConfig.public.firebase`, inicializada em `app/plugins/firebase.client.ts`); `firebase-admin` no servidor (`server/utils/firebase-admin.ts`). Coleções Firestore: `leads` (formulário) e `artigos`. Storage: capa dos artigos em `artigos/*` e imagens do conteúdo em `artigos/inline/*` (upload via `app/composables/useUpload.ts`).
- **E-mail**: Nodemailer → SMTP Gmail (`server/utils/mailer.ts`). Envia para `CONTACT_TO` (default `psicologia@mariananora.com.br`).
- **Admin**: `/admin/**` com `ssr: false` (routeRules). Login via Firebase Auth (email/senha), autorização no servidor exige `ADMIN_EMAIL` (verifica token + e-mail verificado).

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção (gera .vercel/output)
npm run lint         # ESLint (flat config, @nuxt/eslint-config + prettier)
npm run lint:fix     # ESLint com --fix
npm run format       # Prettier --write .
npm run format:check # Prettier --check .
```

`npm install` funciona normalmente graças ao `.npmrc` com `legacy-peer-deps=true` (workaround de bug do npm).

## Variáveis de ambiente

`.env` (local) / Vercel (produção). Ver `.env.example`.

- `SMTP_USER` / `SMTP_PASS` — conta Gmail + **App Password** (senha normal do Gmail não funciona via SMTP).
- `CONTACT_TO` — destinatário dos formulários.
- `ADMIN_EMAIL` — único e-mail com permissão de admin.
- `FIREBASE_ADMIN_CREDENTIAL` — JSON da service account; **obrigatório para tudo que acessa Firestore** (`/api/artigos*`, `/api/admin/*`). Sem ela as rotas retornam 500. No local pode-se usar `GOOGLE_APPLICATION_CREDENTIALS`.
- `NUXT_PUBLIC_FIREBASE_API_KEY` — Web API key do Firebase (SDK cliente). Não é segredo (fica no bundle do navegador) — **não commitá-la**; no Vercel, adicionar em Production/Preview/Development, senão o Firebase não inicializa.

## Gotchas

- **Tailwind 4**: o plugin é registrado direto em `vite.plugins` (não via module). Estilos em `<style scoped>` que usam `@apply` precisam de `@reference "~/assets/css/main.css";` no topo.
- **CSS**: classes de composição (`btn`, `input-field`, etc.) são definidas com `@utility` no `main.css` (Tailwind 4 não permite `@apply` de classe CSS comum).
- **Proteção do admin**: `app/middleware/admin.ts` redireciona para `/admin/login` quem não está logado (defense-in-depth; o servidor continua sendo a autoridade via `requireAdmin`). Requests autenticados usam `app/composables/useAdminFetch.ts` (renova o ID token via `getIdToken()` a cada request e injeta `Authorization: Bearer`). O guard do layout `admin.vue` permanece como fallback.
- Conteúdo dos artigos é **HTML** produzido pelo editor **TipTap** (`app/components/admin/ArticleEditor.vue`, WYSIWYG, extensões StarterKit + Link + Image; imagens inline fazem upload para `artigos/inline/*` e também aceita colar Ctrl+V) e sanitizado no servidor com `sanitize-html` (`server/utils/sanitize.ts`, whitelist de tags; imagens inline `img` com `src/alt`; links `target="_blank"` ganham `rel="noopener noreferrer"`). Renderizado com `v-html` em `app/pages/artigos/[slug].vue` (lint desabilitado pontualmente). Validação do `conteudo` em `server/utils/validate.ts` conta texto ignorando tags.
- **Auto-import de componentes**: `admin/ArticleEditor.vue` é registrado como `AdminArticleEditor` (prefixo do diretório) — as páginas `app/pages/admin/editor*.vue` usam `<AdminArticleEditor />`. Usar o nome errado (`<ArticleEditor />`) faz o template cair em `resolveComponent` e o componente **não entra no bundle** (bug silencioso já encontrado uma vez).
- **Máscara de telefone** no formulário (`ContactForm.vue`): formatação progressiva `(00) 00000-0000` via `@input` (troca o `v-model` por `:value` + handler). Ao editar, só mexa ali.
- Formulário de contato tem rate-limit em memória (Map por IP) — reseta entre instâncias serverless.

## Referência de conteúdo

Textos/imagens replicados do WordPress atual. Dados fixos (endereço Ceisa Center, tel, horários, redes) em `shared/utils/site.ts`. Imagens locais em `public/img/`. As três imagens de especialidade (`especialidade-*.jpg`) e a imagem da seção "Marque sua consulta" (`agenda.jpg`) foram baixadas do **Unsplash** (licença livre, uso comercial sem atribuição) — especialidades em 3:2 para os cards, agenda em 4:3.
