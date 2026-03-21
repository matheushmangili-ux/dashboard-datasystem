import { loadDashboardFromApi } from "@/lib/erp/api-client";
import type { ErpConnector } from "@/lib/erp/contracts";

const connectorName = "API connector";

function isEnabled() {
  return Boolean(process.env.ERP_API_BASE_URL && process.env.ERP_API_TOKEN);
}

export const apiConnector: ErpConnector = {
  name: connectorName,
  mode: "api",
  async loadSnapshot() {
    return loadDashboardFromApi();
  },
  getStatus() {
    return {
      name: connectorName,
      mode: "api",
      enabled: isEnabled(),
      health: isEnabled() ? "fallback" : "missing-config",
      detail: isEnabled()
        ? "A base da API já está configurada e só precisa ser validada quando o acesso chegar."
        : "Falta apontar a URL base e o token da API do ERP.",
      requirements: ["ERP_API_BASE_URL", "ERP_API_TOKEN"]
    };
  }
};
