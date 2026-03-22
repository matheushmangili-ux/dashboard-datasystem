import type {
  AlertItem,
  ChannelLeaderboard,
  DashboardSnapshot,
  ErpMode,
  MetricCard,
  ProductRankingEntry,
  SalesChannelSnapshot,
  SourceHealth,
  YearOverYearItem
} from "@/lib/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

const GLOBAL_METRICS: MetricCard[] = [
  {
    id: "total-revenue",
    label: "Faturamento Global",
    value: formatCurrency(185400),
    caption: "Hoje: Loja Física + E-commerce",
    delta: 12.5,
    deltaLabel: "vs dia anterior"
  },
  {
    id: "active-customers",
    label: "Fluxo de Clientes",
    value: "1.240",
    caption: "Tráfego online + loja física",
    delta: 5.2,
    deltaLabel: "Acima da média"
  }
];

const PHYSICAL_CHANNEL: SalesChannelSnapshot = {
  id: "physical",
  label: "Texas Center - Matriz",
  description: "Operação física rodando em Data System ERP.",
  sourceLabel: "Data System",
  health: "connected",
  revenueLabel: formatCurrency(102500),
  ordersLabel: "135 tickets",
  ordersCount: 135,
  averageTicketLabel: formatCurrency(759.25),
  piecesPerTicket: 2.8,
  conversionRate: 24.5,
  deltaLabel: "+8% vs ontem",
  trendPoints: [
    { label: "09:00", value: 8000, target: 10000, displayValue: "R$ 8k" },
    { label: "11:00", value: 25000, target: 20000, displayValue: "R$ 25k" },
    { label: "13:00", value: 45000, target: 40000, displayValue: "R$ 45k" },
    { label: "15:00", value: 68000, target: 60000, displayValue: "R$ 68k" },
    { label: "17:00", value: 102500, target: 90000, displayValue: "R$ 102k" }
  ]
};

const ECOMMERCE_CHANNEL: SalesChannelSnapshot = {
  id: "ecommerce",
  label: "Texas Center - Digital",
  description: "Operação online sincronizada com a Tray.",
  sourceLabel: "Tray E-commerce",
  health: "connected",
  revenueLabel: formatCurrency(82900),
  ordersLabel: "210 pedidos",
  ordersCount: 210,
  averageTicketLabel: formatCurrency(394.76),
  piecesPerTicket: 1.5,
  conversionRate: 2.1,
  deltaLabel: "+15% vs ontem",
  trendPoints: [
    { label: "09:00", value: 5000, target: 8000, displayValue: "R$ 5k" },
    { label: "11:00", value: 18000, target: 18000, displayValue: "R$ 18k" },
    { label: "13:00", value: 36000, target: 30000, displayValue: "R$ 36k" },
    { label: "15:00", value: 58000, target: 50000, displayValue: "R$ 58k" },
    { label: "17:00", value: 82900, target: 75000, displayValue: "R$ 82k" }
  ]
};

const PHYSICAL_LEADERS: ChannelLeaderboard = {
  channelId: "physical",
  title: "Ranking Data System",
  leaders: [
    {
      id: "vnd-1",
      rank: 1,
      name: "Ana Silva",
      team: "Vendas Loja 1",
      revenueLabel: formatCurrency(32500),
      salesCount: 45,
      ticketMedioLabel: formatCurrency(722),
      piecesPerTicket: 3.1,
      conversionRate: 28.5,
      goalAchievement: 105,
      status: "Batendo Meta"
    },
    {
      id: "vnd-2",
      rank: 2,
      name: "Carlos Mendes",
      team: "Vendas VIP",
      revenueLabel: formatCurrency(28900),
      salesCount: 30,
      ticketMedioLabel: formatCurrency(963),
      piecesPerTicket: 2.5,
      conversionRate: 22.0,
      goalAchievement: 98,
      status: "No ritmo"
    },
    {
      id: "vnd-3",
      rank: 3,
      name: "Roberto Dias",
      team: "Vendas Loja 1",
      revenueLabel: formatCurrency(19800),
      salesCount: 35,
      ticketMedioLabel: formatCurrency(565),
      piecesPerTicket: 2.8,
      conversionRate: 19.5,
      goalAchievement: 85,
      status: "Abaixo da Média"
    }
  ]
};

const ECOMMERCE_LEADERS: ChannelLeaderboard = {
  channelId: "ecommerce",
  title: "Performance de Tráfego",
  leaders: [
    {
      id: "cmp-1",
      rank: 1,
      name: "Google Ads (Search)",
      team: "Mídia Paga",
      revenueLabel: formatCurrency(45000),
      salesCount: 110,
      ticketMedioLabel: formatCurrency(409),
      piecesPerTicket: 1.6,
      conversionRate: 3.5,
      goalAchievement: 110,
      status: "Alta Eficiência"
    },
    {
      id: "cmp-2",
      rank: 2,
      name: "Instagram Ads",
      team: "Mídia Paga",
      revenueLabel: formatCurrency(22500),
      salesCount: 65,
      ticketMedioLabel: formatCurrency(346),
      piecesPerTicket: 1.4,
      conversionRate: 1.8,
      goalAchievement: 95,
      status: "No ritmo"
    }
  ]
};

const TOP_PRODUCTS: ProductRankingEntry[] = [
  {
    id: "p1",
    name: "Jaqueta de Couro Premium",
    channelLabel: "Loja Física / E-commerce",
    unitsSold: 45,
    revenueLabel: formatCurrency(40500),
    statusLabel: "Curva A"
  },
  {
    id: "p2",
    name: "Calça Jeans Básica",
    channelLabel: "Loja Física",
    unitsSold: 120,
    revenueLabel: formatCurrency(24000),
    statusLabel: "Curva A"
  },
  {
    id: "p3",
    name: "Bota Couro Tracker",
    channelLabel: "E-commerce",
    unitsSold: 30,
    revenueLabel: formatCurrency(15000),
    statusLabel: "Curva B"
  }
];

const YOY_METRICS: YearOverYearItem[] = [
  {
    id: "yoy-phys",
    label: "Faturamento Físico YoY",
    currentValue: formatCurrency(102500),
    previousValue: formatCurrency(90000),
    deltaPercent: 13.8,
    trend: "up"
  },
  {
    id: "yoy-ecom",
    label: "Faturamento Digital YoY",
    currentValue: formatCurrency(82900),
    previousValue: formatCurrency(65000),
    deltaPercent: 27.5,
    trend: "up"
  }
];

const ALERTS: AlertItem[] = [
  {
    id: "a1",
    title: "Queda de conversão no site",
    message: "A taxa de conversão caiu 15% na última hora.",
    severity: "medium"
  },
  {
    id: "a2",
    title: "Ruptura iminente",
    message: "Jaqueta de Couro Premium está com estoque abaixo do mínimo.",
    severity: "high"
  }
];

export function buildMockSnapshot(
  mode: ErpMode,
  health: SourceHealth,
  detail: string
): DashboardSnapshot {
  return {
    generatedAt: new Date().toISOString(),
    source: {
      mode,
      label: "Mock Service",
      health,
      detail
    },
    summary: {
      companyName: "Texas Center",
      periodLabel: "Hoje",
      activeEmployees: 42
    },
    metrics: GLOBAL_METRICS,
    salesChannels: [PHYSICAL_CHANNEL, ECOMMERCE_CHANNEL],
    trendPoints: PHYSICAL_CHANNEL.trendPoints,
    channelLeaderboards: [PHYSICAL_LEADERS, ECOMMERCE_LEADERS],
    topProducts: TOP_PRODUCTS,
    lowProducts: [],
    alerts: ALERTS,
    yearOverYear: YOY_METRICS
  };
}
