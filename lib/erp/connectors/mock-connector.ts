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
      "Painel rodando em modo demonstracao enquanto a integracao do ERP nao foi liberada."
    );
  },
  getStatus() {
    return {
      name: connectorName,
      mode: "mock",
      enabled: true,
      health: "fallback",
      detail: "Usa dados ficticios para manter o software utilizavel antes da integracao real.",
      requirements: []
    };
  }
};
