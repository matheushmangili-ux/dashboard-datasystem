# Integracao futura do Data System

O dashboard ja esta desacoplado dos conectores. Quando o acesso ao ERP chegar, a tela principal nao precisa mudar.

## Onde plugar

- API pronta: [lib/erp/api-client.ts](./lib/erp/api-client.ts)
- Banco pronto: [lib/erp/db-client.ts](./lib/erp/db-client.ts)
- Integracao proprietaria ou regra especial: [lib/erp/connectors/custom-connector.ts](./lib/erp/connectors/custom-connector.ts)
- Registro dos conectores: [lib/erp/registry.ts](./lib/erp/registry.ts)
- Ecommerce Tray: [lib/tray/service.ts](./lib/tray/service.ts)
- Diagnostico da infraestrutura: `GET /api/integration`
- Resumo do ecommerce: `GET /api/tray/summary`

## Caminho mais seguro quando o acesso chegar

1. Preencher as variaveis em `.env.local`
2. Escolher o modo com `ERP_MODE=api`, `database` ou `hybrid`
3. Se o Data System exigir logica fora do padrao, habilitar `ERP_CUSTOM_CONNECTOR_ENABLED=true`
4. Implementar a regra final dentro de `loadCustomDashboard`
5. Validar o retorno no formato `DashboardSnapshot`

## Contrato interno do dashboard

O front espera um objeto `DashboardSnapshot` com:

- `source`: estado da origem de dados
- `summary`: empresa, periodo e colaboradores ativos
- `metrics`: cards principais
- `trendPoints`: grafico de ritmo
- `leaders`: ranking
- `alerts`: alertas operacionais

Esse contrato esta centralizado em [lib/types.ts](./lib/types.ts).

## Estrategia recomendada para o Data System

- Comecar por `database` se o banco estiver mais acessivel do que a API
- Usar `hybrid` se parte dos indicadores vier do banco e parte da API
- Usar `custom connector` se houver autenticacao especial, joins complexos ou regras proprietarias

## Diagnostico rapido

A rota `GET /api/integration` mostra:

- conector ativo
- modo selecionado
- conectores disponiveis
- variaveis ainda pendentes

Isso ajuda a equipe a ligar a integracao sem precisar entrar na camada visual.
