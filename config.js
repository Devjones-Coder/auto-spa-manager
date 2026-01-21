/**
 * Configurações centralizadas da aplicação
 * Substitui o uso de .env
 */

export const config = {
  // Portas
  server: {
    port: 3001,
  },
  frontend: {
    port: 3000,
  },
  
  // Banco de dados MariaDB
  database: {
    host: 'localhost',
    user: 'root',
    password: '',
    name: 'stageminas',
    port: 3306,
  },
  
  // Vonage (WhatsApp)
  vonage: {
    key: 'c18fbb59',
    secret: 'nZjw^6Ee',
    number: '5511910862268',
  },
  
  // Rate Limiting
  rateLimit: {
    intervalMs: 1, // Intervalo entre requisições em milissegundos
    burstSize: 20,   // Tamanho do burst inicial (quantidade de requisições permitidas antes de aplicar o limite)
  },
};

export default config;

