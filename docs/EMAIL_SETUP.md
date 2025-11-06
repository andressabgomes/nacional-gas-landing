# 📧 Configuração de Envio de Emails

Este projeto usa **Resend** para enviar emails de confirmação para clientes e notificações para o backoffice quando um novo lead é criado.

## 🚀 Configuração Inicial

### 1. Criar conta no Resend

1. Acesse [https://resend.com](https://resend.com)
2. Crie uma conta gratuita (100 emails/dia no plano gratuito)
3. Vá em **API Keys** e crie uma nova chave
4. Copie a chave API (começa com `re_...`)

### 2. Configurar domínio (Opcional, mas recomendado)

Para usar um domínio personalizado (ex: `noreply@nacionalgas.com`):

1. No Resend, vá em **Domains**
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Aguarde a verificação (pode levar algumas horas)

**Nota:** Sem configurar domínio, você pode usar o domínio de teste do Resend: `onboarding@resend.dev` (apenas para desenvolvimento).

### 3. Configurar variáveis de ambiente no Supabase

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/settings/functions
2. Vá em **Edge Functions** → **Secrets**
3. Adicione as seguintes variáveis:

```
RESEND_API_KEY=re_sua_chave_aqui
BACKOFFICE_EMAIL=seu-email@exemplo.com
```

**Importante:** Substitua:
- `re_sua_chave_aqui` pela sua chave API do Resend
- `seu-email@exemplo.com` pelo email que receberá notificações de novos leads

### 4. Edge Function já está deployada! ✅

A Edge Function `send-lead-emails` já foi deployada automaticamente. Você só precisa configurar as variáveis de ambiente no Supabase.

**Nota:** Se precisar fazer redeploy manualmente, você pode usar o Supabase CLI:

```bash
supabase functions deploy send-lead-emails
```

## 📋 Como Funciona

### Fluxo de Envio de Emails

1. **Cliente preenche o formulário** → Dados são salvos no banco via `insert_lead`
2. **Frontend chama Edge Function** → `send-lead-emails` é invocada com os dados do lead
3. **Edge Function envia 2 emails:**
   - **Email de confirmação** para o cliente
   - **Email de notificação** para o backoffice

### Templates de Email

#### Email para o Cliente
- **Assunto:** "Recebemos sua mensagem - Nacional Gás"
- **Conteúdo:** Confirmação de recebimento com resumo dos dados

#### Email para o Backoffice
- **Assunto:** "Novo Lead: [Nome] - [Empresa]"
- **Conteúdo:** Detalhes completos do lead com link para o sistema admin

## 🧪 Testar Localmente

### 1. Configurar variáveis de ambiente local

Crie um arquivo `.env.local` (não commitado):

```env
RESEND_API_KEY=re_sua_chave_aqui
BACKOFFICE_EMAIL=seu-email@exemplo.com
```

### 2. Testar a Edge Function localmente

```bash
# Iniciar Supabase local (se ainda não estiver rodando)
supabase start

# Fazer deploy local da função
supabase functions deploy send-lead-emails --no-verify-jwt

# Testar a função
curl -X POST http://localhost:54321/functions/v1/send-lead-emails \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "11999999999",
    "company": "Empresa Teste",
    "message": "Mensagem de teste",
    "created_at": "2024-01-01T00:00:00Z"
  }'
```

### 3. Testar no frontend

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Preencha o formulário de contato
3. Verifique se os emails foram enviados:
   - Cliente recebe email de confirmação
   - Backoffice recebe email de notificação

## 🔧 Troubleshooting

### Emails não estão sendo enviados

1. **Verifique as variáveis de ambiente:**
   - Confirme que `RESEND_API_KEY` está configurada no Supabase
   - Confirme que `BACKOFFICE_EMAIL` está configurada

2. **Verifique os logs da Edge Function:**
   - Acesse: https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/logs/edge-functions
   - Procure por erros relacionados ao Resend

3. **Verifique a chave API do Resend:**
   - Confirme que a chave está ativa no Resend
   - Verifique se não excedeu o limite de emails (100/dia no plano gratuito)

### Erro: "RESEND_API_KEY não configurada"

- Certifique-se de que a variável está configurada no Supabase Dashboard
- Após adicionar, faça redeploy da Edge Function

### Emails indo para spam

- Configure um domínio personalizado no Resend
- Configure SPF, DKIM e DMARC no DNS do domínio
- Use um endereço de email profissional

## 📊 Monitoramento

### Verificar emails enviados no Resend

1. Acesse [https://resend.com/emails](https://resend.com/emails)
2. Veja o histórico de emails enviados
3. Verifique status de entrega e possíveis erros

### Logs no Supabase

1. Acesse: https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/logs/edge-functions
2. Filtre por `send-lead-emails`
3. Veja logs detalhados de cada execução

## 🔒 Segurança

- ⚠️ **NUNCA** commite a `RESEND_API_KEY` no código
- ⚠️ Use apenas variáveis de ambiente do Supabase para armazenar a chave
- ⚠️ A Edge Function valida os dados antes de enviar emails
- ⚠️ O email do backoffice é configurável via variável de ambiente

## 📝 Personalização

### Modificar templates de email

Edite o arquivo `supabase/functions/send-lead-emails/index.ts`:

- Modifique `clientEmailHtml` para alterar o email do cliente
- Modifique `backofficeEmailHtml` para alterar o email do backoffice

### Adicionar mais destinatários

Para enviar para múltiplos emails do backoffice, modifique a função:

```typescript
to: [BACKOFFICE_EMAIL, "outro-email@exemplo.com"],
```

## 🚀 Próximos Passos

- [ ] Configurar domínio personalizado no Resend
- [ ] Personalizar templates de email com logo e cores da empresa
- [ ] Adicionar mais informações no email do backoffice
- [ ] Implementar retry automático em caso de falha
- [ ] Adicionar analytics de abertura de emails

