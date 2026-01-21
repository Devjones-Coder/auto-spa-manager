# Release Notes - Versão Beta

## Alterações Realizadas

### 🔧 Correção na Busca de Placas (Barra de Pesquisa do Header)

**Problema identificado:**
- As placas não eram encontradas quando o último caractere era digitado
- Exemplo: Placa "ABC1234" não era encontrada ao digitar "ABC1234" ou "1234" completos
- Funcionava parcialmente: "123" e "ABC123" encontravam, mas "1234" e "ABC1234" não

**Causa raiz:**
- A função `formatPlateForSearch` adicionava hífen quando detectava 7 caracteres (`ABC-1234`)
- As placas são armazenadas **SEM hífen** no banco de dados
- A busca tentava encontrar `ABC-1234` no banco que tem `ABC1234` (sem hífen)

**Solução aplicada:**
- Arquivo: `src/services/api.ts`
- Função `formatPlateForSearch`: Simplificada para retornar apenas a versão limpa (maiúsculas, sem caracteres especiais), sem adicionar hífen
- A formatação com hífen agora ocorre apenas na exibição visual, não na busca

**Resultado:**
- ✅ Placas são encontradas corretamente independente de como o usuário digita
- ✅ Busca funciona tanto para formato antigo (ABC1234) quanto Mercosul (ABC1D23)

---

### 🎨 Correção no Dropdown de Busca de Funcionário (Lançar Despesa)

**Problema identificado:**
- O dropdown de busca por funcionário (que aparece quando uma despesa do tipo salário é selecionada) tinha problemas visuais e de comportamento
- Não estava compatível com dark mode
- Lógica de abertura do dropdown era limitada

**Correções aplicadas:**
- Arquivo: `src/components/EmployeeSearch.tsx`

1. **Suporte a Dark Mode:**
   - Substituído `bg-white border-gray-200` por `bg-popover border-border`
   - Substituído `hover:bg-gray-100` por `hover:bg-accent hover:text-accent-foreground`

2. **Melhoria na lógica do `onFocus`:**
   - Antes: Só abria se houvesse 2+ caracteres E resultados já carregados
   - Agora: Abre sempre que houver 2+ caracteres digitados, melhorando a experiência do usuário

3. **Consistência visual:**
   - Item selecionado usa `bg-accent` ao invés de `bg-primary/10`
   - Todos os estilos agora seguem o sistema de design do projeto

**Resultado:**
- ✅ Componente totalmente compatível com dark mode
- ✅ Comportamento mais intuitivo e responsivo
- ✅ Visual consistente com outros componentes do sistema

---

### 🚀 Melhoria na Seleção de Modelo (Cadastro de Carro do Cliente)

**Problema identificado:**
- O formulário de cadastro de carro tinha dois campos separados: um para selecionar a marca e outro para o modelo
- O usuário precisava primeiro selecionar a marca para depois ver os modelos disponíveis
- Processo em duas etapas tornava o cadastro mais trabalhoso

**Solução aplicada:**
- Arquivo: `src/pages/NovoCarroCliente.tsx`
- Substituição dos dois campos Select (marca e modelo) por um único campo de busca com dropdown
- Busca integrada que procura modelos diretamente
- Exibição no formato "Modelo - Marca" no dropdown para facilitar identificação
- Ao selecionar um modelo, a marca é automaticamente definida (pois é um relacionamento no banco)

**Mudanças técnicas:**
- Removidos estados: `brands`, `selectedBrandId`, `loadingBrands`
- Adicionados estados: `modelSearch`, `modelResults`, `selectedModel`, `isModelSearchOpen`
- Criada função `searchModels` que busca modelos usando `carModelsApi.getAll({ search: query })`
- Dropdown segue o mesmo padrão visual da busca de cliente
- Validação atualizada para verificar apenas `selectedModel` ao invés de marca e modelo separados

**Resultado:**
- ✅ Processo simplificado: usuário digita e encontra o modelo diretamente
- ✅ Experiência mais fluida e intuitiva
- ✅ Interface mais limpa e moderna
- ✅ Compatível com dark mode (usando classes do tema)
- ✅ Mantém a mesma lógica de salvamento no banco (campo `car_model_id`)

**Melhorias adicionais:**
- Arquivos: `src/pages/NovoCarroCliente.tsx` e `server/db/database.js`
- **Busca por modelo OU marca:** Usuário pode digitar tanto o nome do modelo quanto o nome da marca para encontrar resultados
- **Campo desabilitado após seleção:** Após selecionar um modelo, o campo de busca fica desabilitado para evitar alterações acidentais
- **Dropdown fecha automaticamente:** Dropdown fecha automaticamente quando um modelo é selecionado
- **Reabilitação do campo:** Campo é habilitado novamente ao clicar em "Alterar modelo"
- **Placeholder informativo:** Placeholder atualizado para indicar que pode buscar por modelo ou marca

**Mudanças técnicas:**
- Backend: Modificada query SQL em `getAllCarModels` para buscar tanto em `model_name` quanto em `brand_name` (usando `OR`)
- Frontend: Lógica adicionada para desabilitar campo quando `selectedModel` está preenchido
- Frontend: `useEffect` atualizado para não executar busca quando modelo já está selecionado e fecha dropdown automaticamente

---

### 💳 Sistema de Parcelamento (Formas de Pagamento e Lançamentos)

**Funcionalidade implementada:**
- Sistema completo de parcelamento para formas de pagamento e lançamentos de receita
- Controle de parcelamento sem impacto nos cálculos de relatórios (valor total permanece o mesmo)

**Mudanças no Banco de Dados:**
- Arquivo de migration: `server/db/migrations/add_parcelamento_to_formas_pagamento_and_lancamentos.sql`
- Tabela `formas_pagamento`: 
  - Adicionado campo `aceita_parcelamento BOOLEAN DEFAULT FALSE`
  - Adicionado campo `max_parcelas INT DEFAULT 1`
- Tabela `lancamentos_receita`:
  - Adicionado campo `parcelas INT DEFAULT 1 NOT NULL`
- Schema atualizado em `server/db/schema-mariadb.sql`
- Migration de dados: Todos os lançamentos existentes foram marcados como 1x (sem parcelamento)

**Backend (`server/db/database.js` e rotas):**
- `createFormaPagamento`: Atualizado para aceitar `aceita_parcelamento` e `max_parcelas`
- `updateFormaPagamento`: Atualizado para aceitar os novos campos
- `createLancamentoReceita`: Atualizado para aceitar `parcelas` (default 1)
- `updateLancamentoReceita`: Atualizado para aceitar `parcelas`
- `createLancamentoFromBooking`: Atualizado para aceitar `parcelas` (default 1)
- Rotas `formasPagamento.js`: Validação e tratamento dos novos campos
- Rotas `lancamentosReceita.js`: Aceita campo `parcelas` opcional (default 1)
- Rotas `bookings.js`: Atualizado para receber e passar `parcelas` no pagamento

**Frontend:**

1. **Formulário de Forma de Pagamento** (`src/pages/NovaFormaPagamento.tsx`):
   - Adicionado checkbox "Aceita Parcelamento"
   - Adicionado campo numérico "Em até quantas vezes?" (visível quando checkbox marcado)
   - Validação: se aceita parcelamento, `max_parcelas` deve ser >= 1
   - Campos salvos corretamente no cadastro e edição

2. **Modal de Pagamento** (`src/components/PaymentValueModal.tsx`):
   - Interface atualizada para receber forma de pagamento completa (com `aceita_parcelamento` e `max_parcelas`)
   - Select de parcelas aparece automaticamente quando forma de pagamento aceita parcelamento
   - Opções de 1x até `max_parcelas` (máximo permitido pela forma de pagamento)
   - Default sempre 1x
   - `onConfirm` agora retorna tanto `valor` quanto `parcelas`

3. **Página de Agendamentos** (`src/pages/Agendamentos.tsx`):
   - Atualizado para passar forma de pagamento completa para o modal
   - `handleConfirmPaymentValue` atualizado para receber `parcelas`
   - `updatePayment` atualizado para enviar `parcelas` na API
   - Parcelas enviadas corretamente ao criar/atualizar lançamento de receita

4. **APIs** (`src/services/api.ts`):
   - `formasPagamentoApi`: Interfaces atualizadas para incluir `aceita_parcelamento` e `max_parcelas`
   - `lancamentosReceitaApi`: Interfaces atualizadas para incluir `parcelas`
   - `bookingsApi.updatePayment`: Interface atualizada para aceitar `parcelas`

**Comportamento:**
- ✅ Formas de pagamento podem ser configuradas para aceitar ou não parcelamento
- ✅ Se aceita parcelamento, define o número máximo de parcelas permitidas
- ✅ Ao lançar pagamento em agendamentos, se a forma de pagamento aceitar parcelamento, o usuário pode escolher em quantas vezes (1x até o máximo)
- ✅ Valor padrão sempre 1x (sem parcelamento)
- ✅ Campo `parcelas` registrado em todos os lançamentos de receita
- ✅ Lançamentos existentes automaticamente marcados como 1x
- ✅ Não afeta cálculos financeiros (valor total permanece o mesmo, parcelas é apenas informativo)

---

### 🔍 Melhorias na Página de Agendamentos - Filtros e Busca

**Funcionalidades implementadas:**
- Sistema completo de filtros e busca para facilitar a visualização de agendamentos
- Layout reorganizado para melhor usabilidade e distinção visual dos controles

**Mudanças na Interface:**

1. **Campo de Busca:**
   - Campo de busca em tempo real adicionado na área de filtros
   - Busca por: nome do cliente, placa do veículo, modelo do veículo, marca do veículo, nome do serviço
   - Busca case-insensitive (não diferencia maiúsculas/minúsculas)
   - Ícone de busca e botão para limpar pesquisa
   - Busca funciona em conjunto com os demais filtros

2. **Exibição de Veículo na Tabela:**
   - Cabeçalho da coluna alterado de "Placa" para "Modelo"
   - Exibição em duas linhas:
     - **Linha 1:** Modelo - Marca (ex: "Civic - Honda")
     - **Linha 2:** Placa do veículo (em texto menor e discreto)
   - Fallback: se não houver modelo/marca, mostra apenas a placa
   - Aplicado tanto na aba "Gerenciados" quanto "Fila Livre"

3. **Filtro de Pagamento (Select):**
   - Checkbox "Apenas Pagos" transformado em Select com opções:
     - **Todos** (com ícone de dinheiro $)
     - **Pagos** (mostra apenas agendamentos com forma de pagamento definida)
     - **Pendentes** (mostra apenas agendamentos sem forma de pagamento)
   - Estado: `paymentStatusFilter` ('all' | 'paid' | 'pending')

4. **Filtro de Status do Veículo (Select):**
   - Select para filtrar por localização/status do veículo
   - Opções disponíveis:
     - Todos os Status
     - Em fila
     - Atrasado
     - Trabalhando
     - Pronto
   - Filtro baseado no campo `vehicleLocation` do booking

5. **Layout Reorganizado:**
   - Filtros reorganizados em duas seções visuais:
     - **Primeira linha:** Título e DatePicker para filtrar por data
     - **Segunda linha (separada por borda):** Campo de busca, Select de Pagamento, Select de Status, Select de Turno
   - Melhor espaçamento e distinção visual entre os controles
   - Layout responsivo com `flex-wrap` para adaptação em telas menores

**Integração:**
- Todos os filtros funcionam em conjunto (data, turno, pagamento, status, busca)
- Filtros aplicados tanto na aba "Agendamentos Gerenciados" quanto "Fila Livre"
- Filtros são reativos e atualizam a lista automaticamente ao mudar
- Performance otimizada com `useMemo` para evitar recálculos desnecessários

**Arquivos modificados:**
- `src/pages/Agendamentos.tsx`:
  - Adicionados estados: `searchTerm`, `paymentStatusFilter`, `statusVehicleFilter`
  - Atualizado `filteredBookingsByDate` para incluir lógica de busca e novos filtros
  - Modificada exibição da coluna de veículo para mostrar modelo-marca e placa
  - Reorganizado layout dos filtros no CardHeader
  - Adicionado componente Input para busca
  - Removido Checkbox, adicionado Select para filtro de pagamento

---

### 📝 Alterações no Campo de Parcelamento (Modal de Pagamento)

**Mudança implementada:**
- Campo de parcelamento transformado de Select dropdown para Input numérico

**Detalhes:**
- Usuário agora digita diretamente o número de parcelas (1 até o máximo permitido)
- Valor padrão: 1x
- Validação automática: valores menores que 1 são corrigidos para 1, valores maiores que o máximo são ajustados para o máximo
- Validação no `onBlur`: garante que sempre haja um valor válido quando o campo perde o foco
- Atributos HTML `min="1"` e `max={formaPagamento.max_parcelas}` para validação nativa do navegador

**Arquivos modificados:**
- `src/components/PaymentValueModal.tsx`:
  - Removido Select de parcelas
  - Adicionado Input type="number" para parcelas
  - Implementada validação e tratamento de valores inválidos
  - Removidos imports desnecessários do Select

---

### 🎨 Sidebar Colapsável

**Funcionalidade implementada:**
- Sidebar pode ser colapsado/expandido para maximizar o espaço de conteúdo
- Modo "offcanvas" faz o sidebar deslizar completamente para fora da tela quando colapsado

**Mudanças implementadas:**

1. **Componente AppSidebar** (`src/components/AppSidebar.tsx`):
   - Adicionado `collapsible="offcanvas"` no componente `<Sidebar>`
   - Botão `SidebarTrigger` adicionado ao lado da logo no `SidebarHeader`
   - Permite colapsar/expandir diretamente do sidebar

2. **Layout Principal** (`src/App.tsx`):
   - `SidebarTrigger` sempre visível no header principal (antes só aparecia em mobile)
   - Permite reabrir o sidebar quando estiver colapsado

**Funcionalidades:**
- ✅ Botão ao lado da logo: colapsa/expande o sidebar
- ✅ Modo offcanvas: quando colapsado, sidebar desliza para a esquerda e desaparece completamente
- ✅ Botão no header: sempre disponível para reabrir o sidebar quando necessário
- ✅ Persistência: estado do sidebar (aberto/fechado) salvo em cookie e mantido entre sessões
- ✅ Responsivo: funciona perfeitamente em desktop e mobile

---

### 🔧 Funcionalidades Especiais na Página de Agendamentos

**Funcionalidades implementadas:**
- Auto-colapsar sidebar ao entrar na página
- Modo "Limpo" para maximizar espaço visual
- Animações suaves para transições

**1. Auto-Colapsar Sidebar:**
- Ao entrar na página de Agendamentos, o sidebar colapsa automaticamente
- Maximiza o espaço disponível para visualização dos agendamentos
- Usuário ainda pode expandir manualmente se necessário

**2. Modo Limpo (Toggle):**
- Botão "Modo Limpo" na página de Agendamentos
- Quando ativado:
  - **Header principal:** Desliza para cima e desaparece (animação slide-out)
  - **Título da página:** Fade out e oculta (animação fade)
  - **CardTitle "Lista de Agendamentos":** Oculta suavemente
  - **Filtros e lista:** Permanecem visíveis, aproveitando todo o espaço
- Botão se transforma em "Restaurar" quando o modo está ativo
- Ao clicar novamente, tudo retorna com animações suaves

**Implementação técnica:**
- Uso de `useSidebar` hook para controlar estado do sidebar
- Eventos customizados para comunicação entre página e layout
- Animações CSS com `transition-all duration-300 ease-in-out`
- Estados controlados: `max-h-0 opacity-0` para ocultar, `max-h-* opacity-100` para mostrar
- Header detecta eventos via `window.addEventListener('header-visibility-change')`

**Arquivos modificados:**
- `src/pages/Agendamentos.tsx`:
  - Adicionado `useSidebar` hook
  - Auto-colapsar sidebar no `useEffect` ao montar componente
  - Estado `cleanMode` para controlar modo limpo
  - Botão toggle "Modo Limpo" / "Restaurar"
  - Animações CSS para título e card title
  - Evento customizado para notificar AppLayout sobre mudança de visibilidade
- `src/App.tsx`:
  - Adicionado `useLocation` para detectar página atual
  - Estado `headerHidden` para controlar visibilidade do header
  - Listener de evento customizado `header-visibility-change`
  - Animações CSS no header com slide-out/ slide-in

---

### 🔧 Correção no Modal de Agendamento Rápido - Pré-seleção de Veículo

**Problema identificado:**
- Quando o modal de agendamento rápido era aberto a partir da barra de busca (com um veículo selecionado), o veículo não aparecia pré-selecionado no formulário
- O `Select` de veículos não encontrava o valor porque o `veiculoId` era definido antes de carregar a lista de veículos no estado

**Solução aplicada:**
- Arquivo: `src/components/QuickBookingModal.tsx`
- Reorganizada a ordem de carregamento dos dados quando `initialCar` é passado:
  1. Primeiro carrega todos os veículos do cliente na lista
  2. Depois verifica se o veículo inicial está na lista
  3. Se estiver, seleciona o veículo e preenche os dados (placa, cor, modelo, marca)
  4. Se não estiver (caso raro), adiciona à lista e seleciona

**Resultado:**
- ✅ Veículo vem pré-selecionado corretamente quando o modal é aberto da barra de busca
- ✅ Dados do veículo (placa, cor, modelo, marca) são preenchidos automaticamente
- ✅ `Select` encontra o valor corretamente porque a lista já está carregada quando o `veiculoId` é definido

---

### 📋 Melhorias no Sistema de Orçamentos

**Funcionalidades implementadas:**
- Sistema completo de personalização de serviços em orçamentos
- Suporte a múltiplas instâncias do mesmo serviço
- Melhorias na exibição de informações na página pública
- Otimização de performance na estrutura de dados

**1. Labels Customizados para Serviços:**
- Arquivo: `src/pages/NovoOrcamento.tsx`
- Cada serviço no orçamento pode ter um nome customizado editável
- O nome original do serviço é preservado no banco, mas o nome customizado é exibido no orçamento
- Edição inline: clique no botão "Editar Nome" para editar diretamente na lista
- O campo de edição substitui o título temporariamente com auto-focus
- Salva ao pressionar Enter ou ao perder o foco (blur)
- Cancela edição ao pressionar Escape (restaura nome original)
- O nome customizado aparece em todas as etapas do orçamento (seleção, preços, confirmação)
- O nome customizado aparece no link público e na versão de impressão

**2. Descrições por Serviço:**
- Arquivo: `src/pages/NovoOrcamento.tsx`
- Cada serviço pode ter uma descrição personalizada ("Detalhes")
- Botão "Detalhes" abre um campo de texto (textarea) para adicionar informações específicas
- Descrições aparecem abaixo de cada serviço no orçamento final
- Seções de detalhes são colapsáveis/expansíveis na etapa de preços
- Descrições aparecem no link público e na versão de impressão

**3. Suporte a Múltiplos Serviços do Mesmo Tipo:**
- Arquivo: `src/pages/NovoOrcamento.tsx`
- Permite adicionar o mesmo serviço múltiplas vezes ao orçamento
- Botão "Duplicar" cria uma cópia do serviço com seus dados (preço, desconto, nome customizado)
- Cada instância é gerenciada independentemente com ID temporário único
- Cada instância pode ter seu próprio nome customizado e descrição
- Útil para serviços que precisam ser executados várias vezes ou com variações

**4. Correção na Exibição de Métodos de Pagamento (Página Pública):**
- Arquivo: `src/pages/PublicOrcamento.tsx`
- Quando um desconto está associado a métodos de pagamento específicos, a informação é exibida
- Mensagem formatada: "Para pagamentos com: Método1, Método2 ou Método3"
- Regra gramatical: vírgulas entre os métodos, "ou" antes do último
- A mensagem aparece abaixo do desconto na tabela de serviços
- Correção aplicada na lógica de verificação para garantir que a mensagem seja exibida corretamente

**5. Migração para Tabela Intermediária de Métodos de Pagamento:**
- **Performance e Integridade:**
  - Substituída coluna JSON `payment_method_ids` por tabela intermediária `quote_service_payment_methods`
  - Melhora significativa na performance de queries
  - Integridade referencial garantida com foreign keys
  - Índices otimizados para consultas rápidas

- **Mudanças no Banco de Dados:**
  - Arquivo: `server/db/schema-mariadb.sql`
  - Nova tabela: `quote_service_payment_methods` com relacionamento many-to-many
  - Removida coluna `payment_method_ids JSON` da tabela `quote_services`
  - Foreign keys: `quote_service_id` → `quote_services(id)`, `payment_method_id` → `formas_pagamento(id)`
  - Índices: `idx_quote_service`, `idx_payment_method`, constraint único para evitar duplicatas

- **Migration Automática:**
  - Arquivo: `server/db/database.js`
  - Migration executada automaticamente na inicialização do sistema
  - **ATENÇÃO:** Apaga todos os orçamentos existentes na primeira execução após a atualização
  - Remove coluna JSON antiga se existir
  - Cria nova estrutura de tabelas

- **Backend:**
  - `createQuoteService`: Insere métodos de pagamento na tabela intermediária após criar serviço
  - `getQuoteServices`: Busca métodos de pagamento via JOIN e retorna como array (compatibilidade mantida)
  - `updateQuoteService`: Deleta e reinsere métodos de pagamento na tabela intermediária
  - A API continua retornando `payment_method_ids` como array, sem mudanças na interface

- **Frontend:**
  - Nenhuma mudança necessária - a API mantém a mesma estrutura de dados
  - Compatibilidade total preservada

**Mudanças no Banco de Dados (Detalhes):**
- Arquivo: `server/db/schema-mariadb.sql`
- Tabela `quote_services`: 
  - Adicionado campo `custom_name VARCHAR(255)` para nome customizado do serviço
  - Adicionado campo `details TEXT` para descrições personalizadas
  - Removido campo `payment_method_ids JSON` (migrado para tabela intermediária)
- Nova tabela `quote_service_payment_methods`:
  - `id INT AUTO_INCREMENT PRIMARY KEY`
  - `quote_service_id INT NOT NULL` (FK para quote_services)
  - `payment_method_id INT NOT NULL` (FK para formas_pagamento)
  - `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`
  - Unique constraint: `(quote_service_id, payment_method_id)`
  - Índices para performance otimizada

**Arquivos Modificados:**
- `server/db/schema-mariadb.sql`: Estrutura de tabelas atualizada
- `server/db/database.js`: 
  - Migration automática para criar nova estrutura
  - Atualizados `createQuoteService`, `getQuoteServices`, `updateQuoteService`
- `server/routes/quotes.js`: Mantidas as mesmas rotas (compatibilidade preservada)
- `src/pages/NovoOrcamento.tsx`:
  - Estados para gerenciar nomes customizados e detalhes
  - Funções para editar, duplicar e gerenciar serviços
  - Interface atualizada com botões de ação por serviço
- `src/pages/VisualizarOrcamento.tsx`: Exibição de nomes customizados e detalhes
- `src/pages/PublicOrcamento.tsx`: 
  - Exibição de nomes customizados e detalhes
  - Correção na exibição de métodos de pagamento para descontos

**Resultado:**
- ✅ Serviços podem ter nomes personalizados sem afetar o nome original
- ✅ Descrições específicas podem ser adicionadas a cada serviço
- ✅ Mesmo serviço pode ser adicionado múltiplas vezes ao orçamento
- ✅ Métodos de pagamento exibidos corretamente na página pública
- ✅ Performance melhorada com estrutura de banco normalizada
- ✅ Integridade referencial garantida
- ✅ Compatibilidade total com código existente

---

### 🔧 Correção na Tela de Edição de Carro de Cliente

**Problema identificado:**
- A tela de edição de carro de cliente (`/carros/clientes/editar/:id`) estava ficando em branco
- Ao clicar no botão de editar um carro na lista de carros de clientes, a página não carregava

**Causa raiz:**
- A rota para edição de carro de cliente estava ausente no arquivo de rotas principal (`src/App.tsx`)
- O componente `EditarCarroCliente` não existia no projeto

**Solução aplicada:**

1. **Criação do Componente de Edição:**
   - Arquivo: `src/pages/EditarCarroCliente.tsx`
   - Componente criado baseado em `NovoCarroCliente.tsx` e adaptado para edição
   - Carrega dados do carro existente via API ao montar o componente
   - Exibe dados readonly do cliente, marca e modelo (campos que não podem ser editados)
   - Permite editar: placa, ano, cor, é proprietário, é principal, status

2. **Adição da Rota:**
   - Arquivo: `src/App.tsx`
   - Rota adicionada: `<Route path="/carros/clientes/editar/:id" element={<EditarCarroCliente />} />`

3. **Funcionalidades:**
   - Carrega dados do carro via `customerCarsApi.getById()`
   - Formulário pré-preenchido com dados existentes
   - Validação de campos obrigatórios (placa)
   - Formatação automática de placa (antigo e Mercosul)
   - Atualização via API ao submeter formulário
   - Redirecionamento para lista após sucesso
   - Tratamento de erros com mensagens apropriadas

**Arquivos modificados:**
- `src/App.tsx`: Adicionada rota `/carros/clientes/editar/:id`
- `src/pages/EditarCarroCliente.tsx`: Componente criado para edição de carro de cliente

**Resultado:**
- ✅ Tela de edição de carro de cliente funciona corretamente
- ✅ Dados do carro são carregados e exibidos no formulário
- ✅ Edição e atualização funcionam perfeitamente
- ✅ Interface consistente com o resto do sistema

---

### 🔧 Melhorias na Página de Cadastro de Carro de Cliente

**Funcionalidades implementadas:**
- Campo ano do carro agora é opcional
- Melhorias na exibição de dados do cliente no dropdown
- Formatação automática de telefones
- Geração automática de placas provisórias
- Substituição de checkboxes por switches para melhor UX

**1. Campo Ano Opcional:**
- Arquivo: `server/db/database.js`
- Adicionada migration automática em `initializeDatabase()` para garantir que o campo `year` em `customer_cars` seja opcional (nullable)
- A migration verifica se a coluna existe e se está como `NOT NULL`, modificando-a automaticamente na próxima inicialização do servidor
- Campo `year` agora aceita valores nulos, permitindo cadastrar carros sem informar o ano de fabricação

**2. Melhorias no Dropdown de Clientes:**
- Arquivo: `src/pages/NovoCarroCliente.tsx`
- **Exibição de CPF:** Nome do cliente agora exibe o CPF/CNPJ ao lado (quando disponível) no formato: `Nome (CPF/CNPJ)`
- **Múltiplos Telefones:** Dropdown agora exibe todos os telefones do cliente a partir do array `customer.phones`, não apenas o campo legado `customer.phone`
- **Indicador de Telefone Principal:** Telefone principal é marcado com estrela (⭐) à esquerda
- **Ícone de Telefone:** Ícone de telefone (📞) aparece apenas nos telefones secundários, não no principal
- Aplicado também na exibição do cliente selecionado e na etapa de confirmação

**3. Formatação Automática de Telefones:**
- Arquivo: `src/pages/NovoCarroCliente.tsx`
- Criada função `formatPhone` que formata telefones automaticamente no padrão brasileiro:
  - `(xx) xxxxx-xxxx` para números com 11 dígitos (celular)
  - `(xx) xxxx-xxxx` para números com 10 dígitos (fixo)
- Formatação aplicada em todas as exibições de telefone (dropdown, cliente selecionado, etapa de confirmação)
- Telefones são formatados automaticamente na exibição, sem necessidade de formatação prévia no banco de dados

**Arquivos modificados:**
- `server/db/database.js`: Migration automática para campo year opcional
- `src/pages/NovoCarroCliente.tsx`: Melhorias na exibição de clientes, formatação de telefones, geração de placas provisórias e substituição de checkboxes por switches
- `src/pages/EditarCarroCliente.tsx`: Geração de placas provisórias e substituição de checkboxes por switches

**4. Geração de Placa Provisória:**
- Arquivos: `src/pages/NovoCarroCliente.tsx`, `src/pages/EditarCarroCliente.tsx`
- Adicionado link "Placa Provisória" abaixo do campo de placa em ambos os formulários (criação e edição)
- Função `handleGenerateProvisionalPlate` que gera placas aleatórias no formato "AAA" + 4 dígitos (0000-9999)
- Sistema verifica se a placa gerada já existe no banco de dados antes de preencher o campo
- Gera novas placas automaticamente até encontrar uma que não existe (máximo 100 tentativas)
- Placa formatada automaticamente e campo preenchido
- Na edição, o sistema não considera a placa atual como existente, permitindo manter a mesma placa se gerada

**5. Substituição de Checkboxes por Switches:**
- Arquivos: `src/pages/NovoCarroCliente.tsx`, `src/pages/EditarCarroCliente.tsx`
- Substituídos os Checkboxes por componentes Switch (do Radix UI) para os campos:
  - "Cliente é o dono do carro" (`is_owner`)
  - "Carro principal do cliente" (`is_primary`)
- Layout ajustado: labels à esquerda e switches à direita usando `justify-between`
- Campos já eram booleanos no banco de dados, então nenhuma alteração no backend foi necessária
- Interface mais moderna e intuitiva com switches

**Resultado:**
- ✅ Campo ano é opcional, permitindo cadastrar carros sem ano
- ✅ CPF/CNPJ visível ao lado do nome do cliente quando disponível
- ✅ Todos os telefones são exibidos com formatação automática
- ✅ Telefone principal identificado claramente com estrela
- ✅ Interface mais limpa sem ícone de telefone no principal
- ✅ Geração rápida de placas provisórias (formato AAA + 4 dígitos) que não conflitam com placas existentes
- ✅ Interface moderna com switches em vez de checkboxes
- ✅ Melhor experiência do usuário ao buscar e selecionar clientes

---

### 👥 Sistema de Múltiplos Responsáveis por Veículo

**Funcionalidades implementadas:**
- Suporte completo a múltiplos responsáveis (clientes) por veículo
- Interface aprimorada para gerenciar responsáveis primários e secundários
- Melhorias na visualização e listagem de carros com múltiplos responsáveis

**1. Múltiplos Responsáveis no Cadastro:**
- Arquivos: `src/pages/NovoCarroCliente.tsx`, `server/routes/customerCars.js`
- O primeiro cliente selecionado é automaticamente considerado o dono do veículo
- Switch "Existem outros clientes responsáveis pelo carro?" permite adicionar responsáveis secundários
- Quando habilitado, um campo de busca aparece para adicionar múltiplos clientes secundários
- Cada cliente secundário pode ser removido individualmente da lista
- Responsáveis secundários são salvos no banco com `is_owner = FALSE`

**2. Seleção de Proprietário na Confirmação:**
- Arquivo: `src/pages/NovoCarroCliente.tsx`
- Na etapa de confirmação, exibe: "[Nome do dono] é dono deste veículo?" com switch
- Quando o switch está desligado e há responsáveis secundários, um Select aparece permitindo escolher outro proprietário
- O proprietário selecionado terá `is_owner = TRUE`, os demais `is_owner = FALSE`
- Lista de responsáveis secundários mostra estrela (⭐) ao lado do proprietário selecionado

**3. Edição de Carros com Múltiplos Responsáveis:**
- Arquivo: `src/pages/EditarCarroCliente.tsx`
- Carrega todos os registros relacionados à placa do veículo
- Identifica automaticamente o proprietário atual (`is_owner = TRUE`)
- Exibe lista de responsáveis secundários (`is_owner = FALSE`)
- Permite adicionar novos responsáveis secundários via campo de busca
- Permite remover responsáveis secundários individualmente
- Permite alterar o proprietário entre os responsáveis existentes via Select dropdown
- Backend atualiza todos os registros relacionados quando o proprietário muda

**4. Melhorias na Listagem de Carros:**
- Arquivo: `src/pages/CarrosClientes.tsx`
- **Ícone condicional:** Mostra ícone `User` quando há apenas 1 responsável, `Users` quando há múltiplos
- **Botão de expansão:** Ícone `+` aparece ao lado do nome do proprietário quando há responsáveis secundários
- **Expansão inline:** Ao clicar no `+`, lista de responsáveis secundários aparece abaixo do nome do proprietário
- **Contagem de agendamentos:** Cada responsável secundário exibe seu nome seguido da contagem de agendamentos no formato: "Nome (34)"
- **Layout otimizado:** Lista expandida posicionada abaixo do nome, sem sobreposição, com espaçamento adequado
- **Loading específico:** Indicador de carregamento aparece apenas enquanto busca os dados dos responsáveis

**5. Backend - Contagem de Agendamentos:**
- Arquivo: `server/routes/customerCars.js`
- Endpoint `GET /api/customer-cars/:id?include_responsibles=true` retorna contagem de agendamentos para cada responsável
- Query SQL conta todos os agendamentos (`bookings`) onde `cliente_id` corresponde ao responsável e `veiculo_id` corresponde a qualquer `customer_cars.id` com a mesma placa
- Campo `bookings_count` adicionado a cada responsável retornado
- Conversão automática de `secondary_count` para número inteiro no backend

**6. Correções no Backend:**
- Arquivo: `server/routes/customerCars.js`
- Removido filtro `status = TRUE` da query de `secondary_count` para contar todos os responsáveis secundários, mesmo os inativos
- Removido filtro `status = TRUE` da query de responsáveis no endpoint de detalhes para retornar todos os responsáveis relacionados
- Isso garante que responsáveis com `status = 0` sejam contados e exibidos corretamente

**7. Auto-scroll no Cadastro:**
- Arquivo: `src/pages/NovoCarroCliente.tsx`
- Quando um cliente é selecionado na primeira etapa, a tela rola automaticamente para o final
- Melhora a experiência ao preencher o formulário em múltiplas etapas

**Mudanças no Banco de Dados:**
- Estrutura existente de `customer_cars` já suporta múltiplos registros por placa
- Campo `is_owner` identifica o proprietário principal
- Campo `secondary_count` calculado dinamicamente via subquery SQL
- Nenhuma alteração de schema necessária

**Arquivos modificados:**
- `src/pages/NovoCarroCliente.tsx`: 
  - Estados para gerenciar responsáveis secundários
  - Switch para habilitar responsáveis adicionais
  - Campo de busca para adicionar clientes secundários
  - Lógica de seleção de proprietário na confirmação
  - Auto-scroll ao selecionar cliente
- `src/pages/EditarCarroCliente.tsx`:
  - Carregamento de todos os registros relacionados
  - Interface para gerenciar responsáveis secundários
  - Seleção de novo proprietário
- `src/pages/CarrosClientes.tsx`:
  - Ícones condicionais (User/Users)
  - Botão de expansão com ícone +
  - Lista expansível de responsáveis secundários
  - Exibição de contagem de agendamentos
  - Estados para gerenciar expansão e carregamento lazy
- `server/routes/customerCars.js`:
  - Query atualizada para calcular `secondary_count` sem filtro de status
  - Endpoint de detalhes retorna contagem de agendamentos
  - Lógica para buscar todos os responsáveis relacionados (sem filtro de status)

**Resultado:**
- ✅ Sistema completo de múltiplos responsáveis por veículo
- ✅ Interface intuitiva para gerenciar responsáveis no cadastro e edição
- ✅ Visualização clara de responsáveis secundários na listagem
- ✅ Contagem de agendamentos por responsável visível na listagem
- ✅ Ícones visuais que indicam múltiplos responsáveis
- ✅ Expansão inline sem necessidade de modal
- ✅ Performance otimizada com carregamento lazy de dados
- ✅ Backend corrigido para incluir todos os responsáveis, independente do status

---

### 🔧 Correção no Campo de Observações do Agendamento Rápido

**Problema identificado:**
- Observações adicionadas durante a criação de um agendamento via modal de agendamento rápido não estavam sendo salvas no banco de dados
- O campo estava sendo enviado como `observacoes` (plural) pelo frontend, mas o backend esperava `observation` (singular)

**Solução aplicada:**
- Arquivo: `src/components/QuickBookingModal.tsx`
  - Corrigido o nome do campo de `observacoes` para `observation` ao enviar dados para a API
  - Campo de observações agora salva corretamente durante a criação do agendamento
  
- Arquivo: `server/routes/bookings.js`
  - Adicionada compatibilidade para aceitar tanto `observation` quanto `observacoes` na requisição
  - Garante retrocompatibilidade caso algum componente ainda envie o campo no formato antigo

**Resultado:**
- ✅ Observações são salvas corretamente ao criar agendamento via modal rápido
- ✅ Observações aparecem corretamente na página de agendamentos após criação
- ✅ Indicador visual (bolinha amarela piscante) aparece quando há observação
- ✅ Modal de observações carrega e permite editar observações existentes
- ✅ Compatibilidade mantida com ambos os formatos de campo

---

### 📝 Sistema de Observações em Agendamentos

**Funcionalidades implementadas:**
- Campo de observações no agendamento rápido e edição de agendamentos
- Indicador visual de observações ativas
- Modal de edição de observações com textarea
- Exibição e edição de observações na página de agendamentos

**1. Campo de Observações no Agendamento Rápido:**
- Arquivo: `src/components/QuickBookingModal.tsx`
- Campo de input "Observações" adicionado ao lado do campo "Valor do Serviço"
- Ordem de tabulação ajustada: Data Chegada → Hora Chegada → Data Saída → Hora Saída → Observações → Valor do Serviço
- Observações são salvas no banco de dados e vinculadas ao agendamento

**2. Indicador Visual de Observações:**
- Arquivo: `src/pages/Agendamentos.tsx`
- Bolinha amarela piscante aparece no canto superior direito da linha do agendamento quando há observação
- Animação CSS `blink-yellow` criada para o efeito visual
- Indicador visível tanto na aba "Agendamentos Gerenciados" quanto "Fila Livre"

**3. Modal de Observações:**
- Arquivo: `src/pages/Agendamentos.tsx`
- Botão de bloco de notas (StickyNote) sempre visível na seção de ações
- Cor do botão muda para amarelo quando há observação existente
- Modal abre com textarea editável mostrando observações atuais
- Permite adicionar, editar ou remover observações
- Salva alterações via API ao confirmar

**4. Edição de Agendamentos:**
- Arquivo: `src/components/BookingModal.tsx`
- Modal de agendamento agora suporta modo de edição
- Ao clicar em "Editar" na página de agendamentos, o modal abre pré-preenchido com dados existentes
- Permite editar todos os campos do agendamento, incluindo observações
- Botão "Confirmar" atualiza o agendamento existente ao invés de criar novo

**Mudanças no Banco de Dados:**
- Arquivo: `server/db/database.js`
- Migration automática adicionada para garantir que a coluna `observacoes TEXT` existe na tabela `bookings`
- Campo `observacoes` é opcional e pode ser NULL

**Arquivos modificados:**
- `src/components/QuickBookingModal.tsx`: Campo de observações, ordem de tabulação, envio correto para API
- `src/pages/Agendamentos.tsx`: Indicador visual, modal de observações, botão de bloco de notas
- `src/components/BookingModal.tsx`: Modo de edição, pré-preenchimento de dados
- `src/index.css`: Animação CSS `blink-yellow` para bolinha amarela
- `server/routes/bookings.js`: Aceita campo `observation` ou `observacoes`, salva no banco
- `server/db/database.js`: Migration para coluna `observacoes`

**Resultado:**
- ✅ Observações podem ser adicionadas durante criação de agendamento rápido
- ✅ Observações visíveis na listagem com indicador visual claro
- ✅ Edição de observações via modal dedicado
- ✅ Edição completa de agendamentos incluindo observações
- ✅ Interface intuitiva e visualmente clara

---

### 💰 Atribuição de Faturamento ao Dono do Veículo

**Problema identificado:**
- Os lançamentos de receita (`lancamentos_receita`) eram criados com o `cliente_id` do cliente que agendou o serviço
- Em casos onde o agendamento era feito por um responsável secundário, os relatórios mostravam o nome errado
- O correto seria sempre usar o `cliente_id` do dono do veículo (`is_owner = TRUE`)

**Solução aplicada:**
- Arquivo: `server/routes/bookings.js`
- No endpoint `PUT /api/bookings/:id/payment`:
  - Antes de criar ou atualizar `lancamento_receita`, busca o veículo pelo `veiculo_id`
  - Identifica o dono do veículo fazendo query para encontrar o registro em `customer_cars` com `is_owner = TRUE` e a mesma placa
  - Usa o `customer_id` do dono do veículo para todos os lançamentos de receita
  - Garante que relatórios sempre mostrem o nome do proprietário do veículo

**Resultado:**
- ✅ Lançamentos de receita sempre vinculados ao dono do veículo
- ✅ Relatórios mostram o nome correto do proprietário
- ✅ Faturamento mensurado corretamente por veículo e proprietário
- ✅ Mantém integridade dos dados financeiros

---

### 🔄 Renomeação de "Despesa de Salário" para "Despesa com Pessoal"

**Funcionalidades implementadas:**
- Renomeação completa da nomenclatura no banco de dados e frontend
- Permissão de múltiplas despesas com pessoal (remoção da restrição de exclusividade)
- Migration automática na inicialização do sistema

**1. Mudanças no Banco de Dados:**
- Arquivo: `server/db/schema-mariadb.sql`
- Coluna `is_salario` renomeada para `is_pessoal` na tabela `despesas`
- Índice `idx_despesas_is_salario` renomeado para `idx_despesas_is_pessoal`
- Migration automática: `server/db/migrations/rename_is_salario_to_is_pessoal.sql`
- Migration executada automaticamente na inicialização do sistema via `initializeDatabase()`

**2. Remoção da Regra de Exclusividade:**
- Arquivo: `server/db/database.js`
- Função `createDespesa.run()`: Removida lógica que desmarcava outras despesas
- Função `updateDespesa.run()`: Removida lógica que desmarcava outras despesas
- Resultado: Múltiplas despesas podem ter `is_pessoal = TRUE` simultaneamente

**3. Atualizações no Backend:**
- Arquivo: `server/routes/despesas.js`
  - Todas as referências `is_salario` → `is_pessoal`
  - Comentários atualizados de "despesa de salário" para "despesa com pessoal"
  - Mensagens de validação atualizadas
- Arquivo: `server/routes/lancamentosDespesas.js`
  - Todas as referências e validações atualizadas
  - Mensagens de erro atualizadas

**4. Atualizações no Frontend:**
- Arquivo: `src/pages/RegistrarDespesa.tsx`:
  - Estado renomeado: `isSalario` → `isPessoal`
  - Label atualizado: "Esta é a Despesa de Salário" → "Esta é uma Despesa com pessoal"
  - Removida mensagem sobre "apenas uma despesa pode ser marcada"
  - Mensagem atualizada indicando que múltiplas despesas com pessoal são permitidas
- Arquivo: `src/pages/LancarDespesa.tsx`:
  - Função helper renomeada: `isDespesaSalario` → `isDespesaPessoal`
  - Todos os textos e validações atualizados
  - Mensagens atualizadas para "Despesa com pessoal"
- Arquivo: `src/services/api.ts`:
  - Interfaces TypeScript atualizadas: `is_salario` → `is_pessoal`

**Arquivos modificados:**
- `server/db/schema-mariadb.sql`: Schema atualizado
- `server/db/database.js`: Migration automática e queries atualizadas
- `server/db/migrations/rename_is_salario_to_is_pessoal.sql`: Arquivo de migration criado
- `server/routes/despesas.js`: Rotas atualizadas
- `server/routes/lancamentosDespesas.js`: Rotas atualizadas
- `src/pages/RegistrarDespesa.tsx`: Frontend atualizado
- `src/pages/LancarDespesa.tsx`: Frontend atualizado
- `src/services/api.ts`: Interfaces atualizadas

**Resultado:**
- ✅ Nomenclatura atualizada em todo o sistema
- ✅ Múltiplas despesas com pessoal permitidas
- ✅ Migration automática na inicialização
- ✅ Validações mantidas (funcionário obrigatório, centro de custo automático)
- ✅ Compatibilidade com dados existentes preservada

---

## Status

🚧 **Versão Beta** - Esta é uma versão em desenvolvimento. Novas funcionalidades e correções serão adicionadas continuamente.

---

## Próximas Atualizações

_As próximas correções e melhorias serão documentadas aqui conforme forem implementadas._

