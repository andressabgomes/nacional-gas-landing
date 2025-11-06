# 🚀 Configurar Repositório no GitHub

## Opção 1: Usando GitHub CLI (Recomendado)

### Pré-requisitos:
- GitHub CLI instalado: https://cli.github.com/
- Autenticado: `gh auth login`

### Passos:

1. **Execute o script:**
   ```bash
   npm run github:setup
   ```

2. **Siga as instruções** que aparecerem no terminal

---

## Opção 2: Manual (Mais Simples)

### Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `nacional-gas-landing` (ou o nome que preferir)
   - **Description:** `Landing Page Nacional Gás com gerenciador de leads`
   - **Visibility:** Escolha Público ou Privado
   - ⚠️ **NÃO marque** "Add a README file"
   - ⚠️ **NÃO marque** "Add .gitignore"
   - ⚠️ **NÃO marque** "Choose a license"
3. Clique em **"Create repository"**

### Passo 2: Conectar e Fazer Push

Execute os seguintes comandos no terminal:

```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

**Substitua:**
- `SEU_USUARIO` pelo seu username do GitHub
- `SEU_REPOSITORIO` pelo nome do repositório que você criou

---

## Opção 3: Usando GitHub Desktop

1. **Instale GitHub Desktop:** https://desktop.github.com/
2. **Faça login** com sua conta GitHub
3. **File → Add Local Repository**
4. Selecione a pasta do projeto
5. **Publish repository** no GitHub Desktop
6. Escolha nome, descrição e visibilidade
7. Clique em **"Publish repository"**

---

## ✅ Verificação

Após fazer push, verifique se está tudo certo:

1. Acesse seu repositório no GitHub
2. Verifique se todos os arquivos estão lá
3. Confirme que o `.env` **NÃO** está no repositório (está no .gitignore)

---

## 🔐 Importante: Variáveis de Ambiente

⚠️ **NUNCA** commite o arquivo `.env`!

O arquivo `.env` está no `.gitignore` e não será commitado. 

Para deploy, você precisará configurar as variáveis de ambiente na plataforma (Vercel/Netlify):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 📝 Próximos Passos

Após criar o repositório:

1. ✅ Faça deploy no Vercel/Netlify (veja `docs/DEPLOY.md`)
2. ✅ Configure as variáveis de ambiente na plataforma
3. ✅ Teste o site publicado

---

## 🆘 Problemas Comuns

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

### Erro: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Esqueceu de adicionar arquivos
```bash
git add .
git commit -m "Adicionar arquivos faltantes"
git push
```

