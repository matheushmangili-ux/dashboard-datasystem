import type { DashboardSnapshot, ErpMode, SourceHealth } from "@/lib/types";

export interface ConnectorStatus {
  name: string;
  mode: ErpMode;
  enabled: boolean;
  health: SourceHealth;
  detail: string;
  requirements: string[];
}

export interface ErpConnector {
  name: string;
  mode: ErpMode;
  loadSnapshot: () => Promise<DashboardSnapshot>;
  getStatus: () => ConnectorStatus;
}

export interface IntegrationReadiness {
  activeMode: ErpMode;
  activeConnector: string;
  summary: string;
  connectors: ConnectorStatus[];
}
