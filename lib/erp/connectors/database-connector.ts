import { loadDashboardFromDatabase } from "@/lib/erp/db-client";
import type { ErpConnector } from "@/lib/erp/contracts";

const databaseRequirements = [
  "ERP_DB_SERVER",
  "ERP_DB_NAME",
  "ERP_DB_USER",
  "ERP_DB_PASSWORD",
  "ERP_DB_DASHBOARD_QUERY"
];
const connectorName = "Database connector";

function isEnabled() {
  return databaseRequirements.every((key) => Boolean(process.env[key]));
}

export const databaseConnector: ErpConnector = {
  name: connectorName,
  mode: "database",
  async loadSnapshot() {
    return loadDashboardFromDatabase();
  },
  getStatus() {
    return {
      name: connectorName,
      mode: "database",
      enabled: isEnabled(),
      health: isEnabled() ? "fallback" : "missing-config",
      detail: isEnabled()
        ? "A leitura do banco já está preparada e só precisa ser validada quando o acesso chegar."
        : "Faltam credenciais do banco e a query principal do dashboard.",
      requirements: databaseRequirements
    };
  }
};
