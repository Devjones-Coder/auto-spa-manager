# Instruções para Iniciar o Sistema

## ⚠️ IMPORTANTE: O backend precisa estar rodando!

O sistema usa um backend com SQLite. O frontend roda na porta **3000** e faz proxy das requisições `/api` para o backend na porta **3001**.

## Como Iniciar

### Opção 1: Servidor e Frontend Separados (Recomendado)

1. **Terminal 1 - Iniciar o Backend:**
   ```bash
   npm run dev:server
   ```
   Você verá: `🚀 Servidor rodando na porta 3001`

2. **Terminal 2 - Iniciar o Frontend:**
   ```bash
   npm run dev
   ```
   O frontend abrirá em: `http://localhost:3000`

### Opção 2: Servidor e Frontend Juntos

```bash
npm run dev:all
```

Isso inicia ambos automaticamente em um único comando.

## Estrutura de Portas

- **Frontend (Vite)**: `http://localhost:3000` - Interface do usuário
- **Backend (Express)**: `http://localhost:3001` - API e banco de dados
- **Proxy**: O Vite faz proxy automático de `/api/*` para o backend

**Como funciona:**
- Você acessa o frontend em `http://localhost:3000`
- Quando o frontend faz requisições para `/api/*`, o Vite automaticamente redireciona para `http://localhost:3001/api/*`
- Tudo funciona transparentemente!

## Verificar se o Backend Está Rodando

Você pode testar manualmente:
- Backend direto: http://localhost:3001/health
- Através do proxy: http://localhost:3000/health
- Ambos devem retornar: `{"status":"ok","database":"connected"}`

## Problemas Comuns

### Erro "Network Error"
- ✅ Verifique se o backend está rodando (`npm run dev:server` em outro terminal)
- ✅ Verifique se o backend está na porta 3001
- ✅ Verifique se o frontend está rodando na porta 3000
- ✅ Verifique se não há firewall bloqueando
- ✅ Verifique o console do navegador para ver a URL da API

### Erro "Cannot find module"
- Execute: `npm install` para instalar dependências

### Banco de Dados
- O banco SQLite será criado automaticamente em `server/db/database.db` na primeira execução
- Não precisa configurar nada manualmente

## Resumo

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API (via proxy)**: http://localhost:3000/api → proxy para http://localhost:3001/api

**Nota:** O backend roda na porta 3001 e o frontend na 3000. O Vite faz proxy automático, então você só precisa acessar `http://localhost:3000` no navegador.

