# Plano Detalhado: Unificação de Tabelas de Despesas

## Objetivo
Unificar as tabelas `despesas` e `despesas_complexas` em uma única estrutura, mantendo apenas `despesas_complexas` (renomeada para `despesas`) e removendo a tabela `despesas` antiga.

## Premissas
- Banco de dados de despesas está vazio (sem dados para migrar)
- Todas as despesas passarão a usar a estrutura de múltiplos centros de custo
- Despesas com 1 centro de custo terão 100% nesse centro

---

## FASE 1: Banco de Dados

### 1.1 Migration SQL - Renomear Tabelas
**Arquivo:** `server/db/migrations/unify_despesas_tables.sql`

```sql
-- Passo 1: Renomear despesas_complexas para despesas_new (temporário)
RENAME TABLE despesas_complexas TO despesas_new;

-- Passo 2: Renomear despesas_complexas_centros_custo para despesas_centros_custo_new (temporário)
RENAME TABLE despesas_complexas_centros_custo TO despesas_centros_custo_new;

-- Passo 3: Remover tabela despesas antiga (se existir e estiver vazia)
DROP TABLE IF EXISTS despesas;

-- Passo 4: Renomear tabelas temporárias para nomes finais
RENAME TABLE despesas_new TO despesas;
RENAME TABLE despesas_centros_custo_new TO despesas_centros_custo;

-- Passo 5: Atualizar foreign keys na tabela despesas_centros_custo
ALTER TABLE despesas_centros_custo
  DROP FOREIGN KEY IF EXISTS despesas_complexas_centros_custo_ibfk_1;

ALTER TABLE despesas_centros_custo
  ADD CONSTRAINT fk_despesas_centros_custo_despesa
  FOREIGN KEY (despesa_id) REFERENCES despesas(id) ON DELETE CASCADE;

-- Passo 6: Renomear coluna despesa_complexa_id para despesa_id
ALTER TABLE despesas_centros_custo
  CHANGE COLUMN despesa_complexa_id despesa_id INT NOT NULL;

-- Passo 7: Atualizar índices
ALTER TABLE despesas_centros_custo
  DROP INDEX IF EXISTS idx_despesas_complexas_centros_despesa;

ALTER TABLE despesas_centros_custo
  ADD INDEX idx_despesas_centros_custo_despesa (despesa_id);

-- Passo 8: Atualizar unique constraint
ALTER TABLE despesas_centros_custo
  DROP INDEX IF EXISTS unique_despesa_complexa_centro;

ALTER TABLE despesas_centros_custo
  ADD UNIQUE KEY unique_despesa_centro (despesa_id, centro_custo_id);

-- Passo 9: Atualizar foreign key em lancamentos_despesas (já deve estar correta, mas verificar)
-- A foreign key já aponta para despesas(id), então não precisa mudar
```

### 1.2 Atualizar Schema Principal
**Arquivo:** `server/db/schema-mariadb.sql`

- Remover definição da tabela `despesas` antiga (linhas 233-253)
- Renomear `despesas_complexas` para `despesas` (linhas 255-272)
- Renomear `despesas_complexas_centros_custo` para `despesas_centros_custo` (linhas 274-288)
- Atualizar nomes de colunas: `despesa_complexa_id` → `despesa_id`
- Atualizar nomes de índices e constraints

---

## FASE 2: Backend - Database Layer

### 2.1 Atualizar Prepared Statements
**Arquivo:** `server/db/database.js`

**Remover:**
- `getAllDespesas` (antiga, linha ~1963)
- `getDespesaById` (antiga, linha ~1979)
- `getDespesasByCentroCusto` (antiga)
- `searchDespesas` (antiga)
- `createDespesa` (antiga, linha ~2031)
- `updateDespesa` (antiga, linha ~2045)
- `deleteDespesa` (antiga, linha ~2059)

**Renomear e Ajustar:**
- `getAllDespesasComplexas` → `getAllDespesas`
  - Mudar `FROM despesas_complexas dc` para `FROM despesas d`
  - Remover JOIN com `centros_custo` (não existe mais coluna direta)
  - Adicionar JOIN com `despesas_centros_custo` para buscar centros

- `getDespesaComplexaById` → `getDespesaById`
  - Mesmas mudanças acima

- `createDespesaComplexa` → `createDespesa`
  - Mudar `INSERT INTO despesas_complexas` para `INSERT INTO despesas`
  - Remover referências a `despesas` antiga na lógica de `is_salario`

- `updateDespesaComplexa` → `updateDespesa`
  - Mesmas mudanças

- `deleteDespesaComplexa` → `deleteDespesa`
  - Mudar `DELETE FROM despesas_complexas` para `DELETE FROM despesas`

**Renomear:**
- `getCentrosCustoByDespesaComplexa` → `getCentrosCustoByDespesa`
  - Mudar `FROM despesas_complexas_centros_custo` para `FROM despesas_centros_custo`
  - Mudar `despesa_complexa_id` para `despesa_id`

- `createDespesaComplexaCentroCusto` → `createDespesaCentroCusto`
  - Mudar `INSERT INTO despesas_complexas_centros_custo` para `INSERT INTO despesas_centros_custo`
  - Mudar `despesa_complexa_id` para `despesa_id`

- `deleteDespesaComplexaCentrosCusto` → `deleteDespesaCentrosCusto`
  - Mudar `despesa_complexa_id` para `despesa_id`

- `validatePesosDespesaComplexa` → `validatePesosDespesa`
  - Mudar `FROM despesas_complexas_centros_custo` para `FROM despesas_centros_custo`
  - Mudar `despesa_complexa_id` para `despesa_id`

**Novo Prepared Statement:**
```javascript
getDespesaWithCentrosCusto: {
  get: async (id) => {
    // Buscar despesa
    const despesa = await getDespesaById.get(id);
    if (!despesa) return null;
    
    // Buscar centros de custo
    const centros = await getCentrosCustoByDespesa.all(id);
    despesa.centros_custo = centros;
    
    return despesa;
  }
}
```

### 2.2 Atualizar initializeDatabase
**Arquivo:** `server/db/database.js`

- Remover `'despesas'` da lista `requiredTables` (linha ~105)
- Manter apenas estrutura unificada

---

## FASE 3: Backend - Routes

### 3.1 Unificar Rotas de Despesas
**Arquivo:** `server/routes/despesas.js`

**Estratégia:** Manter `despesas.js` e remover `despesasComplexas.js`

**Mudanças em `despesas.js`:**
- Atualizar todos os prepared statements para usar novos nomes
- Ajustar lógica de `POST /api/despesas`:
  - Aceitar `centros_custo` como array (não mais `centro_custo_id` único)
  - Validar que soma dos percentuais = 100%
  - Criar despesa e depois criar relacionamentos em `despesas_centros_custo`

- Ajustar lógica de `PUT /api/despesas/:id`:
  - Atualizar despesa
  - Deletar relacionamentos antigos
  - Criar novos relacionamentos

- Ajustar `GET /api/despesas/:id`:
  - Retornar despesa com array de `centros_custo` incluído

**Remover arquivo:** `server/routes/despesasComplexas.js`

### 3.2 Atualizar Rota de Lançamentos
**Arquivo:** `server/routes/lancamentosDespesas.js`

**Mudança Crítica em `POST /api/lancamentos-despesas`:**

**ANTES:**
```javascript
// 1 despesa → 1 centro de custo → 1 valor → 1 registro
const despesa = await getDespesaById.get(despesa_id);
const centro_custo_id = despesa.centro_custo_id; // Único centro
await createLancamentoDespesa.run(despesa_id, centro_custo_id, valor, ...);
```

**DEPOIS:**
```javascript
// 1 despesa → múltiplos centros de custo → múltiplos valores → múltiplos registros
const despesa = await getDespesaWithCentrosCusto.get(despesa_id);
const centrosCusto = despesa.centros_custo; // Array de centros com percentuais

// Usar transação para garantir atomicidade
const connection = await pool.getConnection();
await connection.beginTransaction();

try {
  const lancamentosCriados = [];
  
  for (const centro of centrosCusto) {
    const valorDistribuido = valorTotal * (centro.peso_percentual / 100);
    
    // Arredondar para 2 casas decimais
    const valorArredondado = Math.round(valorDistribuido * 100) / 100;
    
    const result = await createLancamentoDespesa.run(
      despesa_id,
      centro.centro_custo_id,
      valorArredondado,
      dataLancamento,
      observacoes,
      criado_por,
      employee_id
    );
    
    lancamentosCriados.push(result.insertId);
  }
  
  // Ajustar último valor para garantir soma exata (corrigir arredondamentos)
  if (lancamentosCriados.length > 0) {
    const somaCalculada = centrosCusto.reduce((sum, c) => 
      sum + (valorTotal * c.peso_percentual / 100), 0
    );
    const diferenca = valorTotal - somaCalculada;
    
    if (Math.abs(diferenca) > 0.01) {
      // Ajustar último lançamento
      const ultimoId = lancamentosCriados[lancamentosCriados.length - 1];
      const ultimoCentro = centrosCusto[centrosCusto.length - 1];
      const valorUltimo = (valorTotal * ultimoCentro.peso_percentual / 100) + diferenca;
      
      await executeQuery(
        'UPDATE lancamentos_despesas SET valor = ? WHERE id = ?',
        [valorUltimo, ultimoId]
      );
    }
  }
  
  await connection.commit();
  
  // Retornar todos os lançamentos criados
  const lancamentos = await Promise.all(
    lancamentosCriados.map(id => getLancamentoDespesaById.get(id))
  );
  
  res.status(201).json(lancamentos);
  
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```

**Ajustar `GET /api/lancamentos-despesas`:**
- Já funciona, mas pode agrupar lançamentos da mesma despesa se necessário

### 3.3 Atualizar server/index.js
- Remover: `app.use('/api/despesas-complexas', despesasComplexasRouter);`
- Manter: `app.use('/api/despesas', despesasRouter);`

---

## FASE 4: Frontend - API Service

### 4.1 Unificar APIs
**Arquivo:** `src/services/api.ts`

**Remover:**
- `despesasComplexasApi` (linhas ~372-390)

**Atualizar `despesasApi`:**
```typescript
export const despesasApi = {
  getAll: (filters?: { centro_custo_id?: number; search?: string }) => 
    api.get('/despesas', { params: filters }),
  getById: (id: number) => api.get(`/despesas/${id}`),
  create: (data: { 
    name: string; 
    tipo_despesa_id?: number; 
    centros_custo: Array<{ centro_custo_id: number; peso_percentual: number }>; 
    criado_por?: number;
    is_salario?: boolean;
  }) => api.post('/despesas', data),
  update: (id: number, data: { 
    name: string; 
    tipo_despesa_id?: number; 
    centros_custo: Array<{ centro_custo_id: number; peso_percentual: number }>; 
    atualizado_por?: number;
    is_salario?: boolean;
  }) => api.put(`/despesas/${id}`, data),
  delete: (id: number) => api.delete(`/despesas/${id}`),
};
```

**Atualizar `lancamentosDespesasApi.create`:**
- Retornar array de lançamentos (não mais objeto único)

---

## FASE 5: Frontend - Páginas

### 5.1 Unificar Páginas de Cadastro
**Estratégia:** Manter `RegistrarDespesaComplexa.tsx` e renomear para `RegistrarDespesa.tsx`

**Arquivo:** `src/pages/RegistrarDespesa.tsx` (novo, baseado em RegistrarDespesaComplexa.tsx)

**Mudanças:**
- Renomear componente: `RegistrarDespesaComplexa` → `RegistrarDespesa`
- Atualizar imports: `despesasComplexasApi` → `despesasApi`
- Atualizar navegação: `/financeiro/despesas-complexas` → `/financeiro/fluxo/saida/despesas`
- Garantir que sempre tenha pelo menos 1 centro de custo (mesmo que seja 100%)

**Remover:** `src/pages/RegistrarDespesa.tsx` (antiga)

### 5.2 Atualizar Página de Lançamento
**Arquivo:** `src/pages/LancarDespesa.tsx`

**Mudanças:**
- Buscar despesas de `despesasApi.getAll()` (já unificado)
- Ao selecionar despesa, buscar detalhes com `despesasApi.getById()` que retorna `centros_custo`
- Mostrar preview da distribuição antes de salvar:
  ```typescript
  {selectedDespesa && selectedDespesa.centros_custo && (
    <div className="mt-4 p-4 bg-muted rounded-md">
      <Label>Distribuição do Valor:</Label>
      {selectedDespesa.centros_custo.map((centro, idx) => {
        const valorDistribuido = valorNum * (centro.peso_percentual / 100);
        return (
          <div key={idx} className="mt-2 text-sm">
            {centro.centro_custo_name}: {formatCurrency(valorDistribuido)} ({centro.peso_percentual}%)
          </div>
        );
      })}
    </div>
  )}
  ```
- Após salvar, mostrar mensagem: "Despesa lançada com sucesso! X lançamentos criados."

### 5.3 Atualizar Página de Listagem
**Arquivo:** `src/pages/ListarDespesas.tsx`

**Mudanças:**
- Já funciona, mas pode melhorar agrupamento:
  - Agrupar lançamentos da mesma despesa na mesma data
  - Mostrar valor total da despesa e distribuição

**Arquivo:** `src/pages/ListarDespesasComplexas.tsx`

**Estratégia:** Remover ou unificar com lista de despesas cadastradas

**Opção 1 - Remover:** Se não houver necessidade de listar despesas cadastradas separadamente

**Opção 2 - Renomear:** `ListarDespesasCadastradas.tsx` para listar apenas despesas (não lançamentos)

### 5.4 Atualizar Página de Edição
**Arquivo:** `src/pages/EditarDespesa.tsx`

**Mudanças:**
- Atualizar para usar `despesasApi` unificado
- Ajustar para trabalhar com array de `centros_custo`

### 5.5 Atualizar Rotas
**Arquivo:** `src/App.tsx`

**Mudanças:**
- Remover: `<Route path="/financeiro/despesas-complexas" ... />`
- Remover: `<Route path="/financeiro/despesas-complexas/novo" ... />`
- Remover: `<Route path="/financeiro/despesas-complexas/editar/:id" ... />`
- Atualizar rotas de despesas para usar nova estrutura:
  - `/financeiro/fluxo/saida/despesas` → Lista de despesas cadastradas (se necessário)
  - `/financeiro/fluxo/saida/despesas/novo` → Cadastrar nova despesa
  - `/financeiro/fluxo/saida/despesas/editar/:id` → Editar despesa

---

## FASE 6: Validações e Tratamento de Erros

### 6.1 Validações no Backend
- Garantir que despesa sempre tenha pelo menos 1 centro de custo
- Garantir que soma dos percentuais = 100% (tolerância 0.01)
- Validar que não há centros de custo duplicados
- Validar arredondamento: último centro recebe diferença para garantir soma exata

### 6.2 Validações no Frontend
- Validar soma de percentuais antes de salvar
- Mostrar preview de distribuição antes de lançar
- Validar que despesa de salário tem funcionário selecionado

### 6.3 Tratamento de Erros
- Transação no lançamento: se falhar, rollback de todos os registros
- Mensagens de erro claras
- Log de erros para debug

---

## FASE 7: Relatórios e Estatísticas

### 7.1 ListarDespesas.tsx
**Verificar:**
- Soma de valores por despesa (agora pode ter múltiplos registros)
- Agrupamento por despesa
- Filtros funcionam corretamente

### 7.2 Dashboard e Relatórios
**Verificar:**
- Estatísticas de despesas
- Gráficos de despesas por centro de custo
- Relatórios financeiros

**Ajustes necessários:**
- Agrupar lançamentos da mesma despesa quando necessário
- Somar valores distribuídos corretamente

---

## FASE 8: Testes

### 8.1 Testes de Cadastro
- [ ] Cadastrar despesa com 1 centro de custo (100%)
- [ ] Cadastrar despesa com múltiplos centros de custo
- [ ] Editar despesa existente
- [ ] Deletar despesa
- [ ] Validar soma de percentuais

### 8.2 Testes de Lançamento
- [ ] Lançar despesa com 1 centro (valor único)
- [ ] Lançar despesa com múltiplos centros (valores distribuídos)
- [ ] Lançar despesa de salário com múltiplos centros
- [ ] Verificar arredondamento (soma exata)
- [ ] Verificar transação (rollback em caso de erro)

### 8.3 Testes de Listagem
- [ ] Listar despesas cadastradas
- [ ] Listar lançamentos de despesas
- [ ] Filtrar por despesa
- [ ] Filtrar por centro de custo
- [ ] Agrupamento correto

### 8.4 Testes de Relatórios
- [ ] Estatísticas de despesas
- [ ] Gráficos
- [ ] Exportação de dados

---

## ORDEM DE EXECUÇÃO

1. **FASE 1** - Banco de Dados (migrations e schema)
2. **FASE 2** - Backend Database Layer (prepared statements)
3. **FASE 3** - Backend Routes (rotas unificadas)
4. **FASE 4** - Frontend API Service
5. **FASE 5** - Frontend Páginas
6. **FASE 6** - Validações
7. **FASE 7** - Relatórios
8. **FASE 8** - Testes

---

## PONTOS DE ATENÇÃO

1. **Arredondamento:** Garantir que soma de valores distribuídos = valor total
2. **Transações:** Usar transações no lançamento para garantir atomicidade
3. **Compatibilidade:** Despesas com 1 centro (100%) devem funcionar normalmente
4. **Performance:** Múltiplos INSERTs no lançamento - considerar batch insert se necessário
5. **UI/UX:** Mostrar preview de distribuição antes de salvar
6. **Mensagens:** Informar usuário sobre múltiplos lançamentos criados

---

## ROLLBACK PLAN

Se algo der errado:
1. Reverter migrations (renomear tabelas de volta)
2. Restaurar código anterior via Git
3. Verificar integridade dos dados

---

## CONCLUSÃO

Este plano garante que:
- ✅ Tabelas sejam unificadas corretamente
- ✅ Lógica de lançamento funcione com múltiplos centros
- ✅ Frontend seja atualizado completamente
- ✅ Relatórios continuem funcionando
- ✅ Não haja ramificações ruins
- ✅ Sistema seja testado adequadamente








