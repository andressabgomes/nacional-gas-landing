import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.mjs';

// Testar envio de emails via Edge Function
const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testEmailFunction() {
  console.log('🧪 Testando envio de emails via Edge Function...\n');
  
  // Primeiro, criar um lead de teste
  try {
    console.log('1. Criando lead de teste...');
    const { data: leadData, error: leadError } = await supabase.rpc('insert_lead', {
      p_name: 'Teste Email',
      p_email: 'teste@exemplo.com',
      p_phone: '11999999999',
      p_company: 'Empresa Teste',
      p_message: 'Teste de envio de emails'
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
      console.log('   ✅ Emails enviados com sucesso!');
      console.log('   📋 Resposta:', JSON.stringify(emailResponse, null, 2));
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
    
  } catch (err) {
    console.error('   ❌ Erro inesperado:', err.message);
    console.error(err);
  }
}

testEmailFunction();

