/**
 * Script para configurar secrets do Resend no Supabase
 * 
 * NOTA: Este script requer autenticação manual via Supabase Dashboard
 * pois a API de secrets não está disponível publicamente.
 * 
 * Use este script apenas como referência. Configure manualmente no Dashboard.
 */

import { SUPABASE_CONFIG } from './config.mjs';

const RESEND_API_KEY = process.argv[2] || 're_hnEHDApJ_PpbQK6joBqTtmM2dRBgTzgT7';
const BACKOFFICE_EMAIL = process.argv[3] || 'admin@nacionalgas.com';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📧 Configuração de Secrets do Resend no Supabase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⚠️  IMPORTANTE: A configuração de secrets deve ser feita manualmente no Dashboard.\n');

console.log('📋 INSTRUÇÕES:\n');
console.log('1. Acesse o Supabase Dashboard:');
console.log(`   https://supabase.com/dashboard/project/${SUPABASE_CONFIG.PROJECT_ID}/settings/functions\n`);

console.log('2. Vá em "Edge Functions" → "Secrets"\n');

console.log('3. Clique em "Add new secret" e adicione:\n');
console.log('   Nome: RESEND_API_KEY');
console.log(`   Valor: ${RESEND_API_KEY}\n`);

console.log('4. Clique em "Add new secret" novamente e adicione:\n');
console.log('   Nome: BACKOFFICE_EMAIL');
console.log(`   Valor: ${BACKOFFICE_EMAIL}\n`);

console.log('5. Aguarde alguns segundos para a propagação\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Após configurar, você pode testar com:');
console.log('   npm run test:email\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Tentar abrir o link no navegador (se possível)
if (typeof process !== 'undefined' && process.platform === 'win32') {
  const { exec } = await import('child_process');
  const url = `https://supabase.com/dashboard/project/${SUPABASE_CONFIG.PROJECT_ID}/settings/functions`;
  console.log('🌐 Abrindo o Dashboard no navegador...\n');
  exec(`start ${url}`, (error) => {
    if (error) {
      console.log('⚠️  Não foi possível abrir automaticamente. Acesse manualmente o link acima.\n');
    }
  });
}

