import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.mjs';
import readline from 'readline';

// REGRA: Operação ADMIN → usar SERVICE_ROLE_KEY
const admin = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdminUser() {
  console.log('👤 Criando usuário admin...\n');
  
  try {
    // Solicitar email e senha
    const email = await question('📧 Digite o email do usuário admin: ');
    const password = await question('🔒 Digite a senha (mínimo 6 caracteres): ');
    
    if (!email || !password) {
      console.log('\n❌ Email e senha são obrigatórios!\n');
      rl.close();
      return;
    }
    
    if (password.length < 6) {
      console.log('\n❌ A senha deve ter no mínimo 6 caracteres!\n');
      rl.close();
      return;
    }
    
    console.log('\n⏳ Criando usuário...\n');
    
    // 1. Criar usuário
    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // Confirmar email automaticamente
    });
    
    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError.message);
      rl.close();
      return;
    }
    
    console.log('✅ Usuário criado com sucesso!');
    console.log(`   Email: ${userData.user.email}`);
    console.log(`   ID: ${userData.user.id}\n`);
    
    // 2. Adicionar role admin
    console.log('⏳ Adicionando role admin...\n');
    
    const { data: adminRole, error: roleError } = await admin
      .from('user_roles')
      .insert([{
        user_id: userData.user.id,
        role: 'admin'
      }])
      .select()
      .single();
    
    if (roleError) {
      if (roleError.code === '23505') {
        console.log('⚠️  Usuário já é admin.\n');
      } else {
        console.error('❌ Erro ao adicionar role admin:', roleError.message);
        console.error('📋 Detalhes:', JSON.stringify(roleError, null, 2));
        rl.close();
        return;
      }
    } else {
      console.log('✅ Role admin adicionado com sucesso!\n');
    }
    
    // 3. Verificar resultado
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ USUÁRIO ADMIN CRIADO COM SUCESSO!\n');
    console.log('📋 Credenciais:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${'*'.repeat(password.length)}\n`);
    console.log('🚀 Próximos passos:');
    console.log('   1. Acesse: http://localhost:8080');
    console.log('   2. Faça login com as credenciais acima');
    console.log('   3. Acesse a área admin para ver os leads\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.error(error.stack);
  } finally {
    rl.close();
  }
}

createAdminUser();

