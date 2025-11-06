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

async function setupGitHub() {
  console.log('🚀 Configurando repositório GitHub...\n');
  
  try {
    // Verificar se git está inicializado
    try {
      execSync('git status', { stdio: 'ignore' });
    } catch {
      console.log('⚠️  Git não está inicializado. Inicializando...\n');
      execSync('git init', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
    }
    
    const repoName = await question('📦 Nome do repositório (ex: nacional-gas-landing): ');
    const username = await question('👤 Seu username do GitHub: ');
    const isPrivate = await question('🔒 Repositório privado? (s/n): ');
    
    const privateFlag = isPrivate.toLowerCase() === 's' ? '--private' : '--public';
    const repoUrl = `https://github.com/${username}/${repoName}.git`;
    
    console.log('\n⏳ Criando repositório no GitHub...\n');
    console.log('📋 Comandos que serão executados:');
    console.log(`   1. gh repo create ${repoName} ${privateFlag}`);
    console.log(`   2. git remote add origin ${repoUrl}`);
    console.log(`   3. git branch -M main`);
    console.log(`   4. git push -u origin main\n`);
    
    const confirm = await question('✅ Continuar? (s/n): ');
    
    if (confirm.toLowerCase() !== 's') {
      console.log('\n❌ Operação cancelada.\n');
      rl.close();
      return;
    }
    
    // Verificar se gh CLI está instalado
    try {
      execSync('gh --version', { stdio: 'ignore' });
    } catch {
      console.log('\n⚠️  GitHub CLI não está instalado.');
      console.log('📝 Instale em: https://cli.github.com/\n');
      console.log('📋 Ou crie o repositório manualmente:');
      console.log(`   1. Acesse: https://github.com/new`);
      console.log(`   2. Nome: ${repoName}`);
      console.log(`   3. ${isPrivate.toLowerCase() === 's' ? 'Privado' : 'Público'}`);
      console.log(`   4. NÃO inicialize com README`);
      console.log(`   5. Depois execute:\n`);
      console.log(`   git remote add origin ${repoUrl}`);
      console.log(`   git branch -M main`);
      console.log(`   git push -u origin main\n`);
      rl.close();
      return;
    }
    
    // Criar repositório no GitHub
    execSync(`gh repo create ${repoName} ${privateFlag} --source=. --remote=origin --push`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ REPOSITÓRIO CRIADO COM SUCESSO!\n');
    console.log(`🔗 URL: https://github.com/${username}/${repoName}\n`);
    console.log('🚀 Próximos passos:');
    console.log('   1. Configure as variáveis de ambiente no Vercel/Netlify');
    console.log('   2. Faça deploy usando o guia em docs/DEPLOY.md\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.log('\n📝 Alternativa: Crie o repositório manualmente:');
    console.log('   1. Acesse: https://github.com/new');
    console.log('   2. Crie o repositório');
    console.log('   3. Execute os comandos mostrados acima\n');
  } finally {
    rl.close();
  }
}

setupGitHub();

