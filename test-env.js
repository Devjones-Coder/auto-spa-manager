// Script de teste para verificar configuração do .env
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

console.log('\n🔍 Teste de Configuração do .env\n');
console.log('📁 Caminho do .env:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Erro ao carregar .env:', result.error.message);
  process.exit(1);
}

console.log('✅ .env carregado com sucesso\n');

console.log('📋 Variáveis de Ambiente:');
console.log('   SERVER_PORT:', process.env.SERVER_PORT);
console.log('   PORT:', process.env.PORT);
console.log('   VITE_SERVER_PORT:', process.env.VITE_SERVER_PORT);
console.log('   VITE_API_URL:', process.env.VITE_API_URL);

const port = Number(process.env.SERVER_PORT) || Number(process.env.PORT) || 3001;
console.log('\n📌 Porta Final (convertida):', port);
console.log('   Tipo:', typeof port);
console.log('   É válida?', !isNaN(port) && port >= 1 && port <= 65535 ? '✅ Sim' : '❌ Não');

console.log('\n✅ Teste concluído!\n');

