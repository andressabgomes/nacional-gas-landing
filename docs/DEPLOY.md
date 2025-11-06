# 🚀 Guia de Deploy Temporário

Este guia mostra como publicar o projeto de forma temporária e gratuita.

## 📋 Pré-requisitos

- Conta no GitHub (para opções 1 e 2)
- Projeto commitado no GitHub
- Variáveis de ambiente do Supabase configuradas

## 🎯 Opção 1: Vercel (Recomendado - Mais Rápido)

### Passos:

1. **Acesse:** https://vercel.com
2. **Faça login** com sua conta GitHub
3. **Clique em "Add New Project"**
4. **Importe seu repositório** do GitHub
5. **Configure o projeto:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Adicione as variáveis de ambiente:**
   - `VITE_SUPABASE_URL` = `https://epyfjifishhlkttfoifj.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sua_anon_key_aqui`

7. **Clique em "Deploy"**

✅ **Pronto!** Seu site estará online em ~2 minutos em uma URL como: `https://seu-projeto.vercel.app`

### Vantagens:
- ⚡ Deploy em segundos
- 🔄 Deploy automático a cada push
- 🌍 CDN global
- 💰 Totalmente gratuito
- 🔗 URL personalizada

---

## 🎯 Opção 2: Netlify

### Passos:

1. **Acesse:** https://netlify.com
2. **Faça login** com sua conta GitHub
3. **Clique em "Add new site" → "Import an existing project"**
4. **Selecione seu repositório** do GitHub
5. **Configure o build:**
   - Build command: `npm run build`
   - Publish directory: `dist`

6. **Adicione as variáveis de ambiente:**
   - Vá em: Site settings → Environment variables
   - Adicione:
     - `VITE_SUPABASE_URL` = `https://epyfjifishhlkttfoifj.supabase.co`
     - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sua_anon_key_aqui`

7. **Clique em "Deploy site"**

✅ **Pronto!** Seu site estará online em uma URL como: `https://seu-projeto.netlify.app`

### Vantagens:
- ⚡ Deploy rápido
- 🔄 Deploy automático
- 🌍 CDN global
- 💰 Totalmente gratuito
- 🔗 URL personalizada

---

## 🎯 Opção 3: GitHub Pages (Via GitHub Actions)

### Passos:

1. **Crie o arquivo `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. **Configure os secrets no GitHub:**
   - Vá em: Settings → Secrets and variables → Actions
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

3. **Habilite GitHub Pages:**
   - Vá em: Settings → Pages
   - Source: `GitHub Actions`

✅ **Pronto!** Seu site estará em: `https://seu-usuario.github.io/seu-repositorio`

---

## 🎯 Opção 4: Cloudflare Pages

### Passos:

1. **Acesse:** https://pages.cloudflare.com
2. **Faça login** com sua conta
3. **Conecte seu repositório** do GitHub
4. **Configure o build:**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`

5. **Adicione as variáveis de ambiente:**
   - Vá em: Settings → Environment variables
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

6. **Clique em "Save and Deploy"**

✅ **Pronto!** Seu site estará online em uma URL como: `https://seu-projeto.pages.dev`

---

## 🔐 Configuração das Variáveis de Ambiente

Todas as plataformas precisam das seguintes variáveis:

```
VITE_SUPABASE_URL=https://epyfjifishhlkttfoifj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key_aqui
```

⚠️ **IMPORTANTE:** Use apenas a `ANON_KEY` (chave pública), nunca a `SERVICE_ROLE_KEY`!

---

## 📝 Checklist Antes do Deploy

- [ ] Projeto commitado no GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando (`npm run build`)
- [ ] Testado localmente (`npm run dev`)

---

## 🚀 Deploy Rápido (Vercel CLI)

Se você tem o Vercel CLI instalado:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Deploy em produção
vercel --prod
```

---

## 🔗 Links Úteis

- **Vercel:** https://vercel.com
- **Netlify:** https://netlify.com
- **Cloudflare Pages:** https://pages.cloudflare.com
- **GitHub Pages:** https://pages.github.com

---

## 💡 Recomendação

Para deploy temporário rápido, recomendo **Vercel**:
- ⚡ Mais rápido de configurar
- 🔄 Deploy automático
- 🌍 CDN global
- 💰 Totalmente gratuito
- 📊 Analytics incluído

