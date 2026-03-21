import { buildMockSnapshot } from "@/lib/mock-data";
import type { ErpConnector } from "@/lib/erp/contracts";

const connectorName = "Mock connector";

export const mockConnector: ErpConnector = {
  name: connectorName,
  mode: "mock",
  async loadSnapshot() {
    return buildMockSnapshot(
      "mock",
      "fallback",
      "Painel rodando em modo demonstração enquanto a integração do ERP não foi liberada."
    );
  },
  getStatus() {
    return {
      name: connectorName,
      mode: "mock",
      enabled: true,
      health: "fallback",
      detail: "Usa dados fictícios para manter o software utilizável antes da integração real.",
      requirements: []
    };
  }
};
