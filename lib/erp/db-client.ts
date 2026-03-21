import { buildMockSnapshot } from "@/lib/mock-data";
import type { DashboardSnapshot } from "@/lib/types";

interface SummaryRecord {
  company_name?: string;
  period_label?: string;
  active_employees?: number;
  net_revenue?: number;
  revenue_target?: number;
  orders_count?: number;
  avg_ticket?: number;
  conversion_rate?: number;
}

interface TrendRecord {
  label?: string;
  value?: number;
  target?: number;
}

interface LeaderRecord {
  collaborator?: string;
  team?: string;
  value?: number;
  status?: string;
}

interface AlertRecord {
  title?: string;
  message?: string;
  severity?: "low" | "medium" | "high";
}

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

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeRecordsets(recordsets: unknown[]): DashboardSnapshot | null {
  const [summarySet, trendSet, leadersSet, alertsSet] = recordsets;

  if (
    !Array.isArray(summarySet) ||
    !Array.isArray(trendSet) ||
    !Array.isArray(leadersSet) ||
    !Array.isArray(alertsSet) ||
    summarySet.length === 0
  ) {
    return null;
  }

  const summary = (summarySet[0] ?? {}) as SummaryRecord;
  const revenue = toNumber(summary.net_revenue, 0);
  const revenueTarget = toNumber(summary.revenue_target, revenue || 1);
  const orders = toNumber(summary.orders_count, 0);
  const avgTicket =
    toNumber(summary.avg_ticket, orders > 0 ? revenue / Math.max(orders, 1) : 0);
  const conversion = toNumber(summary.conversion_rate, 0);
  const achievement = revenueTarget > 0 ? (revenue / revenueTarget) * 100 : 0;
  const fallback = buildMockSnapshot(
    "database",
    "connected",
    "Dados vindos do banco do Data System via leitura controlada."
  );

  return {
    generatedAt: new Date().toISOString(),
    source: {
      mode: "database",
      label: "Banco do ERP",
      health: "connected",
      detail: "Dados vindos do banco do Data System via leitura controlada."
    },
    summary: {
      companyName: summary.company_name ?? "Data System",
      periodLabel: summary.period_label ?? "Hoje",
      activeEmployees: toNumber(summary.active_employees, 0)
    },
    metrics: [
      {
        id: "net-revenue",
        label: "Receita do dia",
        value: formatCurrency(revenue),
        caption: `Meta ${formatCurrency(revenueTarget)}`,
        delta: 0,
        deltaLabel: "Banco conectado"
      },
      {
        id: "achievement",
        label: "Meta atingida",
        value: formatPercentage(achievement),
        caption: "Comparativo atual",
        delta: 0,
        deltaLabel: "Atualizacao em tempo real"
      },
      {
        id: "orders",
        label: "Pedidos processados",
        value: orders.toString(),
        caption: "Pedidos do periodo",
        delta: 0,
        deltaLabel: "Leitura do ERP"
      },
      {
        id: "avg-ticket",
        label: "Ticket medio",
        value: formatCurrency(avgTicket),
        caption: `Conversao ${conversion.toFixed(1)}%`,
        delta: 0,
        deltaLabel: "Leitura do ERP"
      }
    ],
    salesChannels: [
      {
        id: "physical",
        label: "Loja Fisica",
        description: "Canal presencial alimentado pelo ERP.",
        sourceLabel: "ERP Data System",
        health: "connected",
        revenueLabel: formatCurrency(revenue),
        ordersLabel: orders.toString(),
        averageTicketLabel: formatCurrency(avgTicket),
        deltaLabel: "ERP sincronizado",
        trendPoints: trendSet.map((row, index) => {
          const record = row as TrendRecord;
          const value = toNumber(record.value, 0);
          return {
            label: record.label ?? `${index + 1}h`,
            value,
            target: toNumber(record.target, value),
            displayValue: formatCurrency(value)
          };
        })
      },
      {
        id: "ecommerce",
        label: "Ecommerce",
        description: "Canal online reservado para a integracao com a Tray.",
        sourceLabel: "Tray",
        health: "fallback",
        revenueLabel: formatCurrency(0),
        ordersLabel: "0",
        averageTicketLabel: formatCurrency(0),
        deltaLabel: "Aguardando Tray",
        trendPoints: []
      }
    ],
    trendPoints: trendSet.map((row, index) => {
      const record = row as TrendRecord;
      const value = toNumber(record.value, 0);
      return {
        label: record.label ?? `${index + 1}h`,
        value,
        target: toNumber(record.target, value),
        displayValue: formatCurrency(value)
      };
    }),
    leaders: leadersSet.map((row, index) => {
      const record = row as LeaderRecord;
      return {
        id: `leader-${index + 1}`,
        rank: index + 1,
        name: record.collaborator ?? `Colaborador ${index + 1}`,
        team: record.team ?? "Equipe ERP",
        displayValue: formatCurrency(toNumber(record.value, 0)),
        status: record.status ?? "Sem status"
      };
    }),
    alerts: alertsSet.map((row, index) => {
      const record = row as AlertRecord;
      return {
        id: `alert-${index + 1}`,
        title: record.title ?? "Alerta do ERP",
        message: record.message ?? "Sem mensagem configurada.",
        severity: record.severity ?? "medium"
      };
    }),
    channelLeaderboards: fallback.channelLeaderboards,
    topProducts: fallback.topProducts,
    lowProducts: fallback.lowProducts
  };
}

export async function loadDashboardFromDatabase() {
  const server = process.env.ERP_DB_SERVER;
  const database = process.env.ERP_DB_NAME;
  const user = process.env.ERP_DB_USER;
  const password = process.env.ERP_DB_PASSWORD;
  const dashboardQuery = process.env.ERP_DB_DASHBOARD_QUERY;

  if (!server || !database || !user || !password || !dashboardQuery) {
    return buildMockSnapshot(
      "database",
      "missing-config",
      "Configure ERP_DB_SERVER, ERP_DB_NAME, ERP_DB_USER, ERP_DB_PASSWORD e ERP_DB_DASHBOARD_QUERY para ler o Data System pelo banco."
    );
  }

  let pool:
    | {
        close: () => Promise<void>;
        request: () => { query: (queryText: string) => Promise<{ recordsets?: unknown[] }> };
      }
    | undefined;

  try {
    const sql = await import("mssql");

    const connectedPool = await sql.connect({
      server,
      database,
      user,
      password,
      options: {
        encrypt: process.env.ERP_DB_ENCRYPT === "true",
        trustServerCertificate:
          process.env.ERP_DB_TRUST_SERVER_CERTIFICATE !== "false"
      }
    });
    pool = connectedPool;

    const result = await connectedPool.request().query(dashboardQuery);
    const normalized = normalizeRecordsets(result.recordsets ?? []);

    if (normalized) {
      return normalized;
    }

    return buildMockSnapshot(
      "database",
      "fallback",
      "O banco respondeu, mas os recordsets nao seguem o contrato esperado para o dashboard."
    );
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Falha desconhecida ao acessar o banco.";

    return buildMockSnapshot(
      "database",
      "fallback",
      `Nao foi possivel consultar o banco do ERP agora: ${detail}`
    );
  } finally {
    await pool?.close();
  }
}
