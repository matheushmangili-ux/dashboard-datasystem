import type { DashboardSnapshot, ErpMode } from "@/lib/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercentage(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1
  }).format(value / 100);
}

function toDeltaLabel(delta: number) {
  const signal = delta >= 0 ? "+" : "";
  return `${signal}${delta.toFixed(1)}% vs ontem`;
}

export function buildMockSnapshot(
  mode: ErpMode = "mock",
  health: DashboardSnapshot["source"]["health"] = "fallback",
  detail = "Painel carregado com dados demonstrativos enquanto a integração real não está configurada."
): DashboardSnapshot {
  const now = new Date();
  const minuteFactor = now.getHours() * 60 + now.getMinutes();
  const revenue = 134_000 + (minuteFactor % 11) * 4_250;
  const revenueTarget = 182_000;
  const orders = 184 + (minuteFactor % 17) * 3;
  const avgTicket = revenue / orders;
  const conversion = 31 + (minuteFactor % 9) * 0.7;
  const physicalRevenue = revenue * 0.58;
  const ecommerceRevenue = revenue * 0.42;
  const physicalOrders = Math.round(orders * 0.54);
  const ecommerceOrders = Math.round(orders * 0.46);

  return {
    generatedAt: now.toISOString(),
    source: {
      mode,
      label:
        mode === "hybrid"
          ? "Modo híbrido"
          : mode === "api"
            ? "API do ERP"
            : mode === "database"
              ? "Banco do ERP"
              : "Modo demonstração",
      health,
      detail
    },
    summary: {
      companyName: "Data System",
      periodLabel: "Hoje",
      activeEmployees: 42
    },
    metrics: [
      {
        id: "net-revenue",
        label: "Receita do dia",
        value: formatCurrency(revenue),
        caption: `Meta ${formatCurrency(revenueTarget)}`,
        delta: 8.4,
        deltaLabel: toDeltaLabel(8.4)
      },
      {
        id: "achievement",
        label: "Meta atingida",
        value: formatPercentage((revenue / revenueTarget) * 100),
        caption: "Meta geral da operação",
        delta: 3.2,
        deltaLabel: toDeltaLabel(3.2)
      },
      {
        id: "orders",
        label: "Pedidos processados",
        value: orders.toString(),
        caption: "Pedidos faturados hoje",
        delta: -1.8,
        deltaLabel: toDeltaLabel(-1.8)
      },
      {
        id: "avg-ticket",
        label: "Ticket médio",
        value: formatCurrency(avgTicket),
        caption: `Conversão ${conversion.toFixed(1)}%`,
        delta: 5.1,
        deltaLabel: toDeltaLabel(5.1)
      }
    ],
    salesChannels: [
      {
        id: "physical",
        label: "Loja física",
        description: "Resultados originados no ponto de venda e na operação presencial.",
        sourceLabel: "ERP Data System",
        health: health === "missing-config" ? "fallback" : health,
        revenueLabel: formatCurrency(physicalRevenue),
        ordersLabel: physicalOrders.toString(),
        averageTicketLabel: formatCurrency(physicalRevenue / Math.max(physicalOrders, 1)),
        deltaLabel: "+6.8% vs ontem",
        trendPoints: [
          { label: "08h", value: 8, target: 9, displayValue: "8k" },
          { label: "09h", value: 11, target: 10, displayValue: "11k" },
          { label: "10h", value: 12, target: 13, displayValue: "12k" },
          { label: "11h", value: 15, target: 14, displayValue: "15k" },
          { label: "12h", value: 10, target: 11, displayValue: "10k" },
          { label: "13h", value: 9, target: 10, displayValue: "9k" },
          { label: "14h", value: 14, target: 13, displayValue: "14k" },
          { label: "15h", value: 18, target: 16, displayValue: "18k" }
        ]
      },
      {
        id: "ecommerce",
        label: "E-commerce",
        description: "Pedidos online, catálogo digital e jornada da loja virtual.",
        sourceLabel: "Tray",
        health: "fallback",
        revenueLabel: formatCurrency(ecommerceRevenue),
        ordersLabel: ecommerceOrders.toString(),
        averageTicketLabel: formatCurrency(
          ecommerceRevenue / Math.max(ecommerceOrders, 1)
        ),
        deltaLabel: "+11.2% vs ontem",
        trendPoints: [
          { label: "08h", value: 6, target: 8, displayValue: "6k" },
          { label: "09h", value: 7, target: 9, displayValue: "7k" },
          { label: "10h", value: 10, target: 11, displayValue: "10k" },
          { label: "11h", value: 12, target: 11, displayValue: "12k" },
          { label: "12h", value: 11, target: 12, displayValue: "11k" },
          { label: "13h", value: 7, target: 8, displayValue: "7k" },
          { label: "14h", value: 10, target: 9, displayValue: "10k" },
          { label: "15h", value: 12, target: 12, displayValue: "12k" }
        ]
      }
    ],
    trendPoints: [
      { label: "08h", value: 14, target: 18, displayValue: "14k" },
      { label: "09h", value: 18, target: 20, displayValue: "18k" },
      { label: "10h", value: 22, target: 24, displayValue: "22k" },
      { label: "11h", value: 27, target: 25, displayValue: "27k" },
      { label: "12h", value: 21, target: 23, displayValue: "21k" },
      { label: "13h", value: 16, target: 18, displayValue: "16k" },
      { label: "14h", value: 24, target: 22, displayValue: "24k" },
      { label: "15h", value: 30, target: 28, displayValue: "30k" }
    ],
    leaders: [
      {
        id: "leader-1",
        rank: 1,
        name: "Mariana Costa",
        team: "Comercial Sul",
        displayValue: formatCurrency(42_900),
        status: "129% da meta"
      },
      {
        id: "leader-2",
        rank: 2,
        name: "Carlos Mendes",
        team: "Inside Sales",
        displayValue: formatCurrency(39_200),
        status: "118% da meta"
      },
      {
        id: "leader-3",
        rank: 3,
        name: "Juliana Rocha",
        team: "Operação B2B",
        displayValue: formatCurrency(35_700),
        status: "111% da meta"
      }
    ],
    channelLeaderboards: [
      {
        channelId: "physical",
        title: "Top colaboradores da loja física",
        leaders: [
          {
            id: "physical-leader-1",
            rank: 1,
            name: "Mariana Costa",
            team: "Loja Centro",
            displayValue: formatCurrency(24_900),
            status: "118% da meta"
          },
          {
            id: "physical-leader-2",
            rank: 2,
            name: "Eduardo Lima",
            team: "Loja Norte",
            displayValue: formatCurrency(22_300),
            status: "110% da meta"
          },
          {
            id: "physical-leader-3",
            rank: 3,
            name: "Bianca Souza",
            team: "Loja Sul",
            displayValue: formatCurrency(19_800),
            status: "103% da meta"
          }
        ]
      },
      {
        channelId: "ecommerce",
        title: "Top colaboradores do e-commerce",
        leaders: [
          {
            id: "ecommerce-leader-1",
            rank: 1,
            name: "Carlos Mendes",
            team: "Inside Sales",
            displayValue: formatCurrency(18_400),
            status: "129 pedidos"
          },
          {
            id: "ecommerce-leader-2",
            rank: 2,
            name: "Juliana Rocha",
            team: "Marketplace",
            displayValue: formatCurrency(16_900),
            status: "117 pedidos"
          },
          {
            id: "ecommerce-leader-3",
            rank: 3,
            name: "Renato Alves",
            team: "Atendimento Digital",
            displayValue: formatCurrency(15_300),
            status: "108 pedidos"
          }
        ]
      }
    ],
    topProducts: [
      {
        id: "product-top-1",
        name: "Bota Canyon Classic",
        channelLabel: "Loja física",
        unitsSold: 128,
        revenueLabel: formatCurrency(38_400),
        statusLabel: "Maior giro da semana"
      },
      {
        id: "product-top-2",
        name: "Camisa Ranch Denim",
        channelLabel: "E-commerce",
        unitsSold: 112,
        revenueLabel: formatCurrency(24_800),
        statusLabel: "Alta procura online"
      },
      {
        id: "product-top-3",
        name: "Cinto Bronze Saddle",
        channelLabel: "Loja física",
        unitsSold: 96,
        revenueLabel: formatCurrency(11_500),
        statusLabel: "Boa conversão presencial"
      },
      {
        id: "product-top-4",
        name: "Jaqueta Outpost Terra",
        channelLabel: "E-commerce",
        unitsSold: 84,
        revenueLabel: formatCurrency(29_900),
        statusLabel: "Ticket premium"
      },
      {
        id: "product-top-5",
        name: "Chapeu Dust Trail",
        channelLabel: "E-commerce",
        unitsSold: 79,
        revenueLabel: formatCurrency(9_200),
        statusLabel: "Volume constante"
      }
    ],
    lowProducts: [
      {
        id: "product-low-1",
        name: "Colete Dry Mesa",
        channelLabel: "Loja física",
        unitsSold: 4,
        revenueLabel: formatCurrency(860),
        statusLabel: "Baixa rotação"
      },
      {
        id: "product-low-2",
        name: "Carteira Old Pine",
        channelLabel: "E-commerce",
        unitsSold: 6,
        revenueLabel: formatCurrency(540),
        statusLabel: "Precisa revisar exposição"
      },
      {
        id: "product-low-3",
        name: "Bandana Mesa Red",
        channelLabel: "Loja física",
        unitsSold: 8,
        revenueLabel: formatCurrency(320),
        statusLabel: "Sem tração"
      },
      {
        id: "product-low-4",
        name: "Bolsa Prairie Mini",
        channelLabel: "E-commerce",
        unitsSold: 9,
        revenueLabel: formatCurrency(1_100),
        statusLabel: "Conversão abaixo da média"
      },
      {
        id: "product-low-5",
        name: "Fivela Copper Sun",
        channelLabel: "Loja física",
        unitsSold: 11,
        revenueLabel: formatCurrency(610),
        statusLabel: "Baixo interesse"
      }
    ],
    alerts: [
      {
        id: "alert-1",
        title: "Fila acima do previsto",
        message: "Pedidos aguardando separação subiram 14% na última hora.",
        severity: "high"
      },
      {
        id: "alert-2",
        title: "Time Norte abaixo da meta",
        message: "Equipe entregou 82% do planejado até agora.",
        severity: "medium"
      },
      {
        id: "alert-3",
        title: "Meta de ticket em destaque",
        message: "Ticket médio segue acima da referência diária.",
        severity: "low"
      }
    ]
  };
}
