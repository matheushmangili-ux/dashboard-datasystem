# Pulse ERP Dashboard - v2.0 Executive Premium 🚀

MVP de painel em tempo real para colaboradores acompanharem resultados operacionais do ERP Data System integrados ao E-Commerce Tray, agora com uma interface Premium focada em Liderança Executiva.

## 🌟 Versão Atual: v2.0 - Executive Premium UI & Retro Animations
*Principais atualizações e funcionalidades entregues nesta versão:*

- **Design Premium ("Glassmorphism"):** Interface totalmente refeita em Dark Mode, desenhada para clareza em monitores de grande formato e reuniões gerenciais, transmitindo credibilidade e sofisticação.
- **Animações Retro (Gameboy Edition):** Animações contínuas de fundo com ET/UFO e um Cavalo operando via Pixel Art 100% SVG in-line (sem uso de GIFs externos), garantindo performance e uma identidade visual gamer 8-bits nas cores do clássico Gameboy.
- **Acesso Demo Centralizado:** Fluxo de login polido para uso de demonstração rápida (Credenciais padrão da v2.0: **`admin` / `admin`**).
- **Dual-Channel Dashboard:** Visualização separada em abas de "Loja Física (Data System)" e "E-commerce (Tray)", cada uma possuindo seu próprio ranking, meta, e gráfico de tendência.
- **Deploy Otimizado (Vercel Ready):** Refatoração rigorosa em Typescript para aprovação em builds rigorosos e deploy de produção em um clique via Vercel.

---

## 🛠 Camada de Dados e Integrações

- **Atualização Automática:** Polling em `/api/dashboard`
- **Quatro Modos de Operação do ERP:** `mock`, `api`, `database` e `hybrid`
- Estrutura pronta para cruzar metas, realizado diário, ranking de vendedores e painel de alertas unificados.
- Registro de conectores com arquitetura limpa para deixar a integração futura plugável.
- Rota de diagnóstico técnico em `/api/integration`.
- Mock preparado com espelho resumido de dados da Tray em `/api/tray/summary`.

## ⚙️ Stack Tecnológica

- **Frontend:** Next.js + React + Tailwind CSS + Lucide Icons + Recharts
- **Linguagem:** TypeScript
- **Integração de BD:** SQL Server via pacote `mssql`
- **Deploy Recomendado:** Vercel

---

## 🚀 Como rodar localmente

1. Instale o Node.js 20 ou superior
2. Copie `.env.example` para `.env.local`
3. Ajuste as credenciais da API e do banco de dados (se não for usar o Mock)
4. Execute os seguintes comandos:

```bash
npm install
npm run dev
```

Você poderá acessar o painel em `http://localhost:3000` usando o login `admin` e senha `admin`.

---

## Modos de Dados do ERP configuráveis

### `ERP_MODE=mock` (Padrão)
Usa dados demonstrativos na memória. Perfeito para validar o layout hiper-realista e as micro-interações sem precisar da VPN do banco ativa.

### `ERP_MODE=api`
Busca o dashboard na rota configurada em `ERP_API_BASE_URL + ERP_API_DASHBOARD_PATH`. O endpoint deve retornar um JSON no formato mapeado de `DashboardSnapshot`.

### `ERP_MODE=database`
Executa a procedure ou query configurada em `ERP_DB_DASHBOARD_QUERY`. A fonte de dados já espera Múltiplos Recordsets (Resumo, Tendência, Ranking, Alertas) para montar o painel com uma única ida ao banco.

### `ERP_MODE=hybrid`
Combina conectividade com o Banco direto e API legada. Banco alimenta os cards rápidos (faturamento, metas) e a API os cálculos complexos (alertas, tickets).

---

## Próximos passos e Handoff 

- A UI da tela já está preparada para consumir da fonte de dados de produção do Data System.
- Uma rota dedicada `Ecommerce` já aceita inputs da plataforma Tray.
- Há um guia arquitetural para dev em [INTEGRATION.md](./INTEGRATION.md).
- Documentação para um futuro dev assumir o bastão está em [HANDOFF.md](./HANDOFF.md).
