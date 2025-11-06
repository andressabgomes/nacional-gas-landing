// Centralized Supabase configuration for server-side scripts
// REGRAS OBRIGATÓRIAS:
// 1. Cliente PÚBLICO (ANON_KEY) → Apenas para operações AUTH (signup, login, OTP, resetPassword, getUser, signOut)
// 2. Cliente ADMIN (SERVICE_ROLE_KEY) → Para operações ADMIN (criar tabelas, alterar schemas, RLS policies, inserts privilegiados)
// 3. NUNCA use anon key para operações administrativas
// 4. NUNCA use service role key para login/signup

export const SUPABASE_CONFIG = {
  URL: 'https://epyfjifishhlkttfoifj.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweWZqaWZpc2hobGt0dGZvaWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTczMzEsImV4cCI6MjA3Nzk5MzMzMX0.y9T9w7AQuDOfaWVxH8CugxHxIO15f-SsuQmSRDLJJ_k',
  SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweWZqaWZpc2hobGt0dGZvaWZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQxNzMzMSwiZXhwIjoyMDc3OTkzMzMxfQ.GQIoW3MRDXYEcSID0e_MH3Yso2NvCiZWic-xEM5RpSc',
  DB_PASSWORD: '8534',
  PROJECT_ID: 'epyfjifishhlkttfoifj'
};

// Helper functions to create clients with correct keys
// REGRA: Use createPublicClient() para operações AUTH
// REGRA: Use createAdminClient() para operações ADMIN
export async function createPublicClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  });
}

export async function createAdminClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Database connection configs for direct PostgreSQL access
export const DB_CONFIGS = [
  {
    host: `db.${SUPABASE_CONFIG.PROJECT_ID}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: SUPABASE_CONFIG.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  },
  {
    host: `db.${SUPABASE_CONFIG.PROJECT_ID}.supabase.co`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${SUPABASE_CONFIG.PROJECT_ID}`,
    password: SUPABASE_CONFIG.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  }
];

