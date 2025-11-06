# 🗄️ Banco de Dados - Documentação Completa

## ✅ Status Atual

**Banco de dados configurado e pronto para uso!**

- ✅ Tabela `leads` criada
- ✅ Tabela `profiles` criada  
- ✅ Tabela `user_roles` criada
- ✅ Funções criadas
- ✅ Políticas RLS configuradas
- ✅ Função RPC `insert_lead` criada para inserção de leads

## 📊 Estrutura do Banco

### Tabelas

1. **`leads`** - Armazena leads do formulário de contato
   - Campos: `id`, `name`, `email`, `phone`, `company`, `message`, `status`, `created_at`, `updated_at`
   - Política: Qualquer um pode inserir via função RPC, apenas admins podem visualizar/editar/deletar

2. **`profiles`** - Perfis de usuários
   - Campos: `id`, `email`, `created_at`
   - Criado automaticamente quando um usuário se registra (via trigger)

3. **`user_roles`** - Roles de usuários
   - Campos: `id`, `user_id`, `role` (admin/user)
   - Usado para controlar acesso administrativo

### Funções

- `has_role(_user_id UUID, _role app_role)` - Verifica se um usuário tem um role específico
- `handle_new_user()` - Cria perfil automaticamente quando um usuário se registra
- `update_updated_at_column()` - Atualiza o campo `updated_at` automaticamente
- `insert_lead(...)` - Função RPC para inserir leads (bypass RLS via SECURITY DEFINER)

### Enums

- `app_role` - Enum com valores: `'admin'`, `'user'`

### Políticas RLS (Row Level Security)

- **leads**: Inserção via função RPC `insert_lead`, apenas admins podem visualizar/editar/deletar
- **profiles**: Usuários podem visualizar apenas seu próprio perfil
- **user_roles**: Usuários podem visualizar apenas seus próprios roles

## 🚀 Configuração

### Método 1: SQL Editor (Recomendado)

1. **Acesse o SQL Editor do Supabase:**
   - URL: https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/sql

2. **Execute o script SQL:**
   - Abra o arquivo `sql/database-setup.sql`
   - Copie **todo o conteúdo** do arquivo
   - Cole no SQL Editor do Supabase
   - Clique em **"Run"**

3. **Verifique se tudo foi criado:**
   - Vá em: Dashboard → Table Editor
   - Você deve ver as tabelas: `leads`, `profiles`, `user_roles`

## 📋 Comandos Disponíveis

### Verificar Status do Banco
```bash
npm run db:check
```
Verifica se todas as tabelas estão criadas e mostra estatísticas.

### Gerar Arquivo SQL
```bash
npm run db:sql
```
Gera o arquivo `sql/database-setup.sql` com todo o SQL necessário.

### Testar Inserção via RPC
```bash
npm run db:test-rpc
```
Testa a função RPC `insert_lead` para verificar se está funcionando.

## 👤 Criar Usuário Admin

1. **Registre um usuário** através da aplicação ou do dashboard do Supabase:
   - Dashboard → Authentication → Users → Add User

2. **Encontre o USER_ID:**
   - Vá em: Dashboard → Authentication → Users
   - Copie o UUID do usuário desejado

3. **Execute este SQL no SQL Editor** (substitua `USER_ID_AQUI` pelo ID do usuário):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_AQUI', 'admin');
```

**Exemplo:**
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'admin');
```

Após executar, o usuário terá acesso à área administrativa da aplicação.

## 🔗 Links Úteis

- **SQL Editor:** https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/sql
- **Table Editor:** https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/editor
- **Authentication:** https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/auth/users

## 🆘 Problemas Comuns

### Erro: "relation already exists"
- Isso significa que algumas tabelas já existem
- Você pode ignorar este erro ou dropar as tabelas existentes antes de executar novamente

### Erro: "permission denied"
- Verifique se você está usando a conta correta do Supabase
- Certifique-se de ter permissões de administrador no projeto

### Erro: "function already exists"
- As funções já foram criadas anteriormente
- Isso é normal se você já executou a migração antes

## 📝 Notas

- O arquivo `sql/database-setup.sql` contém todo o SQL necessário para configurar o banco
- As políticas RLS garantem que apenas usuários autorizados possam acessar os dados
- O trigger `on_auth_user_created` cria automaticamente um perfil quando um usuário se registra
- A função RPC `insert_lead` permite inserção de leads via frontend usando ANON_KEY

