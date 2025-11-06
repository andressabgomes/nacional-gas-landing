import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createRepoAndPush() {
  // Token deve ser passado como variável de ambiente
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    console.log('❌ Erro: GITHUB_TOKEN não encontrado!');
    console.log('📝 Use: GITHUB_TOKEN=seu_token node scripts/create-repo-and-push.mjs\n');
    process.exit(1);
  }
  
  console.log('🚀 Criando repositório no GitHub e fazendo push...\n');
  
  try {
    // Solicitar informações
    const repoName = await question('📦 Nome do repositório (ex: nacional-gas-landing): ');
    const username = await question('👤 Seu username do GitHub: ');
    const isPrivate = await question('🔒 Repositório privado? (s/n): ');
    
    const privateFlag = isPrivate.toLowerCase() === 's';
    
    console.log('\n⏳ Criando repositório no GitHub...\n');
    
    // Criar repositório via API do GitHub
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Landing Page Nacional Gás com gerenciador de leads',
        private: privateFlag,
        auto_init: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      if (error.message?.includes('already exists')) {
        console.log('⚠️  Repositório já existe. Continuando com push...\n');
      } else {
        throw new Error(`Erro ao criar repositório: ${error.message || response.statusText}`);
      }
    } else {
      const repo = await response.json();
      console.log('✅ Repositório criado com sucesso!');
      console.log(`   URL: ${repo.html_url}\n`);
    }
    
    const repoUrl = `https://${GITHUB_TOKEN}@github.com/${username}/${repoName}.git`;
    
    // Verificar se remote já existe
    try {
      execSync('git remote get-url origin', { stdio: 'ignore' });
      console.log('⚠️  Remote origin já existe. Removendo...\n');
      execSync('git remote remove origin', { stdio: 'inherit' });
    } catch {
      // Remote não existe, tudo bem
    }
    
    // Adicionar remote
    console.log('⏳ Adicionando remote...\n');
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
    
    // Garantir que está na branch main
    try {
      execSync('git branch -M main', { stdio: 'inherit' });
    } catch {
      // Já está na main
    }
    
    // Fazer push
    console.log('⏳ Fazendo push para o GitHub...\n');
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ REPOSITÓRIO CRIADO E PUSH REALIZADO COM SUCESSO!\n');
    console.log(`🔗 URL: https://github.com/${username}/${repoName}\n`);
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
    console.log('\n📝 Alternativa: Crie o repositório manualmente em https://github.com/new\n');
  } finally {
    rl.close();
  }
}

createRepoAndPush();

