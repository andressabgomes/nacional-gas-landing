# 🔐 Configuração Supabase - Guia Completo

## 📋 Credenciais

As credenciais estão configuradas no arquivo `.env` e em `scripts/config.mjs`:

```javascript
SUPABASE_URL = "https://epyfjifishhlkttfoifj.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔑 Dois Clientes Obrigatórios

### 1. Cliente PÚBLICO (para autenticação e operações normais)
```javascript
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

### 2. Cliente ADMINISTRATIVO (para operações admin)
```javascript
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
```

## 📜 Regras Obrigatórias

### ✅ Cliente PÚBLICO (ANON_KEY) - Use para:
- ✅ `signup()` - Cadastro de usuários
- ✅ `login()` / `signInWithPassword()` - Login
- ✅ `signInWithOtp()` - Magic link / OTP
- ✅ `resetPasswordForEmail()` - Reset de senha
- ✅ `getUser()` - Obter usuário atual
- ✅ `signOut()` - Logout
- ✅ Chamadas RPC (ex: `insert_lead`)
- ✅ Operações normais do frontend (com RLS)

### ✅ Cliente ADMIN (SERVICE_ROLE_KEY) - Use para:
- ✅ Criar tabelas (migrations)
- ✅ Alterar schemas
- ✅ Criar/modificar RLS policies
- ✅ Inserts privilegiados (bypass RLS)
- ✅ Operações administrativas
- ✅ Verificar status do banco
- ✅ Contar registros sem RLS

### ❌ NUNCA:
- ❌ Use ANON_KEY para operações administrativas
- ❌ Use SERVICE_ROLE_KEY para login/signup
- ❌ Exponha SERVICE_ROLE_KEY no frontend
- ❌ Use SERVICE_ROLE_KEY em código cliente

## 📁 Estrutura de Arquivos

### Frontend (`src/`)
- `src/integrations/supabase/client.ts` → Usa `VITE_SUPABASE_PUBLISHABLE_KEY` (ANON_KEY do .env)
- `src/pages/Auth.tsx` → Usa cliente público para autenticação
- `src/hooks/useAuth.tsx` → Usa cliente público para autenticação
- `src/components/Contact.tsx` → Usa cliente público para chamar RPC `insert_lead`

### Scripts Server-side (`scripts/`)
- `scripts/config.mjs` → Configuração centralizada com ambas as keys
- `scripts/check-database.mjs` → Usa `admin` (SERVICE_ROLE_KEY)
- `scripts/test-rpc-insert.mjs` → Testa função RPC
- Todos os scripts server-side → Usam `admin` (SERVICE_ROLE_KEY)

## 📝 Exemplos

### ✅ Correto - Autenticação
```javascript
// Frontend ou script de autenticação
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Login
await supabase.auth.signInWithPassword({ email, password });
```

### ✅ Correto - Inserção de Lead (via RPC)
```javascript
// Frontend
import { supabase } from '@/integrations/supabase/client';

// Inserir lead via função RPC
const { data, error } = await supabase.rpc('insert_lead', {
  p_name: 'Nome',
  p_email: 'email@example.com',
  p_phone: '11999999999',
  p_company: 'Empresa',
  p_message: 'Mensagem'
});
```

### ✅ Correto - Operação Admin
```javascript
// Script server-side
import { createClient } from '@supabase/supabase-js';
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Insert privilegiado (bypass RLS)
await admin.from('leads').insert([data]);
```

### ❌ Errado - Não faça isso
```javascript
// ❌ NUNCA use SERVICE_ROLE_KEY para login
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
await admin.auth.signInWithPassword({ email, password }); // ERRADO!

// ❌ NUNCA use ANON_KEY para operações admin
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
await supabase.from('leads').delete().eq('id', id); // Pode falhar por RLS
```

## 🔍 Verificação

Sempre confirme:
- ✅ Operações AUTH usam `supabase` (cliente público com ANON_KEY)
- ✅ Operações ADMIN usam `admin` (cliente admin com SERVICE_ROLE_KEY)
- ✅ Frontend nunca usa SERVICE_ROLE_KEY
- ✅ Scripts server-side nunca usam ANON_KEY para operações admin
- ✅ Inserção de leads usa função RPC `insert_lead` (não inserção direta)

## 🧪 Teste de Conformidade

Execute para verificar se as regras estão sendo seguidas:

```bash
npm run db:check
npm run db:test-rpc
```

Estes comandos verificam:
1. Status do banco de dados
2. Se a função RPC está funcionando corretamente

