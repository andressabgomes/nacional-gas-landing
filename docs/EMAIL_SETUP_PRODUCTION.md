# 🚀 Configurar Domínio no Resend para Produção

## ⚠️ Limitação do Domínio de Teste

Atualmente, o sistema está usando o domínio de teste do Resend (`onboarding@resend.dev`). Isso significa que:

- ✅ **Email para backoffice funciona** - Você recebe notificações normalmente
- ⚠️ **Email para cliente limitado** - Só funciona se o email do cliente for o mesmo cadastrado no Resend

## 🎯 Solução: Configurar Domínio Verificado

Para enviar emails para qualquer destinatário, você precisa verificar um domínio no Resend.

### Passo 1: Adicionar Domínio no Resend

1. Acesse [https://resend.com/domains](https://resend.com/domains)
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `nacionalgas.com`)
4. Clique em **Add**

### Passo 2: Configurar DNS

O Resend fornecerá registros DNS que você precisa adicionar no seu provedor de domínio:

1. **SPF Record** - Para autenticação de email
2. **DKIM Records** - Para assinatura de email
3. **DMARC Record** (opcional) - Para políticas de email

**Exemplo de registros DNS:**

```
Tipo: TXT
Nome: @
Valor: v=spf1 include:_spf.resend.com ~all

Tipo: CNAME
Nome: resend._domainkey
Valor: resend._domainkey.resend.com

Tipo: TXT
Nome: _dmarc
Valor: v=DMARC1; p=none;
```

### Passo 3: Aguardar Verificação

- Após adicionar os registros DNS, aguarde a verificação (pode levar algumas horas)
- O Resend verificará automaticamente quando os registros estiverem corretos
- Você receberá um email quando o domínio for verificado

### Passo 4: Atualizar Edge Function

Após verificar o domínio, atualize a Edge Function:

1. Edite `supabase/functions/send-lead-emails/index.ts`
2. Altere a linha:

```typescript
// ANTES (domínio de teste)
const fromEmail = "onboarding@resend.dev";

// DEPOIS (domínio verificado)
const fromEmail = "Nacional Gás <noreply@nacionalgas.com>";
```

3. Faça redeploy da função:

```bash
# Via Supabase Dashboard ou CLI
supabase functions deploy send-lead-emails
```

## ✅ Após Configurar

Após verificar o domínio:

- ✅ Emails serão enviados para qualquer destinatário
- ✅ Emails terão remetente profissional (`noreply@nacionalgas.com`)
- ✅ Melhor taxa de entrega (menos chance de ir para spam)
- ✅ Sem limitações do domínio de teste

## 📊 Status Atual

- ✅ **Backoffice**: Recebendo emails normalmente
- ⚠️ **Clientes**: Limitado ao email cadastrado no Resend (até configurar domínio)

## 🔗 Links Úteis

- [Resend Domains](https://resend.com/domains)
- [Resend Documentation](https://resend.com/docs)
- [DNS Configuration Guide](https://resend.com/docs/dashboard/domains/introduction)

