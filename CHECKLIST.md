# Checklist externo — deixar o site no ar

Passos que dependem de contas/config (Firebase, Vercel, Gmail). Ordem recomendada.

## 0. Pré-requisitos de conta

- [ ] Acesso ao **Firebase Console** (projeto `piscomariana`)
- [ ] Acesso à **Vercel** e ao domínio `mariananora.com.br`
- [ ] **App Password** do Gmail em https://myaccount.google.com/apppasswords (2FA ativa; senha normal não funciona via SMTP)

## 1. Ambiente local (`.env`)

- [ ] `cp .env.example .env`
- [ ] `SMTP_USER` / `SMTP_PASS` — conta Gmail + App Password
- [ ] `CONTACT_TO` — `psicologia@mariananora.com.br`
- [ ] `ADMIN_EMAIL` — e-mail com permissão de admin
- [ ] `FIREBASE_ADMIN_CREDENTIAL` — JSON da service account:
  - Firebase Console → ⚙️ Configurações do projeto → Contas de serviço → _Gerar nova chave privada_
  - Colar o JSON em **uma única linha** (minificado) ou **base64** — JSON multi-linha quebra o `.env`
  - Alternativa local: exportar `GOOGLE_APPLICATION_CREDENTIALS` com o caminho do arquivo
- [ ] (Recomendado) **commit inicial** do repo antes de seguir

## 2. Firebase Console

- [ ] **Auth** → Sign-in method → habilitar **E-mail/Senha**
- [ ] **Auth** → Sign-in method → em **E-mail/Senha**, **desabilitar o cadastro público** (desmarcar "Create accounts / criar contas"); assim só usuários criados no Console conseguem entrar
- [ ] **Auth** → Users → **criar** o usuário de `ADMIN_EMAIL`
- [ ] **Marcar o e-mail como verificado** (o Console não verifica usuários criados manualmente; sem isso `/api/admin/*` retorna 401):
  ```bash
  npm run firebase:verify
  ```
- [ ] **Firestore** → regras restritivas (o cliente não acessa Firestore direto):
  ```js
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if false;
      }
    }
  }
  ```
- [ ] **Firestore** → **Indexes**: criar os índices compostos (o erro de cada query fornece o link direto do Console):
  - listagem pública: `artigos` `status` ASC, `atualizadoEm` DESC
  - página do artigo: `artigos` `slug` ASC, `status` ASC
- [ ] **Storage** → regras (escrita só pelo e-mail admin, imagem até 5 MB, leitura pública):
  ```js
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
- [ ] **Conferir o `storageBucket`**: o config em `nuxt.config.ts` usa `piscomariana.firebasestorage.app`. Verificar na console qual é o bucket real (Pode ser `.appspot.com`). Se divergir, atualizar `runtimeConfig.public.firebase.storageBucket`.

## 3. Validação local

- [ ] `npm run dev`
- [ ] **Formulário**: enviar contato e confirmar que o e-mail chega no `CONTACT_TO`
- [ ] **Admin**: logar em `/admin` (credenciais do passo 2), criar artigo com o editor (negrito, lista, link, **imagem inline**, capa), publicar e conferir em `/artigos`
- [ ] **Imagens**: upload de capa e inline funcionando (testa regras do Storage + bucket)

## 4. Deploy na Vercel

- [ ] Importar o repositório (Vercel detecta o preset `vercel`)
- [ ] Definir **Node 24** no projeto (Settings → Node.js Version; o preset usa `Set.prototype.difference`, exige 22+)
- [ ] Configurar as **mesmas env vars** do `.env` (em produção `FIREBASE_ADMIN_CREDENTIAL` obrigatória — JSON completo, sem quebras de linha)
- [ ] Apontar o domínio `mariananora.com.br` + DNS (A/AAAA ou CNAME) e aguardar SSL
- [ ] Deploy + conferir no log que o build passou

## 5. Pós-go-live

- [ ] Repetir os testes do passo 3 em **produção**
- [ ] Publicar conteúdo inicial (2–3 artigos)
- [ ] Verificar SEO: título/descrição, `/robots.txt`, indexação (Google Search Console)
- [ ] Testar mobile (formulário, menu, imagens) e performance
