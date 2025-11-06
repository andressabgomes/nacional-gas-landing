/**
 * Script para verificar a configuração de emails
 */

import { SUPABASE_CONFIG } from './config.mjs';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📧 Verificação de Configuração de Emails');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⚠️  IMPORTANTE: As variáveis de ambiente devem estar configuradas no Supabase Dashboard.\n');

console.log('📋 CONFIGURAÇÃO NECESSÁRIA:\n');
console.log('1. Acesse: https://supabase.com/dashboard/project/' + SUPABASE_CONFIG.PROJECT_ID + '/settings/functions');
console.log('2. Vá em "Edge Functions" → "Secrets"\n');
console.log('3. Verifique se as seguintes variáveis estão configuradas:\n');
console.log('   ✅ RESEND_API_KEY');
console.log('   ✅ BACKOFFICE_EMAIL\n');

console.log('🔍 PARA VERIFICAR SE OS EMAILS ESTÃO SENDO ENVIADOS:\n');
console.log('1. Acesse o Resend Dashboard: https://resend.com/emails');
console.log('2. Veja o histórico de emails enviados');
console.log('3. Verifique se há erros ou se os emails estão sendo entregues\n');

console.log('📊 PARA VER OS LOGS DA EDGE FUNCTION:\n');
console.log('1. Acesse: https://supabase.com/dashboard/project/' + SUPABASE_CONFIG.PROJECT_ID + '/logs/edge-functions');
console.log('2. Filtre por "send-lead-emails"');
console.log('3. Veja os logs detalhados de cada execução\n');

console.log('🧪 PARA TESTAR:\n');
console.log('   npm run test:email\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

