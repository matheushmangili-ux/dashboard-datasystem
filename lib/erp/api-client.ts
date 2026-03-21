import { buildMockSnapshot } from "@/lib/mock-data";
import type { DashboardSnapshot } from "@/lib/types";

const API_TIMEOUT_MS = 6000;

function withTimeout(signal?: AbortSignal) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return {
    signal: controller.signal,
    dispose: () => clearTimeout(timeoutId)
  };
}

function normalizePayload(payload: unknown): DashboardSnapshot | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Partial<DashboardSnapshot>;

  if (
    typeof candidate.generatedAt === "string" &&
    candidate.source &&
    candidate.summary &&
    Array.isArray(candidate.metrics) &&
    Array.isArray(candidate.trendPoints) &&
    Array.isArray(candidate.leaders) &&
    Array.isArray(candidate.alerts)
  ) {
    return {
      ...(candidate as Omit<DashboardSnapshot, "salesChannels">),
      salesChannels: Array.isArray(candidate.salesChannels)
        ? candidate.salesChannels
        : buildMockSnapshot("api", "fallback").salesChannels
    };
  }

  return null;
}

export async function loadDashboardFromApi() {
  const baseUrl = process.env.ERP_API_BASE_URL;
  const path = process.env.ERP_API_DASHBOARD_PATH ?? "/dashboard";
  const token = process.env.ERP_API_TOKEN;

  if (!baseUrl || !token) {
    return buildMockSnapshot(
      "api",
      "missing-config",
      "Defina ERP_API_BASE_URL e ERP_API_TOKEN para buscar o painel real pela API do Data System."
    );
  }

  const { signal, dispose } = withTimeout();

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      cache: "no-store",
      signal
    });

    if (!response.ok) {
      return buildMockSnapshot(
        "api",
        "fallback",
        `A API respondeu com status ${response.status}. O painel entrou em fallback.`
      );
    }

    const payload = (await response.json()) as unknown;
    const normalized = normalizePayload(payload);

    if (normalized) {
      return normalized;
    }

    return buildMockSnapshot(
      "api",
      "fallback",
      "A API respondeu, mas o formato ainda nao segue o contrato do dashboard."
    );
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Falha desconhecida ao consultar a API.";

    return buildMockSnapshot(
      "api",
      "fallback",
      `Não foi possível acessar a API do ERP agora: ${detail}`
    );
  } finally {
    dispose();
  }
}
