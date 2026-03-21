import { loadDashboardFromApi } from "@/lib/erp/api-client";
import { loadDashboardFromDatabase } from "@/lib/erp/db-client";
import type { ErpConnector } from "@/lib/erp/contracts";
import type { DashboardSnapshot, SourceHealth } from "@/lib/types";

const connectorName = "Hybrid connector";

function mergeHealth(
  databaseHealth: SourceHealth,
  apiHealth: SourceHealth
): SourceHealth {
  if (databaseHealth === "connected" || apiHealth === "connected") {
    return "connected";
  }

  if (databaseHealth === "missing-config" && apiHealth === "missing-config") {
    return "missing-config";
  }

  return "fallback";
}

function mergeSnapshots(
  databaseSnapshot: DashboardSnapshot,
  apiSnapshot: DashboardSnapshot
): DashboardSnapshot {
  const databaseConnected = databaseSnapshot.source.health === "connected";
  const apiConnected = apiSnapshot.source.health === "connected";
  const health = mergeHealth(
    databaseSnapshot.source.health,
    apiSnapshot.source.health
  );

  return {
    generatedAt: new Date().toISOString(),
    source: {
      mode: "hybrid",
      label: "Modo hibrido",
      health,
      detail:
        databaseConnected || apiConnected
          ? "Painel combinando banco e API do Data System."
          : health === "missing-config"
            ? "API e banco ainda precisam de configuracao para sair do modo demonstracao."
            : "Banco e API ainda nao responderam como esperado. O painel segue em fallback."
    },
    summary: databaseConnected ? databaseSnapshot.summary : apiSnapshot.summary,
    metrics: databaseConnected ? databaseSnapshot.metrics : apiSnapshot.metrics,
    salesChannels:
      databaseSnapshot.salesChannels.length > 0
        ? databaseSnapshot.salesChannels
        : apiSnapshot.salesChannels,
    trendPoints:
      databaseConnected && databaseSnapshot.trendPoints.length > 0
        ? databaseSnapshot.trendPoints
        : apiSnapshot.trendPoints,
    leaders:
      apiConnected && apiSnapshot.leaders.length > 0
        ? apiSnapshot.leaders
        : databaseSnapshot.leaders,
    channelLeaderboards:
      apiConnected && apiSnapshot.channelLeaderboards.length > 0
        ? apiSnapshot.channelLeaderboards
        : databaseSnapshot.channelLeaderboards,
    topProducts:
      apiConnected && apiSnapshot.topProducts.length > 0
        ? apiSnapshot.topProducts
        : databaseSnapshot.topProducts,
    lowProducts:
      apiConnected && apiSnapshot.lowProducts.length > 0
        ? apiSnapshot.lowProducts
        : databaseSnapshot.lowProducts,
    alerts:
      apiConnected && apiSnapshot.alerts.length > 0
        ? apiSnapshot.alerts
        : databaseSnapshot.alerts
  };
}

export const hybridConnector: ErpConnector = {
  name: connectorName,
  mode: "hybrid",
  async loadSnapshot() {
    const [databaseSnapshot, apiSnapshot] = await Promise.all([
      loadDashboardFromDatabase(),
      loadDashboardFromApi()
    ]);

    return mergeSnapshots(databaseSnapshot, apiSnapshot);
  },
  getStatus() {
    const hasApi = Boolean(process.env.ERP_API_BASE_URL && process.env.ERP_API_TOKEN);
    const hasDatabase = Boolean(
      process.env.ERP_DB_SERVER &&
        process.env.ERP_DB_NAME &&
        process.env.ERP_DB_USER &&
        process.env.ERP_DB_PASSWORD &&
        process.env.ERP_DB_DASHBOARD_QUERY
    );

    return {
      name: connectorName,
      mode: "hybrid",
      enabled: hasApi || hasDatabase,
      health: mergeHealth(
        hasDatabase ? "fallback" : "missing-config",
        hasApi ? "fallback" : "missing-config"
      ),
      detail:
        hasApi || hasDatabase
          ? "A arquitetura hibrida ja aceita ativar API e banco aos poucos, sem alterar o dashboard."
          : "A base hibrida ja existe, mas ainda faltam as credenciais da API e/ou do banco.",
      requirements: [
        "ERP_API_BASE_URL",
        "ERP_API_TOKEN",
        "ERP_DB_SERVER",
        "ERP_DB_NAME",
        "ERP_DB_USER",
        "ERP_DB_PASSWORD",
        "ERP_DB_DASHBOARD_QUERY"
      ]
    };
  }
};
