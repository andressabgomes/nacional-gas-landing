import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.mjs';

// REGRA: Operação ADMIN → usar SERVICE_ROLE_KEY
const admin = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  // Pegar email e senha dos argumentos da linha de comando
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.log('📋 Uso: npm run db:create-admin-simple <email> <senha>\n');
    console.log('📝 Exemplo:');
    console.log('   npm run db:create-admin-simple admin@example.com senha123\n');
    process.exit(1);
  }
  
  if (password.length < 6) {
    console.log('❌ A senha deve ter no mínimo 6 caracteres!\n');
    process.exit(1);
  }
  
  console.log('👤 Criando usuário admin...\n');
  console.log(`📧 Email: ${email}\n`);
  
  try {
    // 1. Criar usuário
    console.log('⏳ Criando usuário...');
    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // Confirmar email automaticamente
    });
    
    if (createError) {
      if (createError.message.includes('already registered')) {
        console.log('⚠️  Usuário já existe. Adicionando role admin...\n');
        
        // Buscar usuário existente
        const { data: { users } } = await admin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === email);
        
        if (!existingUser) {
          console.error('❌ Não foi possível encontrar o usuário existente.\n');
          process.exit(1);
        }
        
        // Adicionar role admin
        const { error: roleError } = await admin
          .from('user_roles')
          .insert([{
            user_id: existingUser.id,
            role: 'admin'
          }]);
        
        if (roleError) {
          if (roleError.code === '23505') {
            console.log('✅ Usuário já é admin!\n');
          } else {
            console.error('❌ Erro ao adicionar role admin:', roleError.message);
            process.exit(1);
          }
        } else {
          console.log('✅ Role admin adicionado com sucesso!\n');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n✨ USUÁRIO ADMIN CONFIGURADO!\n');
        console.log('📋 Credenciais:');
        console.log(`   Email: ${email}`);
        console.log(`   Senha: ${password}\n`);
        console.log('🚀 Próximos passos:');
        console.log('   1. Acesse: http://localhost:8080');
        console.log('   2. Faça login com as credenciais acima');
        console.log('   3. Acesse a área admin para ver os leads\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        return;
      }
      
      console.error('❌ Erro ao criar usuário:', createError.message);
      process.exit(1);
    }
    
    console.log('✅ Usuário criado com sucesso!');
    console.log(`   ID: ${userData.user.id}\n`);
    
    // 2. Adicionar role admin
    console.log('⏳ Adicionando role admin...');
    
    const { error: roleError } = await admin
      .from('user_roles')
      .insert([{
        user_id: userData.user.id,
        role: 'admin'
      }]);
    
    if (roleError) {
      if (roleError.code === '23505') {
        console.log('⚠️  Usuário já é admin.\n');
      } else {
        console.error('❌ Erro ao adicionar role admin:', roleError.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Role admin adicionado com sucesso!\n');
    }
    
    // 3. Resultado final
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ USUÁRIO ADMIN CRIADO COM SUCESSO!\n');
    console.log('📋 Credenciais:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}\n`);
    console.log('🚀 Próximos passos:');
    console.log('   1. Acesse: http://localhost:8080');
    console.log('   2. Faça login com as credenciais acima');
    console.log('   3. Acesse a área admin para ver os leads\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createAdminUser();

