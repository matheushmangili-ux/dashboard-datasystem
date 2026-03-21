"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { AlertList } from "@/components/alert-list";
import { DashboardClock } from "@/components/dashboard-clock";
import { EcommerceField } from "@/components/ecommerce-field";
import { KpiCard } from "@/components/kpi-card";
import { TrendChart } from "@/components/trend-chart";
import { getPermissions, getRoleLabel } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";
import type {
  AlertItem,
  DashboardSnapshot,
  LeaderboardEntry,
  MetricCard,
  ProductRankingEntry,
  SalesChannelId,
  SalesChannelSnapshot,
  TrendPoint
} from "@/lib/types";

const REFRESH_INTERVAL_MS = 15000;

const CHANNEL_MENUS: Record<SalesChannelId, string[]> = {
  physical: ["Resumo do dia", "Equipe", "Atendimento", "Metas"],
  ecommerce: ["Resultados", "Clientes", "Produtos", "Campanhas"]
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  }).format(new Date(value));
}

function parseCurrencyLabel(value: string) {
  const normalized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildChannelMetrics(channel: SalesChannelSnapshot): MetricCard[] {
  return [
    {
      id: `${channel.id}-revenue`,
      label: "Receita do canal",
      value: channel.revenueLabel,
      caption: `Origem ${channel.sourceLabel}`,
      delta: 0,
      deltaLabel: channel.deltaLabel
    },
    {
      id: `${channel.id}-orders`,
      label: "Pedidos",
      value: channel.ordersLabel,
      caption: "Volume acumulado no dia",
      delta: 0,
      deltaLabel: channel.health === "connected" ? "Atualizado" : "Em monitoramento"
    },
    {
      id: `${channel.id}-ticket`,
      label: "Ticket médio",
      value: channel.averageTicketLabel,
      caption: "Valor médio por pedido",
      delta: 0,
      deltaLabel: "Leitura simplificada"
    },
    {
      id: `${channel.id}-status`,
      label: "Status",
      value: channel.deltaLabel,
      caption: "Comparativo com o último ciclo",
      delta: 0,
      deltaLabel: channel.health === "connected" ? "Canal conectado" : "Canal em fallback"
    }
  ];
}

function buildInsightBars(
  channel: SalesChannelSnapshot,
  trendPoints: TrendPoint[]
): Array<{ id: string; label: string; value: string; percent: number }> {
  const totalValue = trendPoints.reduce((sum, point) => sum + point.value, 0);
  const totalTarget = trendPoints.reduce((sum, point) => sum + point.target, 0);
  const orders = Number(channel.ordersLabel) || 0;
  const revenue = parseCurrencyLabel(channel.revenueLabel);
  const averageTicket = parseCurrencyLabel(channel.averageTicketLabel);

  return [
    {
      id: "achievement",
      label: "Ritmo versus meta",
      value: channel.deltaLabel,
      percent: totalTarget > 0 ? Math.min((totalValue / totalTarget) * 100, 100) : 0
    },
    {
      id: "orders",
      label: "Pedidos do canal",
      value: `${channel.ordersLabel} pedidos`,
      percent: Math.min((orders / 220) * 100, 100)
    },
    {
      id: "ticket",
      label: "Ticket médio",
      value: channel.averageTicketLabel,
      percent: Math.min((averageTicket / 1200) * 100, 100)
    },
    {
      id: "revenue",
      label: "Receita do canal",
      value: channel.revenueLabel,
      percent: Math.min((revenue / 180000) * 100, 100)
    }
  ];
}

function filterProductsByChannel(
  products: ProductRankingEntry[],
  channelId: SalesChannelId
) {
  const lookup = channelId === "physical" ? "loja" : "commerce";
  return products.filter((product) =>
    normalizeText(product.channelLabel).includes(lookup)
  );
}

function ChannelLeaderboardList({
  title,
  subtitle,
  leaders
}: {
  title: string;
  subtitle: string;
  leaders: LeaderboardEntry[];
}) {
  return (
    <div className="leaders-card card">
      <p className="section-eyebrow">{subtitle}</p>
      <h2 className="section-title">{title}</h2>
      <div className="leaders-list compact">
        {leaders.map((leader) => (
          <div className="leader-row compact" key={leader.id}>
            <div className="leader-rank">{leader.rank}</div>
            <div>
              <p className="leader-name">{leader.name}</p>
              <p className="leader-team">{leader.team}</p>
            </div>
            <div>
              <p className="leader-value">{leader.displayValue}</p>
              <p className="leader-status">{leader.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelProductsList({
  title,
  products
}: {
  title: string;
  products: ProductRankingEntry[];
}) {
  return (
    <div className="alerts-card card">
      <p className="section-eyebrow">Produtos</p>
      <h2 className="section-title">{title}</h2>
      <div className="product-list">
        {products.map((item, index) => (
          <article className="product-row" key={item.id}>
            <div className="product-index">{index + 1}</div>
            <div className="product-copy">
              <p className="product-name">{item.name}</p>
              <p className="product-channel">{item.channelLabel}</p>
            </div>
            <div className="product-metric">
              <p className="product-units">{item.unitsSold} un</p>
              <p className="product-revenue">{item.revenueLabel}</p>
              <p className="product-status">{item.statusLabel}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PhysicalQuickMenu({ channel }: { channel: SalesChannelSnapshot }) {
  return (
    <section className="card physical-ops-card">
      <div className="panel-header">
        <div>
          <p className="section-eyebrow">Menu da loja física</p>
          <h2 className="section-title">Operação presencial</h2>
        </div>
        <span className={`connector-health ${channel.health}`}>{channel.health}</span>
      </div>

      <div className="physical-ops-grid">
        <div className="physical-ops-item">
          <strong>Caixa e atendimento</strong>
          <span>Visão rápida do fluxo no ponto de venda.</span>
        </div>
        <div className="physical-ops-item">
          <strong>Equipe no piso</strong>
          <span>Leitura simples para supervisão e gestão.</span>
        </div>
        <div className="physical-ops-item">
          <strong>Meta do turno</strong>
          <span>Comparativo entre planejado e realizado.</span>
        </div>
        <div className="physical-ops-item">
          <strong>Alertas de balcão</strong>
          <span>Fila, ticket médio e ritmo do dia em destaque.</span>
        </div>
      </div>
    </section>
  );
}

function InsightBarsCard({
  channel,
  trendPoints
}: {
  channel: SalesChannelSnapshot;
  trendPoints: TrendPoint[];
}) {
  const insightBars = buildInsightBars(channel, trendPoints);

  return (
    <div className="leaders-card card">
      <p className="section-eyebrow">Leitura rápida</p>
      <h2 className="section-title">Gráficos fáceis de visualizar</h2>
      <div className="insight-bar-list">
        {insightBars.map((item) => (
          <div className="insight-bar-item" key={item.id}>
            <div className="insight-bar-copy">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <div className="insight-bar-track" aria-hidden="true">
              <span className="insight-bar-fill" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RealtimeDashboard({
  initialSnapshot,
  currentUser,
  onSignOut
}: {
  initialSnapshot: DashboardSnapshot;
  currentUser: AuthUser;
  onSignOut: () => void;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<SalesChannelId>("physical");
  const [isPending, startTransition] = useTransition();
  const permissions = useMemo(
    () => getPermissions(currentUser.role),
    [currentUser.role]
  );

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Falha ao atualizar o painel.");
        }

        const nextSnapshot = (await response.json()) as DashboardSnapshot;

        if (!active) {
          return;
        }

        startTransition(() => {
          setSnapshot(nextSnapshot);
          setErrorMessage(null);
        });
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Nao foi possivel atualizar os dados agora.";

        setErrorMessage(message);
      }
    };

    void refresh();
    const intervalId = window.setInterval(refresh, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const activeChannel = useMemo(
    () =>
      snapshot.salesChannels.find((channel) => channel.id === activeChannelId) ??
      snapshot.salesChannels[0],
    [activeChannelId, snapshot.salesChannels]
  );
  const activeTrendPoints = useMemo(
    () =>
      activeChannel?.trendPoints.length
        ? activeChannel.trendPoints
        : snapshot.trendPoints,
    [activeChannel, snapshot.trendPoints]
  );
  const lastUpdated = useMemo(
    () => formatTimestamp(snapshot.generatedAt),
    [snapshot.generatedAt]
  );
  const activeMetrics = useMemo(() => {
    if (!activeChannel) {
      return [];
    }

    const metrics = buildChannelMetrics(activeChannel);
    return permissions.canViewFinancials
      ? metrics
      : metrics.filter((metric) => metric.id !== `${activeChannel.id}-revenue`);
  }, [activeChannel, permissions.canViewFinancials]);
  const activeLeaderboard = useMemo(
    () =>
      snapshot.channelLeaderboards.find(
        (item) => item.channelId === activeChannelId
      ) ?? snapshot.channelLeaderboards[0],
    [activeChannelId, snapshot.channelLeaderboards]
  );
  const topProducts = useMemo(() => {
    const filtered = filterProductsByChannel(snapshot.topProducts, activeChannelId);
    return filtered.length > 0 ? filtered.slice(0, 5) : snapshot.topProducts.slice(0, 5);
  }, [activeChannelId, snapshot.topProducts]);
  const lowProducts = useMemo(() => {
    const filtered = filterProductsByChannel(snapshot.lowProducts, activeChannelId);
    return filtered.length > 0 ? filtered.slice(0, 5) : snapshot.lowProducts.slice(0, 5);
  }, [activeChannelId, snapshot.lowProducts]);
  const activeMenuItems = CHANNEL_MENUS[activeChannelId];
  const channelTitle =
    activeChannelId === "physical"
      ? "Loja fisica no centro da operacao"
      : "E-commerce com leitura propria";
  const channelCopy =
    activeChannelId === "physical"
      ? "Uma visao limpa para acompanhar resultado do ponto de venda, equipe, atendimento e meta do dia sem excesso de informacao."
      : "Uma pagina propria para o digital, com atalhos de e-commerce, visao de produtos e leitura facil do que mais importa.";

  if (!activeChannel) {
    return null;
  }

  return (
    <main className="shell">
      <section className="user-strip card">
        <div>
          <p className="status-label">Sessao ativa</p>
          <h2 className="status-value">{currentUser.name}</h2>
          <p className="section-copy">
            {currentUser.title} | {currentUser.team}
          </p>
        </div>

        <div className="user-actions">
          <div className="channel-switcher">
            <button
              className={`tab-button ${activeChannelId === "physical" ? "active" : ""}`}
              onClick={() => setActiveChannelId("physical")}
              type="button"
            >
              Loja fisica
            </button>
            <button
              className={`tab-button ${activeChannelId === "ecommerce" ? "active" : ""}`}
              onClick={() => setActiveChannelId("ecommerce")}
              type="button"
            >
              E-commerce
            </button>
          </div>
          <DashboardClock />
          <span className="role-badge">{getRoleLabel(currentUser.role)}</span>
          <span className="role-badge">
            {permissions.scope === "company" ? "Escopo empresa" : "Escopo equipe"}
          </span>
          <button className="secondary-button" onClick={onSignOut} type="button">
            Trocar perfil
          </button>
        </div>
      </section>

      <section className="card channel-page-hero">
        <div className="channel-page-copy">
          <p className="section-eyebrow">{activeChannel.label}</p>
          <h1 className="channel-page-title">{channelTitle}</h1>
          <p className="section-copy">{channelCopy}</p>
          <div className="channel-menu-strip">
            {activeMenuItems.map((item) => (
              <span className="channel-menu-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="channel-page-aside">
          <div className="channel-page-status">
            <span className={`connector-health ${activeChannel.health}`}>
              {activeChannel.health}
            </span>
            <span className="connector-chip">{activeChannel.sourceLabel}</span>
          </div>
          <p className="section-copy">{activeChannel.description}</p>
          <p className="channel-page-updated">Ultima atualizacao: {lastUpdated}</p>
          {isPending ? <span className="loading-badge">Sincronizando</span> : null}
          {errorMessage ? <p className="section-copy">{errorMessage}</p> : null}
        </aside>
      </section>

      <section className="section-grid channel-metric-grid" aria-label="Indicadores do canal">
        {activeMetrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </section>

      {activeChannelId === "ecommerce" ? (
        <EcommerceField channel={activeChannel} />
      ) : (
        <PhysicalQuickMenu channel={activeChannel} />
      )}

      <section className="section-grid channel-analytics-grid">
        <div className="chart-card card">
          <p className="section-eyebrow">Grafico principal</p>
          <h2 className="section-title">Desempenho do canal</h2>
          <p className="section-copy">
            Um grafico direto para comparar a entrega ao longo do dia com a meta.
          </p>
          <TrendChart points={activeTrendPoints} />
        </div>

        <InsightBarsCard channel={activeChannel} trendPoints={activeTrendPoints} />
      </section>

      {permissions.canViewRanking ? (
        <section className="section-grid channel-rank-grid">
          <ChannelLeaderboardList
            leaders={activeLeaderboard?.leaders ?? []}
            subtitle="Equipe"
            title={activeLeaderboard?.title ?? "Top colaboradores"}
          />
          <ChannelProductsList
            products={topProducts}
            title={`Mais vendidos do ${activeChannel.label}`}
          />
        </section>
      ) : null}

      <section className="section-grid channel-rank-grid">
        <ChannelProductsList
          products={lowProducts}
          title={`Menor giro do ${activeChannel.label}`}
        />

        {permissions.canViewAlerts ? (
          <div className="alerts-card card">
            <p className="section-eyebrow">Alertas</p>
            <h2 className="section-title">Pontos que pedem atencao</h2>
            <AlertList alerts={snapshot.alerts as AlertItem[]} />
          </div>
        ) : null}
      </section>
    </main>
  );
}
