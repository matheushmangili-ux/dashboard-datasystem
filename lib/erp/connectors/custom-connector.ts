import { buildMockSnapshot } from "@/lib/mock-data";
import type { ErpConnector } from "@/lib/erp/contracts";
import type { DashboardSnapshot } from "@/lib/types";

const connectorName = "Custom connector";

function isCustomEnabled() {
  return process.env.ERP_CUSTOM_CONNECTOR_ENABLED === "true";
}

async function loadCustomDashboard(): Promise<DashboardSnapshot> {
  // Troque este retorno pela integracao real quando o acesso ao Data System chegar.
  // Aqui eh o lugar certo para:
  // 1. chamar endpoints proprietarios
  // 2. combinar respostas da API com queries do banco
  // 3. aplicar regras de negocio antes de montar o DashboardSnapshot
  return buildMockSnapshot(
    "hybrid",
    "missing-config",
    "Conector customizado reservado para a integracao real do Data System."
  );
}

export const customConnector: ErpConnector = {
  name: connectorName,
  mode: "hybrid",
  async loadSnapshot() {
    return loadCustomDashboard();
  },
  getStatus() {
    return {
      name: connectorName,
      mode: "hybrid",
      enabled: isCustomEnabled(),
      health: isCustomEnabled() ? "fallback" : "missing-config",
      detail: isCustomEnabled()
        ? "O conector customizado foi habilitado e aguarda a implementacao final do Data System."
        : "Espaco reservado para integrar regras proprias do Data System sem mexer no front.",
      requirements: ["ERP_CUSTOM_CONNECTOR_ENABLED"]
    };
  }
};
