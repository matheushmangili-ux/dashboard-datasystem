# Texas Center - Western Dashboard v2.1

Painel em tempo real para colaboradores acompanharem resultados operacionais do ERP Data System integrados ao E-Commerce Tray, com identidade visual Western/Country e interface moderna.

## Versão Atual: v2.1 - Sidebar Benchmark + Animações + Humor Western

### v2.1 - Sidebar, Animações Sutis e Humor
- **Sidebar com benchmark de varejo:** Menu reorganizado em seções ("Operacional", "Canais de Venda", "Gestão") inspirado em dashboards como Bling ERP, Shopify e Omie, com divisores dourados, badges de contagem, mini-card de faturamento do dia e indicadores de status de conexão (Data System / Tray).
- **Tooltips western:** Cada item do menu possui tooltips temáticos ("Onde o dinheiro galopa", "Os cowboys da operação", "O saloon principal").
- **Frases de cowboy rotativas:** 12 frases de humor western que rotacionam no footer da sidebar a cada 12 segundos.
- **Easter egg:** Clique no logo TC para ver a animação de laço.
- **Animações sutis na home:** A atmosfera de deserto da tela de login se estende ao dashboard com gradiente de céu, estrelas cintilantes, partículas de poeira flutuantes e silhueta de horizonte — tudo em opacidade muito baixa (3-6%) para não distrair.

### v2.0 - Western UI Overhaul
- **Tema Western/Country completo:** Paleta de cores inspirada no velho oeste (couro, dourado, areia, ferrugem, cacto) com suporte a light e dark mode.
- **Login animado:** Cena de deserto com sol pulsante, tumbleweeds rolando, cactos balançando, estrelas cintilando e partículas de poeira, com ornamentos dourados no card.
- **Dashboard temático:** Animações SVG de cavalo galopando, tumbleweeds, cactos e nuvens de poeira no rodapé. Footer com separador gradiente dourado.
- **Dual-Channel Dashboard:** Visualização separada em abas de "Loja Física (Data System)" e "E-commerce (Tray)", cada uma com ranking, meta e gráfico de tendência.
- **Credenciais demo:** Login com **Ana Ribeiro / 1234** (ou admin / admin).
- **Deploy otimizado (Vercel Ready):** Build TypeScript rigoroso com deploy em um clique via Vercel.

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
