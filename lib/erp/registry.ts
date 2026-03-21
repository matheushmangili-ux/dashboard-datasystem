import type { ErpConnector } from "@/lib/erp/contracts";
import { apiConnector } from "@/lib/erp/connectors/api-connector";
import { customConnector } from "@/lib/erp/connectors/custom-connector";
import { databaseConnector } from "@/lib/erp/connectors/database-connector";
import { hybridConnector } from "@/lib/erp/connectors/hybrid-connector";
import { mockConnector } from "@/lib/erp/connectors/mock-connector";
import type { ErpMode } from "@/lib/types";

const connectors: Record<ErpMode, ErpConnector> = {
  mock: mockConnector,
  api: apiConnector,
  database: databaseConnector,
  hybrid: hybridConnector
};

export function getConfiguredMode(): ErpMode {
  const raw = process.env.ERP_MODE?.toLowerCase();

  if (
    raw === "api" ||
    raw === "database" ||
    raw === "hybrid" ||
    raw === "mock"
  ) {
    return raw;
  }

  if (process.env.ERP_CUSTOM_CONNECTOR_ENABLED === "true") {
    return "hybrid";
  }

  return "hybrid";
}

export function getActiveConnector() {
  if (process.env.ERP_CUSTOM_CONNECTOR_ENABLED === "true") {
    return customConnector;
  }

  return connectors[getConfiguredMode()];
}

export function getAllConnectors() {
  return [
    mockConnector,
    apiConnector,
    databaseConnector,
    hybridConnector,
    customConnector
  ];
}
