# TCE Finance UI

Frontend da aplicação de controle financeiro, desenvolvido com Angular 20, com foco em visualização de indicadores e gestão de transações.

Este projeto foi estruturado para consumir uma API REST e oferecer uma experiência fluida para operações de dashboard e CRUD de transações.

## Descrição do Projeto

O sistema permite:

- Visualizar resumo financeiro mensal (saldo, entradas e saídas).
- Acompanhar gráfico de evolução de saldo por dia.
- Listar transações com paginação.
- Filtrar transações por mês e categoria.
- Criar, editar e excluir transações com feedback visual ao usuário.

## Arquitetura (Frontend)

Arquitetura baseada em Angular moderno com componentes standalone e divisão por responsabilidades:

- `core/`: serviços transversais (API, loading, notificações, interceptor HTTP).
- `features/`: módulos de negócio por funcionalidade (`dashboard`, `transactions`).
- `layout/`: estrutura visual principal da aplicação.
- `shared/`: componentes reutilizáveis (loading overlay, diálogo de confirmação).
- `models/`: contratos de dados (DTOs, entidades e respostas paginadas).

Pontos arquiteturais relevantes:

- Componentes standalone com lazy loading via rotas.
- `HttpInterceptorFn` para controle global de loading e tratamento de erros HTTP.
- Uso de serviços para encapsular chamadas REST.
- SSR habilitado na configuração do projeto Angular.

## Tecnologias Utilizadas

- Angular 20
- Angular Router (lazy loading)
- Angular Forms (Template-driven e Reactive Forms)
- Angular Material + CDK
- RxJS
- SCSS
- Angular SSR + Express (estrutura de renderização server-side)
- Karma + Jasmine (testes unitários)

## ️Como Executar o Projeto

### Pré-requisitos

- Node.js 20+
- npm 10+
- Angular CLI 20 (opcional, pode usar `npx`)

### Configuração inicial

Antes de executar o projeto, informe o ID do usuário que será utilizado nas operações de criação de transação.

Abra o arquivo `src/app/features/transactions/transactions.component.ts` e localize o método `openCreateDialog()`. Substitua o valor do campo `userId` pelo ID do usuário cadastrado no backend:

```typescript
const createDto: CreateTransactionDto = {
  ...result,
  userId: 'SEU-USER-ID-AQUI' // substitua pelo ID do seu usuário
};
```

> **Nota:** Essa abordagem foi adotada para simplificar o projeto, dispensando a implementação de um fluxo completo de autenticação. Em um cenário real, o `userId` seria obtido do contexto de sessão autenticada.

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm start
```

A aplicação ficará disponível em:

- `http://localhost:4200`

### Build de produção

```bash
npm run build
```

### Testes unitários

```bash
npm test
```

## Integração com Backend

O frontend está configurado para consumir a API em:

- `http://localhost:5000/api/`

Endpoints utilizados atualmente:

- `GET /categories`
- `GET /transactions` (com paginação e filtros)
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`
- `GET /transactions/summary?month=YYYY-MM[&categoryId=...]`
- `GET /transactions/chart?month=YYYY-MM[&categoryId=...]`

Observações:

- O `userId` ainda está fixo no fluxo de criação de transação (placeholder temporário).
- A URL base da API está hardcoded no frontend (sem arquivo de environment dedicado até o momento).

## Funcionalidades Implementadas

- Dashboard com cards de saldo, entradas e saídas.
- Gráfico de barras com evolução diária do saldo.
- Filtro de dashboard por categoria.
- Listagem de transações em tabela.
- Paginação com Angular Material Paginator.
- Filtro por mês e categoria na listagem de transações.
- Cadastro de nova transação via modal.
- Edição de transação via modal.
- Exclusão com confirmação.
- Feedbacks visuais:
	- Snackbar de sucesso/erro.
	- Overlay global de loading durante requisições.

## Decisões Técnicas Relevantes

- Adoção de componentes standalone para reduzir acoplamento e simplificar composição.
- Lazy loading por rota para melhorar tempo de carregamento inicial.
- Interceptor HTTP centralizando comportamento transversal:
	- Controle de estado de carregamento.
	- Mapeamento de mensagens por status HTTP.
- Uso de contratos tipados (`models`) para previsibilidade das integrações.
- Separação entre camada de serviço e camada de apresentação.

## Possíveis Melhorias Futuras

- Introduzir `environment.ts`/`environment.prod.ts` para parametrizar base URL da API.
- Padronizar consumo HTTP do dashboard via `ApiService` (hoje parte das chamadas está direta no `HttpClient`).
- Implementar autenticação/autorização e remover `userId` fixo.
- Expandir suíte de testes unitários e adicionar testes de integração/e2e.
- Evoluir filtros de período (mês/ano dinâmicos) e ordenação avançada da tabela.
- Melhorar acessibilidade (ARIA) e internacionalização.

## Estado do Projeto

Projeto funcional para demonstração técnica de frontend Angular com integração REST, cobrindo cenários centrais de dashboard e gestão de transações.
