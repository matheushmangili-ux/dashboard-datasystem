"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { AlertList } from "@/components/alert-list";
import { DashboardClock } from "@/components/dashboard-clock";
import { GoalGauge } from "@/components/goal-gauge";
import { KpiCard } from "@/components/kpi-card";
import { TrendChart } from "@/components/trend-chart";
import { getPermissions, getRoleLabel } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";
import type {
  DashboardSnapshot,
  LeaderboardEntry,
  ProductRankingEntry,
  SalesChannelId,
  SalesChannelSnapshot,
  TrendPoint
} from "@/lib/types";

const REFRESH_INTERVAL_MS = 15000;

const CHANNEL_CONFIG: Record<
  SalesChannelId,
  {
    title: string;
    description: string;
    eyebrow: string;
    secondaryTitle: string;
    secondaryDescription: string;
  }
> = {
  physical: {
    title: "Performance da Loja Física",
    description:
      "Monitoramento estratégico de tração, faturamento e saúde operacional da unidade.",
    eyebrow: "Unidade principal",
    secondaryTitle: "Mix de Produtos da Loja",
    secondaryDescription:
      "Produtos com mais giro e leitura comercial rápida para ação no piso de vendas."
  },
  ecommerce: {
    title: "Digital Intelligence Center",
    description:
      "Interface analítica sincronizada com a operação digital da Texas Center.",
    eyebrow: "E-commerce",
    secondaryTitle: "Mix de Produtos do Digital",
    secondaryDescription:
      "Itens que sustentam receita e volume no canal online ao longo do dia."
  }
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function calculateAchievementPercent(points: TrendPoint[]) {
  const totalValue = points.reduce((sum, point) => sum + point.value, 0);
  const totalTarget = points.reduce((sum, point) => sum + point.target, 0);

  if (!totalTarget) {
    return 0;
  }

  return (totalValue / totalTarget) * 100;
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

function getHealthLabel(health: SalesChannelSnapshot["health"]) {
  if (health === "connected") {
    return "Conectado";
  }

  if (health === "fallback") {
    return "Fallback";
  }

  return "Configuração pendente";
}

function TechLeaderboard({
  leaders
}: {
  leaders: LeaderboardEntry[];
}) {
  if (leaders.length === 0) {
    return <p className="tech-empty-copy">Nenhum destaque disponível neste momento.</p>;
  }

  return (
    <div className="tech-list">
      {leaders.map((leader) => (
        <article className="tech-list-item" key={leader.id}>
          <div className="tech-list-rank">{leader.rank}</div>
          <div className="tech-list-copy">
            <p className="tech-list-title">{leader.name}</p>
            <p className="tech-list-subtitle">{leader.team}</p>
          </div>
          <div className="tech-list-meta">
            <strong>{leader.displayValue}</strong>
            <span>{leader.status}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function TechProducts({
  products
}: {
  products: ProductRankingEntry[];
}) {
  if (products.length === 0) {
    return <p className="tech-empty-copy">Nenhum produto disponível para este canal.</p>;
  }

  return (
    <div className="tech-product-list">
      {products.map((product) => (
        <article className="tech-product-item" key={product.id}>
          <div className="tech-product-copy">
            <p className="tech-product-name">{product.name}</p>
            <p className="tech-product-meta">{product.statusLabel}</p>
          </div>
          <div className="tech-product-values">
            <strong>{product.revenueLabel}</strong>
            <span>{product.unitsSold} un</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function buildChannelMetrics(channel: SalesChannelSnapshot) {
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
      caption: "Volume acumulado hoje",
      delta: 0,
      deltaLabel: "Atualização em tempo real"
    },
    {
      id: `${channel.id}-ticket`,
      label: "Ticket médio",
      value: channel.averageTicketLabel,
      caption: "Eficiência comercial do canal",
      delta: 0,
      deltaLabel: "Leitura operacional"
    },
    {
      id: `${channel.id}-status`,
      label: "Status do canal",
      value: getHealthLabel(channel.health),
      caption: "Condição atual da integração",
      delta: 0,
      deltaLabel: channel.sourceLabel
    }
  ];
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
  const [activeChannelId, setActiveChannelId] = useState<SalesChannelId>("physical");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
            : "Não foi possível atualizar os dados agora.";

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

  const activeConfig = useMemo(
    () => CHANNEL_CONFIG[activeChannelId],
    [activeChannelId]
  );

  const activeTrendPoints = useMemo(
    () =>
      activeChannel?.trendPoints.length ? activeChannel.trendPoints : snapshot.trendPoints,
    [activeChannel, snapshot.trendPoints]
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
        (leaderboard) => leaderboard.channelId === activeChannelId
      )?.leaders ?? [],
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

  const achievementPercent = useMemo(
    () => calculateAchievementPercent(activeTrendPoints),
    [activeTrendPoints]
  );

  const lastUpdated = useMemo(
    () => formatTimestamp(snapshot.generatedAt),
    [snapshot.generatedAt]
  );

  if (!activeChannel) {
    return null;
  }

  return (
    <main className="shell tech-dashboard-shell">
      <header className="tech-dashboard-header animate-tech">
        <div className="tech-header-copy">
          <div className="tech-kicker-row">
            <span className="tech-live-dot" aria-hidden="true" />
            <span className="tech-kicker">Sistema Operacional</span>
            <span className="tech-user-summary">
              {currentUser.name} | {getRoleLabel(currentUser.role)}
            </span>
          </div>
          <h1 className="tech-dashboard-title">
            DATA
            <span className="tech-dashboard-accent">SYSTEM</span>
          </h1>
          <p className="tech-dashboard-copy">{activeConfig.description}</p>
        </div>

        <div className="tech-header-side">
          <div className="tech-header-meta">
            <span className={`connector-health ${activeChannel.health}`}>
              {getHealthLabel(activeChannel.health)}
            </span>
            <span className="connector-chip">{activeChannel.sourceLabel}</span>
            <span className="connector-chip">{snapshot.source.label}</span>
            {isPending ? <span className="loading-badge">Sincronizando</span> : null}
          </div>

          <nav className="tech-channel-nav" aria-label="Canais">
            {(["physical", "ecommerce"] as SalesChannelId[]).map((channelId) => (
              <button
                key={channelId}
                type="button"
                className={`tech-channel-button ${
                  activeChannelId === channelId ? "active" : ""
                }`}
                onClick={() => setActiveChannelId(channelId)}
              >
                {channelId === "physical" ? "Loja Física" : "E-commerce"}
              </button>
            ))}
          </nav>

          <div className="tech-toolbar">
            <DashboardClock />
            <button className="secondary-button" onClick={onSignOut} type="button">
              Trocar perfil
            </button>
          </div>
        </div>
      </header>

      {errorMessage ? (
        <p className="tech-inline-error animate-tech">{errorMessage}</p>
      ) : null}

      <section
        className="tech-hero-grid animate-tech"
        style={{ animationDelay: "0.12s" }}
      >
        <GoalGauge
          percent={achievementPercent}
          label="Atingimento da meta diária"
          value={activeChannel.revenueLabel}
        />

        <article className="card-tech tech-status-card">
          <p className="tech-card-eyebrow">Status da conexão</p>
          <h2 className="tech-card-title">Canal pronto para operação</h2>
          <div className="tech-status-grid">
            <div className="tech-status-item">
              <span>Canal</span>
              <strong>{activeChannel.label}</strong>
            </div>
            <div className="tech-status-item">
              <span>Última atualização</span>
              <strong>{lastUpdated}</strong>
            </div>
            <div className="tech-status-item">
              <span>Pedidos</span>
              <strong>{activeChannel.ordersLabel}</strong>
            </div>
            <div className="tech-status-item">
              <span>Ticket médio</span>
              <strong>{activeChannel.averageTicketLabel}</strong>
            </div>
          </div>
          <p className="tech-status-note">
            {activeChannel.description}
          </p>
        </article>
      </section>

      <section
        className="tech-kpi-grid animate-tech"
        style={{ animationDelay: "0.22s" }}
      >
        {activeMetrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} loading={isPending} />
        ))}
      </section>

      <section
        className="tech-main-grid animate-tech"
        style={{ animationDelay: "0.32s" }}
      >
        <article className="card-tech tech-chart-card">
          <div className="tech-panel-header">
            <div>
              <p className="tech-card-eyebrow">{activeConfig.eyebrow}</p>
              <h2 className="tech-card-title">{activeConfig.title}</h2>
            </div>
            <span className="tech-panel-pill">{activeChannel.deltaLabel}</span>
          </div>
          <TrendChart points={activeTrendPoints} />
        </article>

        <aside className="tech-side-stack">
          <article className="card-tech tech-side-card">
            <p className="tech-card-eyebrow">Fila de atenção</p>
            <h2 className="tech-card-title">Alertas em foco</h2>
            <AlertList alerts={snapshot.alerts} />
          </article>

          <article className="card-tech tech-side-card">
            <p className="tech-card-eyebrow">Mix de produtos</p>
            <h2 className="tech-card-title">{activeConfig.secondaryTitle}</h2>
            <p className="tech-side-copy">{activeConfig.secondaryDescription}</p>
            <TechProducts products={topProducts} />
          </article>
        </aside>
      </section>

      <section
        className="tech-bottom-grid animate-tech"
        style={{ animationDelay: "0.42s" }}
      >
        {permissions.canViewRanking ? (
          <article className="card-tech tech-list-card">
            <p className="tech-card-eyebrow">Ranking</p>
            <h2 className="tech-card-title">Destaques do canal</h2>
            <TechLeaderboard leaders={activeLeaderboard} />
          </article>
        ) : null}

        <article className="card-tech tech-list-card">
          <p className="tech-card-eyebrow">Baixo giro</p>
          <h2 className="tech-card-title">Itens que pedem ação</h2>
          <TechProducts products={lowProducts} />
        </article>
      </section>
    </main>
  );
}
