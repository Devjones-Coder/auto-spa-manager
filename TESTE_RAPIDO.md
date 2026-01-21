# Guia Rápido de Teste

## 1. Iniciar o Backend

```bash
npm run dev:server
```

Você deve ver: `🚀 Servidor rodando na porta 3001`

## 2. Iniciar o Frontend (em outro terminal)

```bash
npm run dev
```

O frontend abrirá em: `http://localhost:3000`

## 3. Fazer Login

- Acesse: http://localhost:3000
- Usuário: `demo`
- Senha: `demo`

## 4. Testar Geração de Horários

1. Vá para a página "Agenda"
2. Selecione uma data
3. Configure:
   - Horário de abertura: 07:00
   - Horário de fechamento: 18:00
   - Intervalo: 20 minutos
4. Clique em "Gerar Horários do Dia"

## Verificação de Problemas

### Backend não está rodando
- Erro: "Network Error" ou "Servidor backend não está acessível"
- Solução: Execute `npm run dev:server` em outro terminal

### Porta 3001 já está em uso
- Solução: Verifique se outro processo está usando a porta ou mude a porta no `.env`

### Frontend não conecta
- Verifique o console do navegador (F12)
- Verifique se a URL da API está correta: deve mostrar `/api` (caminho relativo)

