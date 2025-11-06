import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { SUPABASE_CONFIG } from './config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Note: This script generates a SQL file for manual execution
// The service_role key is used in other scripts for API operations

async function createSQLFile() {
  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251106135401_497ef648-c8c5-4465-bfc1-fe4d10fe4c9c.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf8');
  
  // Create a formatted SQL file for easy copy-paste
  const outputPath = join(__dirname, '..', 'sql', 'database-setup.sql');
  
  const formattedSQL = `-- ============================================
-- Script de Configuração do Banco de Dados
-- Projeto: Nacional Gás
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse o SQL Editor do Supabase:
--    https://supabase.com/dashboard/project/` + SUPABASE_CONFIG.PROJECT_ID + `/sql
-- 
-- 2. Cole todo o conteúdo deste arquivo no editor
-- 
-- 3. Clique em "Run" para executar
-- 
-- 4. Verifique se todas as tabelas foram criadas corretamente
-- 
-- ============================================

${migrationSQL}

-- ============================================
-- Verificação das Tabelas Criadas
-- ============================================
-- Execute estas queries para verificar se tudo foi criado:

-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_type = 'BASE TABLE'
-- ORDER BY table_name;

-- SELECT routine_name 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public'
-- AND routine_type = 'FUNCTION'
-- ORDER BY routine_name;

-- SELECT typname 
-- FROM pg_type 
-- WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
-- AND typtype = 'e'
-- ORDER BY typname;
`;

  const fs = await import('fs/promises');
  
  // Criar pasta sql/ se não existir
  const sqlDir = join(__dirname, '..', 'sql');
  try {
    await fs.mkdir(sqlDir, { recursive: true });
  } catch (error) {
    // Pasta já existe, ignorar erro
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  
  await fs.writeFile(outputPath, formattedSQL, 'utf8');
  
  console.log('✅ Arquivo SQL criado com sucesso!');
  console.log(`📄 Localização: ${outputPath}`);
  console.log('\n📝 PRÓXIMOS PASSOS:');
  console.log(`   1. Acesse: https://supabase.com/dashboard/project/${SUPABASE_CONFIG.PROJECT_ID}/sql`);
  console.log('   2. Abra o arquivo: sql/database-setup.sql');
  console.log('   3. Copie todo o conteúdo');
  console.log('   4. Cole no SQL Editor do Supabase');
  console.log('   5. Clique em "Run" para executar');
  console.log('\n✨ Após executar, seu banco de dados estará pronto!');
}

createSQLFile().catch(console.error);

