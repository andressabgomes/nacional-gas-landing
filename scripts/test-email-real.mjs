import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.mjs';

// Testar envio de emails com email real do usuário
const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Perguntar qual email usar para teste
const testEmail = process.argv[2];

if (!testEmail) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Teste de Envio de Email Real');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📝 Uso: node scripts/test-email-real.mjs <seu-email@exemplo.com>\n');
  console.log('Exemplo: node scripts/test-email-real.mjs seu-email@gmail.com\n');
  process.exit(1);
}

async function testEmailReal() {
  console.log('🧪 Testando envio de email real...\n');
  console.log(`📧 Email de teste: ${testEmail}\n`);
  
  // Primeiro, criar um lead de teste
  try {
    console.log('1. Criando lead de teste...');
    const { data: leadData, error: leadError } = await supabase.rpc('insert_lead', {
      p_name: 'Teste Email Real',
      p_email: testEmail,
      p_phone: '11999999999',
      p_company: 'Empresa Teste',
      p_message: 'Este é um teste de envio de email real'
    });
    
    if (leadError) {
      console.error('   ❌ Erro ao criar lead:', leadError.message);
      return;
    }
    
    console.log('   ✅ Lead criado:', leadData.id);
    console.log('   📋 Dados do lead:', JSON.stringify(leadData, null, 2));
    
    // Agora testar a Edge Function
    console.log('\n2. Chamando Edge Function send-lead-emails...');
    const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-lead-emails', {
      body: leadData
    });
    
    if (emailError) {
      console.error('   ❌ Erro ao enviar emails:', emailError.message);
      console.error('   📊 Detalhes:', JSON.stringify(emailError, null, 2));
    } else {
      console.log('   ✅ Processamento concluído!');
      console.log('   📋 Resposta:', JSON.stringify(emailResponse, null, 2));
      
      if (emailResponse?.backofficeEmailSent) {
        console.log('\n   ✅ Email para backoffice enviado com sucesso!');
        console.log('   📧 ID do email:', emailResponse.backofficeEmailId);
        console.log('   💡 Verifique sua caixa de entrada (e spam)');
      } else {
        console.log('\n   ⚠️ Email para backoffice NÃO foi enviado');
        console.log('   📊 Erro:', emailResponse?.backofficeEmailError);
      }
      
      if (emailResponse?.clientEmailSent) {
        console.log('\n   ✅ Email para cliente enviado com sucesso!');
        console.log('   📧 ID do email:', emailResponse.clientEmailId);
        console.log('   💡 Verifique a caixa de entrada de:', testEmail);
      } else if (emailResponse?.clientEmailSkipped) {
        console.log('\n   ⚠️ Email para cliente pulado (domínio de teste)');
        console.log('   💡 Configure um domínio verificado no Resend para enviar para qualquer email');
      } else {
        console.log('\n   ⚠️ Email para cliente NÃO foi enviado');
        console.log('   📊 Erro:', emailResponse?.clientEmailError);
      }
    }
    
    // Limpar lead de teste usando admin
    console.log('\n3. Removendo lead de teste...');
    const admin = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    await admin.from('leads').delete().eq('id', leadData.id);
    console.log('   ✅ Lead removido\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 PRÓXIMOS PASSOS:\n');
    console.log('1. Verifique sua caixa de entrada (e spam)');
    console.log('2. Verifique o Resend Dashboard: https://resend.com/emails');
    console.log('3. Verifique os logs: https://supabase.com/dashboard/project/' + SUPABASE_CONFIG.PROJECT_ID + '/logs/edge-functions');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (err) {
    console.error('   ❌ Erro inesperado:', err.message);
    console.error(err);
  }
}

testEmailReal();

