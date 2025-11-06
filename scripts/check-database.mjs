import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.mjs';

// REGRA: Operações ADMIN (verificar tabelas, contar registros) → usar SERVICE_ROLE_KEY
const admin = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkDatabase() {
  console.log('🔍 Verificando status do banco de dados...\n');
  
  const tablesToCheck = ['leads', 'profiles', 'user_roles'];
  const results = {
    leads: false,
    profiles: false,
    user_roles: false
  };
  
  for (const table of tablesToCheck) {
    try {
      // Try to query the table (this will fail if table doesn't exist)
      // Usando cliente admin para bypass RLS
      const { data, error } = await admin
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          results[table] = false;
        } else {
          // Table exists but might have RLS blocking access
          // With service_role, we should be able to access it
          results[table] = true;
        }
      } else {
        results[table] = true;
      }
    } catch (error) {
      // If we get an error, the table probably doesn't exist
      results[table] = false;
    }
  }
  
  console.log('📊 Status das Tabelas:');
  console.log(`   ${results.leads ? '✅' : '❌'} leads`);
  console.log(`   ${results.profiles ? '✅' : '❌'} profiles`);
  console.log(`   ${results.user_roles ? '✅' : '❌'} user_roles\n`);
  
  const allTablesExist = Object.values(results).every(exists => exists);
  
  if (allTablesExist) {
    console.log('✨ Todas as tabelas estão criadas!');
    console.log('✅ Seu banco de dados está pronto para uso.\n');
    
    // Check if there are any leads
    // Usando cliente admin para bypass RLS
    try {
      const { count } = await admin
        .from('leads')
        .select('*', { count: 'exact', head: true });
      console.log(`📈 Total de leads: ${count || 0}`);
    } catch (error) {
      // Ignore errors
    }
    
    // Check if there are any users with admin role
    // Usando cliente admin para bypass RLS
    try {
      const { data: admins } = await admin
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      console.log(`👑 Total de admins: ${admins?.length || 0}`);
      if (admins && admins.length === 0) {
        console.log('\n💡 Dica: Você ainda não tem usuários admin.');
        console.log('   Para criar um admin, execute no SQL Editor:');
        console.log('   INSERT INTO public.user_roles (user_id, role)');
        console.log('   VALUES (\'USER_ID_AQUI\', \'admin\');\n');
      }
    } catch (error) {
      // Ignore errors
    }
    
  } else {
    console.log('⚠️  Algumas tabelas não foram criadas ainda.\n');
    console.log('📝 Para configurar o banco de dados:');
    console.log(`   1. Acesse: https://supabase.com/dashboard/project/${SUPABASE_CONFIG.PROJECT_ID}/sql`);
    console.log('   2. Abra o arquivo: sql/database-setup.sql');
    console.log('   3. Copie TODO o conteúdo');
    console.log('   4. Cole no SQL Editor');
    console.log('   5. Clique em "Run" para executar\n');
    console.log('✨ Após executar, rode este comando novamente para verificar.\n');
  }
}

checkDatabase().catch(console.error);

