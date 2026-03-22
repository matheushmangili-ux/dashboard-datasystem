import { buildMockSnapshot } from "@/lib/mock-data";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import { getActiveConnector, getAllConnectors, getConfiguredMode } from "@/lib/erp/registry";
import { enrichSnapshotWithTray, getTrayConnectorStatus } from "@/lib/tray/service";
import type { DashboardSnapshot } from "@/lib/types";
import { unstable_cache } from "next/cache";

function ensureDashboardShape(snapshot: DashboardSnapshot): DashboardSnapshot {
  const fallback = buildMockSnapshot(
    snapshot.source.mode,
    snapshot.source.health,
    snapshot.source.detail
  );

  return {
    ...snapshot,
    salesChannels: Array.isArray(snapshot.salesChannels)
      ? snapshot.salesChannels
      : fallback.salesChannels,
    channelLeaderboards: Array.isArray(snapshot.channelLeaderboards)
      ? snapshot.channelLeaderboards
      : fallback.channelLeaderboards,
    topProducts: Array.isArray(snapshot.topProducts)
      ? snapshot.topProducts
      : fallback.topProducts,
    lowProducts: Array.isArray(snapshot.lowProducts)
      ? snapshot.lowProducts
      : fallback.lowProducts,
    yearOverYear: Array.isArray(snapshot.yearOverYear)
      ? snapshot.yearOverYear
      : fallback.yearOverYear
  };
}

export const loadDashboardSnapshot = unstable_cache(
  async () => {
    const snapshot = await getActiveConnector().loadSnapshot();
    const enriched = await enrichSnapshotWithTray(ensureDashboardShape(snapshot));
    return enriched;
  },
  ["dashboard-snapshot"],
  { revalidate: 8, tags: ["dashboard"] }
);

export function getIntegrationReadiness(): IntegrationReadiness {
  const activeConnector = getActiveConnector();
  const connectors = [
    ...getAllConnectors().map((connector) => connector.getStatus()),
    getTrayConnectorStatus()
  ];

  return {
    activeMode: getConfiguredMode(),
    activeConnector: activeConnector.name,
    summary:
      "Os conectores do ERP estão desacoplados do dashboard. Quando o acesso chegar, basta preencher as variáveis e trocar a lógica do conector customizado se necessário.",
    connectors
  };
}
