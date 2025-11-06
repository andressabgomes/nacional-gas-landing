import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.mjs';

// REGRA: Operação ADMIN → usar SERVICE_ROLE_KEY
const admin = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  console.log('👤 Criando usuário admin...\n');
  
  try {
    // 1. Listar usuários existentes
    console.log('1. Verificando usuários existentes...');
    const { data: { users }, error: listError } = await admin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('   ⚠️  Nenhum usuário encontrado.\n');
      console.log('📝 INSTRUÇÕES:');
      console.log('   1. Acesse a aplicação: http://localhost:8080');
      console.log('   2. Vá para a página de cadastro/login');
      console.log('   3. Registre um novo usuário');
      console.log('   4. Execute este script novamente: npm run db:create-admin\n');
      return;
    }
    
    console.log(`   ✅ Encontrados ${users.length} usuário(s):\n`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (ID: ${user.id})`);
    });
    console.log('');
    
    // 2. Verificar quais usuários já são admin
    console.log('2. Verificando usuários admin existentes...');
    const { data: existingAdmins, error: adminError } = await admin
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin');
    
    if (adminError) {
      console.error('❌ Erro ao verificar admins:', adminError.message);
      return;
    }
    
    const adminUserIds = new Set(existingAdmins?.map(a => a.user_id) || []);
    
    if (adminUserIds.size > 0) {
      console.log(`   ✅ Já existem ${adminUserIds.size} admin(s):`);
      existingAdmins.forEach(admin => {
        const user = users.find(u => u.id === admin.user_id);
        console.log(`      - ${user?.email || admin.user_id}`);
      });
      console.log('');
    } else {
      console.log('   ℹ️  Nenhum admin encontrado.\n');
    }
    
    // 3. Adicionar role admin ao primeiro usuário que não é admin
    const nonAdminUsers = users.filter(u => !adminUserIds.has(u.id));
    
    if (nonAdminUsers.length === 0) {
      console.log('✅ Todos os usuários já são admin!\n');
      return;
    }
    
    const userToMakeAdmin = nonAdminUsers[0];
    console.log(`3. Adicionando role admin para: ${userToMakeAdmin.email}...`);
    
    const { data: newAdmin, error: insertError } = await admin
      .from('user_roles')
      .insert([{
        user_id: userToMakeAdmin.id,
        role: 'admin'
      }])
      .select()
      .single();
    
    if (insertError) {
      if (insertError.code === '23505') {
        console.log('   ⚠️  Este usuário já é admin.\n');
      } else {
        console.error('   ❌ Erro ao criar admin:', insertError.message);
        console.error('   📋 Detalhes:', JSON.stringify(insertError, null, 2));
        return;
      }
    } else {
      console.log('   ✅ Usuário admin criado com sucesso!\n');
    }
    
    // 4. Verificar resultado final
    console.log('4. Verificando resultado...');
    const { data: finalAdmins } = await admin
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin');
    
    console.log(`   ✅ Total de admins: ${finalAdmins?.length || 0}`);
    finalAdmins?.forEach(adminRole => {
      const user = users.find(u => u.id === adminRole.user_id);
      console.log(`      - ${user?.email || adminRole.user_id}`);
    });
    console.log('');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ PRONTO! Agora você pode:\n');
    console.log('   1. Acesse: http://localhost:8080');
    console.log('   2. Faça login com:', userToMakeAdmin.email);
    console.log('   3. Acesse a área admin para ver os leads\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.error(error.stack);
  }
}

createAdmin();

