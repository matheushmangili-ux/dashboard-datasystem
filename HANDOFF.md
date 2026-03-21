# Handoff para desenvolvimento

Este projeto ja tem front-end funcional e estrutura de integracao aberta.

## O que ja existe

- Dashboard com visual final inicial
- Separacao visual entre `Loja Fisica` e `Ecommerce`
- Camada demo de acesso por perfil
- Area administrativa demo
- Integracao preparada para `Data System` e `Tray`

## Onde conectar o Data System

- API do ERP: `lib/erp/api-client.ts`
- Banco do ERP: `lib/erp/db-client.ts`
- Logica customizada do ERP: `lib/erp/connectors/custom-connector.ts`

## Onde conectar a Tray

- Servico principal: `lib/tray/service.ts`
- Endpoint interno: `app/api/tray/summary/route.ts`

## Contrato principal que o front consome

- `lib/types.ts`

O objeto central e `DashboardSnapshot`.

## Entradas visuais principais

- Home: `app/page.tsx`
- Shell de acesso: `components/access-shell.tsx`
- Workspace: `components/app-workspace.tsx`
- Dashboard: `components/realtime-dashboard.tsx`
- Canais: `components/sales-channel-overview.tsx`
- Admin: `components/admin-workspace.tsx`
- Estilo global: `app/globals.css`

## Variaveis de ambiente

Use `.env.example` como base e copie para `.env.local`.

## Recomendacao de entrega

1. Subir o projeto em um repositorio Git
2. Versionar junto `.env.example`, nunca `.env.local`
3. Abrir uma branch para integracao do Data System
4. Validar primeiro o contrato `DashboardSnapshot`
5. So depois ligar autenticacao real
