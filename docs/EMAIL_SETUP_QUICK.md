# 📧 Configuração Rápida de Emails

## ⚡ Setup em 5 minutos

### 1. Criar conta no Resend (2 min)

1. Acesse [https://resend.com](https://resend.com)
2. Clique em **Sign Up** (pode usar GitHub/Google)
3. Vá em **API Keys** → **Create API Key**
4. Copie a chave (começa com `re_...`)

### 2. Configurar no Supabase (2 min)

1. Acesse: https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/settings/functions
2. Vá em **Edge Functions** → **Secrets**
3. Clique em **Add new secret**
4. Adicione:

   **Nome:** `RESEND_API_KEY`  
   **Valor:** `re_sua_chave_aqui` (cole a chave do Resend)

5. Clique em **Add new secret** novamente
6. Adicione:

   **Nome:** `BACKOFFICE_EMAIL`  
   **Valor:** `seu-email@exemplo.com` (email que receberá notificações)

### 3. Testar (1 min)

1. Execute localmente:
   ```bash
   npm run dev
   ```

2. Preencha o formulário de contato
3. Verifique se recebeu:
   - ✅ Email de confirmação no email do cliente
   - ✅ Email de notificação no email do backoffice

## ✅ Pronto!

A Edge Function já está deployada. Você só precisa configurar as variáveis de ambiente.

## 🔧 Troubleshooting

### Emails não estão sendo enviados?

1. **Verifique as variáveis de ambiente no Supabase:**
   - Confirme que `RESEND_API_KEY` está configurada
   - Confirme que `BACKOFFICE_EMAIL` está configurada

2. **Verifique os logs:**
   - Acesse: https://supabase.com/dashboard/project/epyfjifishhlkttfoifj/logs/edge-functions
   - Procure por erros relacionados ao Resend

3. **Teste a função:**
   ```bash
   npm run test:email
   ```

### Erro: "RESEND_API_KEY não configurada"

- Certifique-se de que a variável está configurada no Supabase Dashboard
- Após adicionar, aguarde alguns segundos para a propagação

## 📚 Documentação Completa

Para mais detalhes, consulte [EMAIL_SETUP.md](EMAIL_SETUP.md).

