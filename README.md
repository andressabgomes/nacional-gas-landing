# Nacional Gás - Landing Page

Landing page para transição energética industrial com soluções em GLP.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (projeto configurado)

### Instalação

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`

## 📁 Estrutura do Projeto

```
.
├── src/                    # Código fonte da aplicação
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom hooks
│   ├── integrations/       # Integrações (Supabase)
│   └── lib/                # Utilitários
├── scripts/                # Scripts de desenvolvimento
│   ├── config.mjs          # Configuração centralizada
│   ├── check-database.mjs  # Verificar status do banco
│   ├── setup-database-api.mjs  # Gerar SQL de setup
│   └── test-rpc-insert.mjs # Testar inserção via RPC
├── sql/                    # Arquivos SQL
│   └── database-setup.sql  # Script de configuração do banco
├── docs/                   # Documentação
│   ├── DATABASE.md         # Documentação do banco de dados
│   └── SUPABASE.md         # Guia de configuração Supabase
└── supabase/               # Configuração Supabase
    └── migrations/         # Migrações do banco
```

## 🗄️ Banco de Dados

### Configuração Inicial

1. **Gere o arquivo SQL:**
   ```bash
   npm run db:sql
   ```

2. **Execute no Supabase:**
   - Acesse o SQL Editor: https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/sql
   - Abra o arquivo `sql/database-setup.sql`
   - Copie todo o conteúdo e cole no SQL Editor
   - Clique em "Run"

3. **Verifique o status:**
   ```bash
   npm run db:check
   ```

### Comandos Disponíveis

- `npm run db:check` - Verifica status do banco de dados
- `npm run db:sql` - Gera arquivo SQL de configuração
- `npm run db:test-rpc` - Testa inserção de leads via RPC

Para mais detalhes, consulte a [documentação do banco de dados](docs/DATABASE.md).

## 🔐 Configuração Supabase

Este projeto usa duas chaves do Supabase:

- **ANON_KEY** (Frontend): Para autenticação e operações normais
- **SERVICE_ROLE_KEY** (Backend/Scripts): Para operações administrativas

⚠️ **IMPORTANTE**: Nunca exponha a SERVICE_ROLE_KEY no frontend!

Para mais detalhes, consulte o [guia de configuração Supabase](docs/SUPABASE.md).

## 🛠️ Tecnologias

- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **React** - Biblioteca UI
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **Supabase** - Backend (Auth + Database)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
- `npm run db:check` - Verifica status do banco
- `npm run db:sql` - Gera arquivo SQL
- `npm run db:test-rpc` - Testa função RPC

## 🚀 Deploy

Este projeto pode ser deployado em qualquer plataforma de hospedagem estática:

- **Vercel** (Recomendado)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

Configure o build command como `npm run build` e o output directory como `dist`.

### Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente na plataforma de deploy:

- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Chave pública (ANON_KEY) do Supabase

## 📚 Documentação

- [Documentação do Banco de Dados](docs/DATABASE.md)
- [Guia de Configuração Supabase](docs/SUPABASE.md)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.
