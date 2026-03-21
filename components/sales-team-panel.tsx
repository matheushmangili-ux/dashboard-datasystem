"use client";

import { useEffect, useMemo, useState } from "react";

import type { SpreadsheetData, SellerGoal } from "@/lib/spreadsheet/parse-metas";

type TeamPanelView = "executive" | "departments" | "sellers";
type StatusFilter = "all" | "above" | "on_track" | "attention" | "critical";
type DepartmentFilter = "all" | "chapelaria" | "selaria" | "vestuario";
type StatusKey = Exclude<StatusFilter, "all">;
type DepartmentKey = Exclude<DepartmentFilter, "all">;

interface DepartmentSummary {
  id: DepartmentKey;
  label: string;
  sellers: SellerGoal[];
  achieved: number;
  goal: number;
  percent: number;
  projection: number;
  criticalCount: number;
  topSeller: SellerGoal | null;
}

const VIEW_OPTIONS: Array<{ id: TeamPanelView; label: string; note: string }> = [
  {
    id: "executive",
    label: "Visao executiva",
    note: "Leitura rapida para decisao"
  },
  {
    id: "departments",
    label: "Setores",
    note: "Comparativo entre areas"
  },
  {
    id: "sellers",
    label: "Vendedores",
    note: "Detalhe individual filtravel"
  }
];

const STATUS_OPTIONS: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "Todos os status" },
  { id: "above", label: "Acima da meta" },
  { id: "on_track", label: "No caminho" },
  { id: "attention", label: "Atencao" },
  { id: "critical", label: "Critico" }
];

const DEPARTMENT_OPTIONS: Array<{ id: DepartmentFilter; label: string }> = [
  { id: "all", label: "Todos os setores" },
  { id: "chapelaria", label: "Chapelaria" },
  { id: "selaria", label: "Selaria" },
  { id: "vestuario", label: "Vestuario" }
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercent(value: number, digits = 0) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: digits
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function getStatusKey(status: string): StatusKey {
  const normalized = normalizeText(status);

  if (normalized.includes("acima")) {
    return "above";
  }

  if (normalized.includes("caminho")) {
    return "on_track";
  }

  if (normalized.includes("atencao")) {
    return "attention";
  }

  return "critical";
}

function getStatusLabel(status: string | StatusKey) {
  const key = status === "above" ||
    status === "on_track" ||
    status === "attention" ||
    status === "critical"
    ? status
    : getStatusKey(status);

  switch (key) {
    case "above":
      return "Acima da meta";
    case "on_track":
      return "No caminho";
    case "attention":
      return "Atencao";
    default:
      return "Critico";
  }
}

function getDepartmentKey(value: string): DepartmentKey {
  const normalized = normalizeText(value);

  if (normalized.includes("chapel")) {
    return "chapelaria";
  }

  if (normalized.includes("selar")) {
    return "selaria";
  }

  return "vestuario";
}

function getDepartmentLabel(value: string | DepartmentKey) {
  const key =
    value === "chapelaria" || value === "selaria" || value === "vestuario"
      ? value
      : getDepartmentKey(value);

  switch (key) {
    case "chapelaria":
      return "Chapelaria";
    case "selaria":
      return "Selaria";
    default:
      return "Vestuario";
  }
}

function getToneClass(value: number) {
  if (value >= 1) {
    return "good";
  }

  if (value >= 0.82) {
    return "watch";
  }

  return "risk";
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function describeArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function GaugeDial({
  value,
  label,
  caption,
  tone,
  compact = false
}: {
  value: number;
  label: string;
  caption: string;
  tone: "good" | "watch" | "risk";
  compact?: boolean;
}) {
  const startAngle = -120;
  const endAngle = 120;
  const span = endAngle - startAngle;
  const ratio = Math.max(0, Math.min(value / 1.1, 1));
  const progressAngle = startAngle + span * ratio;
  const radius = compact ? 34 : 48;
  const centerX = compact ? 48 : 72;
  const centerY = compact ? 50 : 72;
  const needleEnd = polarToCartesian(centerX, centerY, radius - 12, progressAngle);
  const startDot = polarToCartesian(centerX, centerY, radius, startAngle);
  const endDot = polarToCartesian(centerX, centerY, radius, endAngle);

  return (
    <div className={`team-gauge ${compact ? "compact" : ""} ${tone}`}>
      <svg
        className="team-gauge-svg"
        viewBox={compact ? "0 0 96 70" : "0 0 144 108"}
        aria-hidden="true"
      >
        <path
          className="team-gauge-track"
          d={describeArc(centerX, centerY, radius, startAngle, endAngle)}
        />
        <path
          className="team-gauge-progress"
          d={describeArc(centerX, centerY, radius, startAngle, progressAngle)}
        />
        <circle className="team-gauge-cap" cx={startDot.x} cy={startDot.y} r="3.5" />
        <circle className="team-gauge-cap" cx={endDot.x} cy={endDot.y} r="3.5" />
        <line
          className="team-gauge-needle"
          x1={centerX}
          y1={centerY}
          x2={needleEnd.x}
          y2={needleEnd.y}
        />
        <circle className="team-gauge-core" cx={centerX} cy={centerY} r="5" />
      </svg>

      <div className="team-gauge-copy">
        <span className="team-gauge-label">{label}</span>
        <strong className="team-gauge-value">{formatPercent(value, 0)}</strong>
        <span className="team-gauge-caption">{caption}</span>
      </div>
    </div>
  );
}

function ExecutiveGaugeCard({
  title,
  value,
  note,
  emphasis
}: {
  title: string;
  value: number;
  note: string;
  emphasis: string;
}) {
  const tone = getToneClass(value);

  return (
    <article className={`team-gauge-card ${tone}`}>
      <div className="team-gauge-card-top">
        <p className="team-card-label">{title}</p>
        <span className={`team-tone-pill ${tone}`}>{getStatusLabel(toneToStatus(tone))}</span>
      </div>
      <GaugeDial caption={note} label="Atingimento" tone={tone} value={value} />
      <p className="team-card-note">{emphasis}</p>
    </article>
  );
}

function toneToStatus(tone: "good" | "watch" | "risk"): StatusKey {
  if (tone === "good") {
    return "above";
  }

  if (tone === "watch") {
    return "attention";
  }

  return "critical";
}

function ExecutiveSummary({
  data,
  departmentSummaries
}: {
  data: SpreadsheetData;
  departmentSummaries: DepartmentSummary[];
}) {
  const topSeller = data.sellers[0] ?? null;
  const riskSeller = [...data.sellers]
    .sort((left, right) => left.achievedPercent - right.achievedPercent)[0] ?? null;
  const currentDailyAverage =
    data.overview.daysWorked > 0
      ? data.overview.achievedTotal / data.overview.daysWorked
      : 0;
  const dailyPulse =
    data.overview.dailyGoalNeeded > 0
      ? currentDailyAverage / data.overview.dailyGoalNeeded
      : 0;
  const aboveCount = data.sellers.filter(
    (seller) => getStatusKey(seller.status) === "above"
  ).length;
  const onTrackCount = data.sellers.filter(
    (seller) => getStatusKey(seller.status) === "on_track"
  ).length;
  const attentionCount = data.sellers.filter(
    (seller) => getStatusKey(seller.status) === "attention"
  ).length;
  const criticalCount = data.sellers.filter(
    (seller) => getStatusKey(seller.status) === "critical"
  ).length;

  return (
    <div className="team-view-stack">
      <div className="team-executive-grid">
        <ExecutiveGaugeCard
          emphasis={`${formatCurrency(Math.max(data.overview.monthlyGoal - data.overview.achievedTotal, 0))} para bater a meta`}
          note={`${formatCurrency(data.overview.achievedTotal)} de ${formatCurrency(data.overview.monthlyGoal)}`}
          title="Meta do mes"
          value={data.overview.achievedPercent}
        />
        <ExecutiveGaugeCard
          emphasis={
            data.overview.projectionPercent >= 1
              ? "Fechamento acima da meta"
              : `${formatCurrency(Math.max(data.overview.monthlyGoal - data.overview.projection, 0))} de gap projetado`
          }
          note={`${formatCurrency(data.overview.projection)} estimados no fechamento`}
          title="Projecao"
          value={data.overview.projectionPercent}
        />
        <ExecutiveGaugeCard
          emphasis={`${formatCurrency(currentDailyAverage)} por dia contra ${formatCurrency(data.overview.dailyGoalNeeded)} necessario`}
          note={`${data.overview.daysWorked} dias trabalhados e ${data.overview.daysRemaining} restantes`}
          title="Pulso diario"
          value={dailyPulse}
        />

        <aside className="team-spotlight-card">
          <div className="team-spotlight-header">
            <div>
              <p className="section-eyebrow">Prioridades</p>
              <h3 className="team-spotlight-title">Onde agir agora</h3>
            </div>
            <span className={`team-rhythm-badge ${getToneClass(data.overview.projectionPercent)}`}>
              {data.overview.rhythm}
            </span>
          </div>

          <div className="team-spotlight-list">
            <div className="team-spotlight-item">
              <span className="team-card-label">Maior tracao</span>
              <strong>{topSeller?.name ?? "Sem dados"}</strong>
              <p>
                {topSeller
                  ? `${formatPercent(topSeller.achievedPercent, 1)} da meta em ${getDepartmentLabel(topSeller.department)}`
                  : "Aguardando atualizacao"}
              </p>
            </div>
            <div className="team-spotlight-item">
              <span className="team-card-label">Maior risco</span>
              <strong>{riskSeller?.name ?? "Sem dados"}</strong>
              <p>
                {riskSeller
                  ? `${formatCurrency(riskSeller.remaining)} ainda precisam entrar`
                  : "Aguardando atualizacao"}
              </p>
            </div>
            <div className="team-spotlight-item">
              <span className="team-card-label">Comparativo anual</span>
              <strong>{formatPercent(data.overview.vsLastYearPercent, 1)}</strong>
              <p>{formatCurrency(data.overview.refLastYear)} como base do ano passado</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="team-status-row">
        <article className="team-status-card">
          <span className="team-card-label">Acima da meta</span>
          <strong>{aboveCount}</strong>
          <p>vendedores ja acelerando o fechamento</p>
        </article>
        <article className="team-status-card">
          <span className="team-card-label">No caminho</span>
          <strong>{onTrackCount}</strong>
          <p>seguem em trilha boa, pedem acompanhamento</p>
        </article>
        <article className="team-status-card">
          <span className="team-card-label">Atencao</span>
          <strong>{attentionCount}</strong>
          <p>precisam de ajuste comercial no turno</p>
        </article>
        <article className="team-status-card">
          <span className="team-card-label">Criticos</span>
          <strong>{criticalCount}</strong>
          <p>merecem prioridade imediata da lideranca</p>
        </article>
      </div>

      <div className="team-executive-lower">
        <article className="team-week-board">
          <div className="team-section-header">
            <div>
              <p className="section-eyebrow">Semanas do mes</p>
              <h3 className="team-section-title">Ritmo consolidado</h3>
            </div>
            <span className="connector-chip">
              {data.overview.daysWorked}/{data.overview.daysTotal} dias
            </span>
          </div>

          <div className="team-week-grid">
            {data.weeks.map((week) => {
              const tone = getToneClass(week.achievedPercent);

              return (
                <article className={`team-week-card ${tone}`} key={week.weekNumber}>
                  <span className="team-card-label">{`Semana ${week.weekNumber}`}</span>
                  <strong>{formatCurrency(week.achieved)}</strong>
                  <p>{formatCurrency(week.goal)} como meta</p>
                  <div className="team-meter-track" aria-hidden="true">
                    <span
                      className="team-meter-fill"
                      style={{ width: `${Math.max(8, Math.min(week.achievedPercent * 100, 100))}%` }}
                    />
                  </div>
                  <span className="team-week-percent">
                    {formatPercent(week.achievedPercent, 1)}
                  </span>
                </article>
              );
            })}
          </div>
        </article>

        <article className="team-department-board">
          <div className="team-section-header">
            <div>
              <p className="section-eyebrow">Setores</p>
              <h3 className="team-section-title">Leitura por area</h3>
            </div>
          </div>

          <div className="team-department-rail">
            {departmentSummaries.map((summary) => (
              <article className="team-department-rail-card" key={summary.id}>
                <div>
                  <span className="team-card-label">{summary.label}</span>
                  <strong>{formatPercent(summary.percent, 0)}</strong>
                </div>
                <p>{formatCurrency(summary.achieved)} realizados</p>
                <span className="team-rail-foot">
                  {summary.topSeller ? `Destaque: ${summary.topSeller.name}` : "Sem destaque"}
                </span>
              </article>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function DepartmentView({ summaries }: { summaries: DepartmentSummary[] }) {
  return (
    <div className="team-department-grid">
      {summaries.map((summary) => (
        <article className="team-department-card" key={summary.id}>
          <div className="team-department-card-top">
            <div>
              <p className="section-eyebrow">Setor</p>
              <h3 className="team-section-title">{summary.label}</h3>
            </div>
            <GaugeDial
              caption={`${summary.sellers.length} vendedores`}
              compact
              label="Atingimento"
              tone={getToneClass(summary.percent)}
              value={summary.percent}
            />
          </div>

          <div className="team-meta-grid">
            <div className="team-meta-item">
              <span>Realizado</span>
              <strong>{formatCurrency(summary.achieved)}</strong>
            </div>
            <div className="team-meta-item">
              <span>Meta</span>
              <strong>{formatCurrency(summary.goal)}</strong>
            </div>
            <div className="team-meta-item">
              <span>Projecao</span>
              <strong>{formatCurrency(summary.projection)}</strong>
            </div>
            <div className="team-meta-item">
              <span>Criticos</span>
              <strong>{summary.criticalCount}</strong>
            </div>
          </div>

          <div className="team-meter-track" aria-hidden="true">
            <span
              className="team-meter-fill"
              style={{ width: `${Math.max(8, Math.min(summary.percent * 100, 100))}%` }}
            />
          </div>

          <p className="team-department-foot">
            {summary.topSeller
              ? `${summary.topSeller.name} puxa o setor com ${formatPercent(summary.topSeller.achievedPercent, 1)} da meta.`
              : "Sem destaque calculado para o setor."}
          </p>
        </article>
      ))}
    </div>
  );
}

function SellerCard({ seller }: { seller: SellerGoal }) {
  const tone = getToneClass(seller.achievedPercent);

  return (
    <article className={`team-seller-card ${tone}`}>
      <div className="team-seller-top">
        <GaugeDial
          caption={getDepartmentLabel(seller.department)}
          compact
          label="Meta"
          tone={tone}
          value={seller.achievedPercent}
        />

        <div className="team-seller-heading">
          <span className="team-rank-chip">{`#${seller.rank}`}</span>
          <h3>{seller.name}</h3>
          <p>{getDepartmentLabel(seller.department)}</p>
        </div>

        <span className={`team-status-pill ${getStatusKey(seller.status)}`}>
          {getStatusLabel(seller.status)}
        </span>
      </div>

      <div className="team-seller-metrics">
        <div className="team-seller-metric">
          <span>Realizado</span>
          <strong>{formatCurrency(seller.achieved)}</strong>
        </div>
        <div className="team-seller-metric">
          <span>Falta</span>
          <strong>{formatCurrency(seller.remaining)}</strong>
        </div>
        <div className="team-seller-metric">
          <span>Projecao</span>
          <strong>{formatCurrency(seller.projection)}</strong>
        </div>
        <div className="team-seller-metric">
          <span>Meta diaria</span>
          <strong>{formatCurrency(seller.dailyGoalNeeded)}</strong>
        </div>
      </div>

      <div className="team-seller-foot">
        <span>{`Melhor dia: ${formatCurrency(seller.bestDay)}`}</span>
        <span>{`Media atual: ${formatCurrency(seller.dailyAverage)}`}</span>
      </div>
    </article>
  );
}

export function SalesTeamPanel({ forcedView }: { forcedView?: TeamPanelView }) {
  const [data, setData] = useState<SpreadsheetData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<TeamPanelView>(forcedView ?? "executive");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentFilter>("all");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    if (forcedView) {
      setActiveView(forcedView);
    }
  }, [forcedView]);

  useEffect(() => {
    fetch("/api/metas", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao carregar metas");
        }

        return response.json() as Promise<SpreadsheetData>;
      })
      .then(setData)
      .catch((fetchError) => {
        setError(fetchError instanceof Error ? fetchError.message : "Erro desconhecido");
      });
  }, []);

  const departmentSummaries = useMemo(() => {
    if (!data) {
      return [];
    }

    const summaries = new Map<DepartmentKey, DepartmentSummary>();

    for (const seller of data.sellers) {
      const departmentKey = getDepartmentKey(seller.department);
      const current = summaries.get(departmentKey) ?? {
        id: departmentKey,
        label: getDepartmentLabel(departmentKey),
        sellers: [],
        achieved: 0,
        goal: 0,
        percent: 0,
        projection: 0,
        criticalCount: 0,
        topSeller: null
      };

      current.sellers.push(seller);
      current.achieved += seller.achieved;
      current.goal += seller.monthlyGoal;
      current.projection += seller.projection;
      current.criticalCount += getStatusKey(seller.status) === "critical" ? 1 : 0;
      current.topSeller =
        !current.topSeller || seller.achievedPercent > current.topSeller.achievedPercent
          ? seller
          : current.topSeller;

      summaries.set(departmentKey, current);
    }

    return DEPARTMENT_OPTIONS.filter((option) => option.id !== "all").map((option) => {
      const summary = summaries.get(option.id as DepartmentKey) ?? {
        id: option.id as DepartmentKey,
        label: option.label,
        sellers: [],
        achieved: 0,
        goal: 0,
        percent: 0,
        projection: 0,
        criticalCount: 0,
        topSeller: null
      };

      return {
        ...summary,
        percent: summary.goal > 0 ? summary.achieved / summary.goal : 0
      };
    });
  }, [data]);

  const filteredSellers = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.sellers.filter((seller) => {
      if (statusFilter !== "all" && getStatusKey(seller.status) !== statusFilter) {
        return false;
      }

      if (
        departmentFilter !== "all" &&
        getDepartmentKey(seller.department) !== departmentFilter
      ) {
        return false;
      }

      if (
        searchName.trim() &&
        !normalizeText(seller.name).includes(normalizeText(searchName.trim()))
      ) {
        return false;
      }

      return true;
    });
  }, [data, departmentFilter, searchName, statusFilter]);

  if (error) {
    return (
      <section className="card team-panel">
        <p className="section-eyebrow">Equipe de vendas</p>
        <h2 className="section-title">Desempenho da equipe</h2>
        <p className="section-copy">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card team-panel">
        <p className="section-eyebrow">Equipe de vendas</p>
        <h2 className="section-title">Desempenho da equipe</h2>
        <p className="section-copy">Carregando dados...</p>
      </section>
    );
  }

  return (
    <section className="card team-panel">
      <div className="team-panel-header">
        <div>
          <p className="section-eyebrow">Loja fisica - equipe</p>
          <h2 className="section-title">Painel de desempenho mais limpo</h2>
          <p className="section-copy">
            A visao principal prioriza poucos sinais executivos. O detalhe fica
            separado por setor e por vendedor para reduzir ruido.
          </p>
        </div>

        <div className="team-panel-meta">
          <span className="connector-chip">
            {data.source === "google-sheets" ? "Google Sheets" : "Dados locais"}
          </span>
          <span className="connector-chip">{`Atualizado ${formatDateTime(data.updatedAt)}`}</span>
        </div>
      </div>

      {!forcedView ? (
        <div className="team-view-tabs" role="tablist" aria-label="Visoes da equipe">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`team-view-tab ${activeView === option.id ? "active" : ""}`}
              onClick={() => setActiveView(option.id)}
            >
              <strong>{option.label}</strong>
              <span>{option.note}</span>
            </button>
          ))}
        </div>
      ) : null}

      {activeView === "executive" ? (
        <ExecutiveSummary data={data} departmentSummaries={departmentSummaries} />
      ) : null}

      {activeView === "departments" ? (
        <DepartmentView summaries={departmentSummaries} />
      ) : null}

      {activeView === "sellers" ? (
        <div className="team-view-stack">
          <div className="team-filter-bar">
            <input
              className="team-search"
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="Buscar vendedor"
              type="text"
              value={searchName}
            />

            <select
              className="team-select"
              onChange={(event) => setDepartmentFilter(event.target.value as DepartmentFilter)}
              value={departmentFilter}
            >
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="team-select"
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              value={statusFilter}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="team-seller-grid">
            {filteredSellers.map((seller) => (
              <SellerCard key={seller.name} seller={seller} />
            ))}
          </div>

          {filteredSellers.length === 0 ? (
            <p className="team-empty">Nenhum vendedor encontrado com os filtros atuais.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
