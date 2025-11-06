import { execSync } from 'child_process';

// Token deve ser passado como variável de ambiente ou argumento
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.argv[3];
const REPO_NAME = process.argv[2] || 'nacional-gas-landing';
const IS_PRIVATE = process.argv[3] === 'private' || process.argv[3] === 'true';

async function pushToGitHub() {
  console.log('🚀 Criando repositório no GitHub e fazendo push...\n');
  console.log(`📦 Repositório: ${REPO_NAME}`);
  console.log(`🔒 Privado: ${IS_PRIVATE ? 'Sim' : 'Não'}\n`);
  
  try {
    // 1. Obter username do GitHub
    console.log('⏳ Obtendo informações do usuário...\n');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Erro ao autenticar no GitHub. Verifique o token.');
    }
    
    const user = await userResponse.json();
    const username = user.login;
    console.log(`✅ Autenticado como: ${username}\n`);
    
    // 2. Criar repositório
    console.log('⏳ Criando repositório no GitHub...\n');
    const createResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: REPO_NAME,
        description: 'Landing Page Nacional Gás com gerenciador de leads',
        private: IS_PRIVATE,
        auto_init: false
      })
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.json();
      if (error.message?.includes('already exists')) {
        console.log('⚠️  Repositório já existe. Continuando com push...\n');
      } else {
        throw new Error(`Erro ao criar repositório: ${error.message || createResponse.statusText}`);
      }
    } else {
      const repo = await createResponse.json();
      console.log('✅ Repositório criado com sucesso!');
      console.log(`   URL: ${repo.html_url}\n`);
    }
    
    // 3. Configurar remote
    const repoUrl = `https://${GITHUB_TOKEN}@github.com/${username}/${REPO_NAME}.git`;
    
    try {
      execSync('git remote get-url origin', { stdio: 'ignore' });
      console.log('⚠️  Remote origin já existe. Removendo...\n');
      execSync('git remote remove origin', { stdio: 'inherit' });
    } catch {
      // Remote não existe, tudo bem
    }
    
    console.log('⏳ Configurando remote...\n');
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
    
    // 4. Garantir branch main
    try {
      execSync('git branch -M main', { stdio: 'inherit' });
    } catch {
      // Já está na main ou não importa
    }
    
    // 5. Fazer push
    console.log('⏳ Fazendo push para o GitHub...\n');
    execSync('git push -u origin main', { stdio: 'inherit', env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ REPOSITÓRIO CRIADO E PUSH REALIZADO COM SUCESSO!\n');
    console.log(`🔗 URL: https://github.com/${username}/${REPO_NAME}\n`);
    console.log('🚀 Próximos passos:');
    console.log('   1. Acesse o repositório no GitHub');
    console.log('   2. Faça deploy no Vercel/Netlify (veja docs/DEPLOY.md)');
    console.log('   3. Configure as variáveis de ambiente na plataforma\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.stderr) {
      console.error('Detalhes:', error.stderr.toString());
    }
    console.log('\n📝 Uso: node scripts/push-to-github.mjs [nome-repo] [private|public]');
    console.log('   Exemplo: node scripts/push-to-github.mjs nacional-gas-landing private\n');
    process.exit(1);
  }
}

pushToGitHub();

