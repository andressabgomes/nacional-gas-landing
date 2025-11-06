import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.mjs';

// Testar inserção via RPC usando ANON_KEY
const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testRPCInsert() {
  console.log('🧪 Testando inserção via RPC com ANON_KEY...\n');
  
  try {
    console.log('1. Chamando função RPC insert_lead...');
    const { data, error } = await supabase.rpc('insert_lead', {
      p_name: 'Teste RPC',
      p_email: 'teste-rpc@example.com',
      p_phone: '11999999999',
      p_company: 'Teste Company',
      p_message: 'Teste de inserção via RPC'
    });
    
    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      console.log(`   📊 Código: ${error.code}`);
      console.log(`   📋 Detalhes: ${JSON.stringify(error, null, 2)}\n`);
    } else {
      console.log('   ✅ Inserção via RPC bem-sucedida!');
      console.log(`   📝 Lead criado com ID: ${data}\n`);
      
      // Limpar usando admin
      const admin = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      
      await admin.from('leads').delete().eq('id', data);
      console.log('   🗑️  Lead removido\n');
    }
  } catch (err) {
    console.log(`   ❌ Erro inesperado: ${err.message}\n`);
    console.error(err);
  }
}

testRPCInsert();

