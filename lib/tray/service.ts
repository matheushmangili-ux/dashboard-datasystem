import { buildMockSnapshot } from "@/lib/mock-data";
import type { ConnectorStatus } from "@/lib/erp/contracts";
import type { DashboardSnapshot, SalesChannelSnapshot } from "@/lib/types";

interface TrayAuthResponse {
  access_token?: string;
  refresh_token?: string;
  api_host?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function todayRange() {
  const now = new Date();
  const start = now.toISOString().slice(0, 10);
  return `${start},${start} 23:59:59`;
}

function getTrayEnv() {
  return {
    apiAddress: process.env.TRAY_API_ADDRESS,
    apiHost: process.env.TRAY_API_HOST,
    accessToken: process.env.TRAY_ACCESS_TOKEN,
    consumerKey: process.env.TRAY_CONSUMER_KEY,
    consumerSecret: process.env.TRAY_CONSUMER_SECRET,
    code: process.env.TRAY_CODE
  };
}

async function exchangeTrayAccess(): Promise<TrayAuthResponse | null> {
  const { apiAddress, consumerKey, consumerSecret, code } = getTrayEnv();

  if (!apiAddress || !consumerKey || !consumerSecret || !code) {
    return null;
  }

  const response = await fetch(`${apiAddress.replace(/\/$/, "")}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      code
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Tray auth respondeu ${response.status}.`);
  }

  return (await response.json()) as TrayAuthResponse;
}

async function resolveTrayAccess() {
  const env = getTrayEnv();

  if (env.apiHost && env.accessToken) {
    return {
      apiHost: env.apiHost,
      accessToken: env.accessToken
    };
  }

  const auth = await exchangeTrayAccess();

  if (!auth?.api_host || !auth.access_token) {
    return null;
  }

  return {
    apiHost: auth.api_host,
    accessToken: auth.access_token
  };
}

function extractItems(payload: unknown, key: string) {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const direct = (payload as Record<string, unknown>)[key];

  if (Array.isArray(direct)) {
    return direct;
  }

  return [];
}

function buildFallbackTrayChannel(
  detail = "Tray aguardando configuração.",
  health: SalesChannelSnapshot["health"] = "missing-config"
): SalesChannelSnapshot {
  return {
    id: "ecommerce",
    label: "E-commerce",
    description: "Canal online reservado para pedidos, catálogo e venda digital.",
    sourceLabel: detail,
    health,
    revenueLabel: formatCurrency(0),
    ordersLabel: "0",
    ordersCount: 0,
    averageTicketLabel: formatCurrency(0),
    piecesPerTicket: 0,
    conversionRate: 0,
    deltaLabel: "Aguardando Tray",
    trendPoints: []
  };
}

function parseTrayChannel(
  ordersPayload: unknown,
  productsPayload: unknown
): SalesChannelSnapshot {
  const orders = extractItems(ordersPayload, "Orders");
  const products = extractItems(productsPayload, "Products");

  const grossRevenue = orders.reduce((total, item) => {
    if (!item || typeof item !== "object") {
      return total;
    }

    const order =
      "Order" in (item as Record<string, unknown>)
        ? ((item as { Order?: Record<string, unknown> }).Order ?? {})
        : (item as Record<string, unknown>);

    const rawValue =
      typeof order.partial_total === "string" || typeof order.partial_total === "number"
        ? order.partial_total
        : typeof order.total === "string" || typeof order.total === "number"
          ? order.total
          : 0;

    return total + Number(rawValue || 0);
  }, 0);

  const orderCount = orders.length;
  const averageTicket = grossRevenue / Math.max(orderCount, 1);

  return {
    id: "ecommerce",
    label: "E-commerce",
    description: `Pedidos online e catálogo da loja virtual (${products.length} produtos lidos).`,
    sourceLabel: "Tray API",
    health: "connected",
    revenueLabel: formatCurrency(grossRevenue),
    ordersLabel: orderCount.toString(),
    ordersCount: orderCount,
    averageTicketLabel: formatCurrency(averageTicket),
    piecesPerTicket: 1.5,
    conversionRate: 2.1,
    deltaLabel: "Sincronizado com a Tray",
    trendPoints: []
  };
}

export async function loadTraySalesChannel() {
  try {
    const access = await resolveTrayAccess();

    if (!access) {
      return buildFallbackTrayChannel(
        "Tray aguardando TRAY_API_HOST + TRAY_ACCESS_TOKEN ou fluxo de autenticação."
      );
    }

    const apiHost = access.apiHost.replace(/\/$/, "");
    const token = access.accessToken;
    const ordersUrl = `${apiHost}/orders?access_token=${token}&date=${encodeURIComponent(
      todayRange()
    )}`;
    const productsUrl = `${apiHost}/products?access_token=${token}`;

    const [ordersResponse, productsResponse] = await Promise.all([
      fetch(ordersUrl, { cache: "no-store" }),
      fetch(productsUrl, { cache: "no-store" })
    ]);

    if (!ordersResponse.ok || !productsResponse.ok) {
      return buildFallbackTrayChannel(
        `Tray respondeu com erro (${ordersResponse.status}/${productsResponse.status}).`,
        "fallback"
      );
    }

    const [ordersPayload, productsPayload] = await Promise.all([
      ordersResponse.json(),
      productsResponse.json()
    ]);

    return parseTrayChannel(ordersPayload, productsPayload);
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Falha desconhecida ao consultar a Tray.";

    return buildFallbackTrayChannel(`Tray em fallback: ${detail}`, "fallback");
  }
}

export async function enrichSnapshotWithTray(
  snapshot: DashboardSnapshot
): Promise<DashboardSnapshot> {
  const trayChannel = await loadTraySalesChannel();
  const baseChannels = Array.isArray(snapshot.salesChannels)
    ? snapshot.salesChannels
    : buildMockSnapshot(snapshot.source.mode, snapshot.source.health, "Tray Fallback").salesChannels;
  const nextChannels = baseChannels.map((channel) =>
    channel.id === "ecommerce" ? trayChannel : channel
  );

  return {
    ...snapshot,
    salesChannels: nextChannels
  };
}

export function getTrayConnectorStatus(): ConnectorStatus {
  const env = getTrayEnv();
  const hasDirectAccess = Boolean(env.apiHost && env.accessToken);
  const hasAuthFlow = Boolean(
    env.apiAddress && env.consumerKey && env.consumerSecret && env.code
  );

  return {
    name: "Tray connector",
    mode: "api",
    enabled: hasDirectAccess || hasAuthFlow,
    health: hasDirectAccess || hasAuthFlow ? "fallback" : "missing-config",
    detail:
      hasDirectAccess || hasAuthFlow
        ? "A camada da Tray já está pronta para ler pedidos e produtos do e-commerce."
        : "Faltam credenciais da Tray para liberar o canal de e-commerce.",
    requirements: [
      "TRAY_API_HOST",
      "TRAY_ACCESS_TOKEN",
      "ou TRAY_API_ADDRESS + TRAY_CONSUMER_KEY + TRAY_CONSUMER_SECRET + TRAY_CODE"
    ]
  };
}
