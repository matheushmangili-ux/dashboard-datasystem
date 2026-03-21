import { buildMockSnapshot } from "@/lib/mock-data";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import { getActiveConnector, getAllConnectors, getConfiguredMode } from "@/lib/erp/registry";
import { enrichSnapshotWithTray, getTrayConnectorStatus } from "@/lib/tray/service";
import type { DashboardSnapshot } from "@/lib/types";

const CACHE_TTL_MS = 8_000;

let cachedSnapshot: DashboardSnapshot | null = null;
let cacheTimestamp = 0;

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

export async function loadDashboardSnapshot() {
  const now = Date.now();

  if (cachedSnapshot && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSnapshot;
  }

  const snapshot = await getActiveConnector().loadSnapshot();
  const enriched = await enrichSnapshotWithTray(ensureDashboardShape(snapshot));

  cachedSnapshot = enriched;
  cacheTimestamp = now;

  return enriched;
}

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
