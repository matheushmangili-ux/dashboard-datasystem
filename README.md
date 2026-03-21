# Pulse ERP Dashboard

MVP de painel em tempo real para colaboradores acompanharem resultados operacionais do ERP Data System.

## O que ja esta pronto

- Dashboard web responsivo com visual focado em operacao
- Atualizacao automatica via polling em `/api/dashboard`
- Camada de integracao com quatro modos: `mock`, `api`, `database` e `hybrid`
- Estrutura pronta para metas, realizado, ranking e alertas
- Camada de acesso demo com perfis e permissao visual por papel
- Area administrativa demo com equipes, permissoes e prontidao de integracao
- Contrato de dados documentado para API e banco
- Registro de conectores para deixar a integracao futura plugavel
- Rota de diagnostico em `/api/integration`
- Resumo interno da Tray em `/api/tray/summary`

## Stack escolhida

- Next.js + TypeScript
- React
- SQL Server via pacote `mssql`

## Como rodar

1. Instale o Node.js 20 ou superior
2. Instale as dependencias
3. Copie `.env.example` para `.env.local`
4. Ajuste as credenciais da API e do banco do Data System
5. Rode o projeto em modo desenvolvimento

```bash
npm install
npm run dev
```

## Modos de dados

### `ERP_MODE=mock`

Usa dados demonstrativos e permite validar layout, navegacao e refresh do painel.

### `ERP_MODE=api`

Busca o dashboard na rota configurada em `ERP_API_BASE_URL + ERP_API_DASHBOARD_PATH`.

O endpoint deve retornar um JSON no formato de `DashboardSnapshot`.

### `ERP_MODE=database`

Executa a query configurada em `ERP_DB_DASHBOARD_QUERY`.

A query deve retornar 4 recordsets nesta ordem:

1. Resumo
2. Tendencia
3. Ranking
4. Alertas

Colunas esperadas:

- Resumo: `company_name`, `period_label`, `active_employees`, `net_revenue`, `revenue_target`, `orders_count`, `avg_ticket`, `conversion_rate`
- Tendencia: `label`, `value`, `target`
- Ranking: `collaborator`, `team`, `value`, `status`
- Alertas: `title`, `message`, `severity`

### `ERP_MODE=hybrid`

Combina banco e API:

- Banco alimenta resumo, cards e tendencia
- API alimenta ranking e alertas

Esse modo faz sentido quando o Data System tem leitura de banco estavel, mas certas regras de negocio ja saem prontas da API.

## Proximo passo recomendado

Para plugar no Data System real, eu seguiria esta ordem:

1. Mapear quais tabelas, views ou endpoints entregam metas, realizado, ranking e alertas
2. Definir um contrato unico de dashboard
3. Validar um primeiro fluxo em `ERP_MODE=database` ou `ERP_MODE=api`
4. Ajustar permissoes por colaborador
5. Evoluir para WebSocket ou fila de eventos se precisarmos latencia menor

## Portas abertas para integracao

- O dashboard consome apenas o contrato interno `DashboardSnapshot`
- Os conectores ficaram separados da interface
- Existe um conector customizado reservado para o Data System real
- A rota `/api/integration` mostra o que esta pronto e o que ainda falta
- O canal `Ecommerce` pode ser alimentado pela Tray sem mexer na visao da `Loja Fisica`

Mais detalhes em [INTEGRATION.md](./INTEGRATION.md).

## Handoff rapido

Se voce for passar este projeto para outro desenvolvedor, use tambem [HANDOFF.md](./HANDOFF.md).

## Observacao

Neste ambiente eu nao consegui executar `npm install` nem subir o app porque `node` e `npm` ainda nao estao instalados no sistema. O codigo ficou preparado no repositorio para a proxima etapa.
