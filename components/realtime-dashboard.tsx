"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { AlertList } from "@/components/alert-list";
import { DashboardClock } from "@/components/dashboard-clock";
import { EcommerceField } from "@/components/ecommerce-field";
import { KpiCard } from "@/components/kpi-card";
import { SalesTeamPanel } from "@/components/sales-team-panel";
import { TrendChart } from "@/components/trend-chart";
import { YearOverYearSection } from "@/components/year-over-year";
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

type PhysicalSectionId = "overview" | "team" | "products" | "alerts";

const PHYSICAL_SECTIONS: Array<{
  id: PhysicalSectionId;
  label: string;
  eyebrow: string;
  navCopy: string;
  heroTitle: string;
  heroCopy: string;
  highlights: string[];
}> = [
  {
    id: "overview",
    label: "Visao geral",
    eyebrow: "Diretoria",
    navCopy: "Resumo para bater o olho e decidir rapido.",
    heroTitle: "Resumo limpo da loja fisica",
    heroCopy:
      "A leitura principal fica concentrada em poucos sinais visuais: meta, projecao, ritmo e alertas que pedem acao imediata.",
    highlights: ["Meta do dia", "Pulso da equipe", "Alertas prioritarios"]
  },
  {
    id: "team",
    label: "Equipe",
    eyebrow: "Gestao",
    navCopy: "Desempenho separado por visao, setor e vendedor.",
    heroTitle: "Equipe organizada por camadas",
    heroCopy:
      "Primeiro a leitura executiva, depois setores e por fim o detalhe individual. Isso reduz ruido e deixa a navegacao mais intuitiva.",
    highlights: ["Visao executiva", "Setores", "Vendedores"]
  },
  {
    id: "products",
    label: "Produtos",
    eyebrow: "Mix",
    navCopy: "Destaques e baixo giro no mesmo fluxo de analise.",
    heroTitle: "Produtos com leitura comercial clara",
    heroCopy:
      "Os campeoes e os itens de baixo giro ficam agrupados em uma trilha propria para facilitar decisao de exposicao, reposicao e acao comercial.",
    highlights: ["Mais vendidos", "Baixo giro", "Tendencia do canal"]
  },
  {
    id: "alerts",
    label: "Alertas",
    eyebrow: "Acao",
    navCopy: "Fila, risco e excecoes reunidos em um lugar so.",
    heroTitle: "Fila de atencao da operacao",
    heroCopy:
      "Tudo que pede intervencao rapida fica reunido em uma trilha unica, com contexto suficiente para agir sem ficar caçando informacao.",
    highlights: ["Excecoes do turno", "Itens em risco", "Contexto do dia"]
  }
];

const ECOMMERCE_MENU = ["Resultados", "Clientes", "Produtos", "Campanhas"];

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

function parseDeltaFromLabel(label: string) {
  const match = label.match(/([+-]?\d+(?:[.,]\d+)?)\s*%/);

  if (!match) {
    return 0;
  }

  return parseFloat(match[1].replace(",", "."));
}

function buildChannelMetrics(channel: SalesChannelSnapshot): MetricCard[] {
  const channelDelta = parseDeltaFromLabel(channel.deltaLabel);

  return [
    {
      id: `${channel.id}-revenue`,
      label: "Receita do canal",
      value: channel.revenueLabel,
      caption: `Origem ${channel.sourceLabel}`,
      delta: channelDelta,
      deltaLabel: channel.deltaLabel
    },
    {
      id: `${channel.id}-orders`,
      label: "Pedidos",
      value: channel.ordersLabel,
      caption: "Volume acumulado no dia",
      delta: channelDelta,
      deltaLabel: channel.health === "connected" ? "Atualizado" : "Em monitoramento"
    },
    {
      id: `${channel.id}-ticket`,
      label: "Ticket medio",
      value: channel.averageTicketLabel,
      caption: "Valor medio por pedido",
      delta: channelDelta,
      deltaLabel: "Leitura simplificada"
    },
    {
      id: `${channel.id}-status`,
      label: "Status",
      value: channel.deltaLabel,
      caption: "Comparativo com o ultimo ciclo",
      delta: channelDelta,
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
      label: "Ticket medio",
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
  subtitle = "Produtos",
  products
}: {
  title: string;
  subtitle?: string;
  products: ProductRankingEntry[];
}) {
  return (
    <div className="alerts-card card">
      <p className="section-eyebrow">{subtitle}</p>
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
          <p className="section-eyebrow">Leitura da operacao</p>
          <h2 className="section-title">Atalhos do turno</h2>
        </div>
        <span className={`connector-health ${channel.health}`}>{channel.health}</span>
      </div>

      <div className="physical-ops-grid">
        <div className="physical-ops-item">
          <strong>Meta e ritmo</strong>
          <span>Meta do dia, projecao e pulso da equipe em destaque.</span>
        </div>
        <div className="physical-ops-item">
          <strong>Equipe</strong>
          <span>Diretoria, lideranca e operacao acessam profundidades diferentes.</span>
        </div>
        <div className="physical-ops-item">
          <strong>Produtos</strong>
          <span>Mais vendidos e baixo giro ficam em uma trilha propria.</span>
        </div>
        <div className="physical-ops-item">
          <strong>Alertas</strong>
          <span>Fila de atencao prioriza o que merece acao no turno.</span>
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
      <p className="section-eyebrow">Leitura rapida</p>
      <h2 className="section-title">Graficos faceis de ler</h2>
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

function PhysicalSectionNav({
  activeSection,
  onChange
}: {
  activeSection: PhysicalSectionId;
  onChange: (section: PhysicalSectionId) => void;
}) {
  return (
    <section className="card physical-section-nav">
      <div className="panel-header">
        <div>
          <p className="section-eyebrow">Mapa da loja fisica</p>
          <h2 className="section-title">Menus e submenus mais intuitivos</h2>
        </div>
      </div>

      <div className="physical-section-grid">
        {PHYSICAL_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`physical-section-button ${
              activeSection === section.id ? "active" : ""
            }`}
            onClick={() => onChange(section.id)}
          >
            <span className="physical-section-eyebrow">{section.eyebrow}</span>
            <strong>{section.label}</strong>
            <span>{section.navCopy}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AlertsCard({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="alerts-card card">
      <p className="section-eyebrow">Alertas</p>
      <h2 className="section-title">Pontos que pedem atencao</h2>
      <AlertList alerts={alerts} />
    </div>
  );
}

function AnalyticsSection({
  channel,
  trendPoints
}: {
  channel: SalesChannelSnapshot;
  trendPoints: TrendPoint[];
}) {
  return (
    <section className="section-grid channel-analytics-grid">
      <div className="chart-card card">
        <p className="section-eyebrow">Grafico principal</p>
        <h2 className="section-title">Desempenho do canal</h2>
        <p className="section-copy">
          Um grafico direto para comparar a entrega ao longo do dia com a meta.
        </p>
        <TrendChart points={trendPoints} />
      </div>

      <InsightBarsCard channel={channel} trendPoints={trendPoints} />
    </section>
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
  const [activePhysicalSection, setActivePhysicalSection] =
    useState<PhysicalSectionId>("overview");
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
      activeChannel?.trendPoints.length ? activeChannel.trendPoints : snapshot.trendPoints,
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

  const activePhysicalConfig = useMemo(
    () =>
      PHYSICAL_SECTIONS.find((section) => section.id === activePhysicalSection) ??
      PHYSICAL_SECTIONS[0],
    [activePhysicalSection]
  );

  const heroTitle =
    activeChannelId === "physical"
      ? activePhysicalConfig.heroTitle
      : "E-commerce com leitura propria";

  const heroCopy =
    activeChannelId === "physical"
      ? activePhysicalConfig.heroCopy
      : "Uma pagina propria para o digital, com atalhos de e-commerce, visao de produtos e leitura facil do que mais importa.";

  const heroHighlights =
    activeChannelId === "physical"
      ? activePhysicalConfig.highlights
      : ECOMMERCE_MENU;

  const showYearOverYear =
    permissions.canViewFinancials && snapshot.yearOverYear?.length > 0;

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
          <p className="section-eyebrow">
            {activeChannel.label}
            {activeChannelId === "physical" ? ` | ${activePhysicalConfig.eyebrow}` : ""}
          </p>
          <h1 className="channel-page-title">{heroTitle}</h1>
          <p className="section-copy">{heroCopy}</p>
          <div className="channel-menu-strip">
            {heroHighlights.map((item) => (
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
          <p className="channel-page-updated">{`Ultima atualizacao: ${lastUpdated}`}</p>
          {isPending ? <span className="loading-badge">Sincronizando</span> : null}
          {errorMessage ? <p className="section-copy">{errorMessage}</p> : null}
        </aside>
      </section>

      <section className="section-grid channel-metric-grid" aria-label="Indicadores do canal">
        {activeMetrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} loading={isPending} />
        ))}
      </section>

      {activeChannelId === "physical" ? (
        <>
          <PhysicalSectionNav
            activeSection={activePhysicalSection}
            onChange={setActivePhysicalSection}
          />

          {activePhysicalSection === "overview" ? (
            <>
              <PhysicalQuickMenu channel={activeChannel} />
              {permissions.canViewRanking ? (
                <SalesTeamPanel forcedView="executive" />
              ) : null}
              <AnalyticsSection channel={activeChannel} trendPoints={activeTrendPoints} />
              <section className="section-grid channel-rank-grid">
                <ChannelProductsList
                  products={topProducts}
                  title="Produtos em destaque na loja"
                />
                {permissions.canViewAlerts ? (
                  <AlertsCard alerts={snapshot.alerts as AlertItem[]} />
                ) : (
                  <ChannelProductsList
                    products={lowProducts}
                    subtitle="Baixo giro"
                    title="Itens com menor tracao"
                  />
                )}
              </section>
              {showYearOverYear ? (
                <YearOverYearSection items={snapshot.yearOverYear} />
              ) : null}
            </>
          ) : null}

          {activePhysicalSection === "team" ? (
            <>
              {permissions.canViewRanking ? (
                <SalesTeamPanel />
              ) : (
                <section className="card physical-ops-card">
                  <p className="section-eyebrow">Equipe</p>
                  <h2 className="section-title">Acesso restrito</h2>
                  <p className="section-copy">
                    Seu perfil nao possui acesso ao detalhamento da equipe.
                  </p>
                </section>
              )}
              <AnalyticsSection channel={activeChannel} trendPoints={activeTrendPoints} />
              <section className="section-grid channel-rank-grid">
                <ChannelLeaderboardList
                  leaders={activeLeaderboard?.leaders ?? []}
                  subtitle="Equipe"
                  title={activeLeaderboard?.title ?? "Top colaboradores"}
                />
                {permissions.canViewAlerts ? (
                  <AlertsCard alerts={snapshot.alerts as AlertItem[]} />
                ) : (
                  <ChannelProductsList
                    products={topProducts}
                    title="Produtos que sustentam a equipe"
                  />
                )}
              </section>
            </>
          ) : null}

          {activePhysicalSection === "products" ? (
            <>
              <section className="section-grid channel-rank-grid">
                <ChannelProductsList
                  products={topProducts}
                  title={`Mais vendidos da ${activeChannel.label}`}
                />
                <ChannelProductsList
                  products={lowProducts}
                  subtitle="Baixo giro"
                  title={`Itens que merecem revisao na ${activeChannel.label}`}
                />
              </section>
              <AnalyticsSection channel={activeChannel} trendPoints={activeTrendPoints} />
            </>
          ) : null}

          {activePhysicalSection === "alerts" ? (
            <>
              <section className="section-grid channel-rank-grid">
                {permissions.canViewAlerts ? (
                  <AlertsCard alerts={snapshot.alerts as AlertItem[]} />
                ) : null}
                <ChannelProductsList
                  products={lowProducts}
                  subtitle="Prioridades"
                  title="Itens que merecem acao comercial"
                />
              </section>
              <AnalyticsSection channel={activeChannel} trendPoints={activeTrendPoints} />
            </>
          ) : null}
        </>
      ) : (
        <>
          <EcommerceField channel={activeChannel} />
          <AnalyticsSection channel={activeChannel} trendPoints={activeTrendPoints} />

          {showYearOverYear ? <YearOverYearSection items={snapshot.yearOverYear} /> : null}

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
              subtitle="Baixo giro"
              title={`Menor giro do ${activeChannel.label}`}
            />

            {permissions.canViewAlerts ? (
              <AlertsCard alerts={snapshot.alerts as AlertItem[]} />
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}
