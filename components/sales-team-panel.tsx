"use client";

import { useEffect, useMemo, useState } from "react";
import type { SpreadsheetData, SellerGoal } from "@/lib/spreadsheet/parse-metas";

type StatusFilter = "all" | "Acima da Meta" | "No Caminho" | "Atenção" | "Crítico";
type DepartmentFilter = "all" | "Chapelaria" | "Selaria" | "Vestuário";

const DEPARTMENTS = ["Chapelaria", "Selaria", "Vestuário"] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function statusClass(status: string) {
  const n = status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (n.includes("acima")) return "st-above";
  if (n.includes("caminho")) return "st-ontrack";
  if (n.includes("atencao")) return "st-attention";
  return "st-critical";
}

function departmentIcon(dept: string) {
  if (dept === "Chapelaria") return "🤠";
  if (dept === "Selaria") return "🐴";
  return "👔";
}

function OverviewStrip({ data }: { data: SpreadsheetData }) {
  const { overview } = data;
  const pct = Math.min(overview.achievedPercent * 100, 100);

  return (
    <div className="sp-overview">
      <div className="sp-overview-row">
        <div className="sp-ov-item">
          <span className="sp-ov-label">Meta do mês</span>
          <strong>{formatCurrency(overview.monthlyGoal)}</strong>
        </div>
        <div className="sp-ov-item">
          <span className="sp-ov-label">Realizado</span>
          <strong>{formatCurrency(overview.achievedTotal)}</strong>
        </div>
        <div className="sp-ov-item">
          <span className="sp-ov-label">% Atingido</span>
          <strong>{formatPercent(overview.achievedPercent)}</strong>
        </div>
        <div className="sp-ov-item">
          <span className="sp-ov-label">Projeção</span>
          <strong>{formatCurrency(overview.projection)}</strong>
        </div>
        <div className="sp-ov-item">
          <span className="sp-ov-label">Meta diária</span>
          <strong>{formatCurrency(overview.dailyGoalNeeded)}</strong>
        </div>
        <div className="sp-ov-item">
          <span className={`sp-rhythm ${overview.rhythm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
            {overview.rhythm}
          </span>
          <span className="sp-ov-sub">{overview.daysWorked}/{overview.daysTotal} dias ({overview.daysRemaining} restantes)</span>
        </div>
      </div>
      <div className="sp-bar-track">
        <div className="sp-bar-fill" style={{ width: `${pct}%` }} />
        <span className="sp-bar-label">{formatPercent(overview.achievedPercent)}</span>
      </div>
      <div className="sp-weeks-row">
        {data.weeks.map((w) => (
          <div className="sp-week" key={w.weekNumber}>
            <span className="sp-week-num">S{w.weekNumber}</span>
            <strong className="sp-week-val">{formatCurrency(w.achieved)}</strong>
            <span className={`sp-week-pct ${w.achievedPercent >= 1 ? "pos" : ""}`}>
              {formatPercent(w.achievedPercent)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SellerCard({ seller }: { seller: SellerGoal }) {
  const pct = Math.min(seller.achievedPercent * 100, 100);

  return (
    <div className={`sp-seller-card ${statusClass(seller.status)}`}>
      <div className="sp-seller-top">
        <div className="sp-seller-rank">{seller.rank}</div>
        <div className="sp-seller-info">
          <strong className="sp-seller-name">{seller.name}</strong>
          <span className="sp-seller-dept">{departmentIcon(seller.department)} {seller.department}</span>
        </div>
        <span className={`sp-seller-badge ${statusClass(seller.status)}`}>{seller.status}</span>
      </div>

      <div className="sp-seller-bar-track">
        <div className="sp-seller-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="sp-seller-metrics">
        <div>
          <span className="sp-m-label">Realizado</span>
          <strong className="sp-m-value">{formatCurrency(seller.achieved)}</strong>
        </div>
        <div>
          <span className="sp-m-label">Meta</span>
          <span className="sp-m-value">{formatCurrency(seller.monthlyGoal)}</span>
        </div>
        <div>
          <span className="sp-m-label">% Meta</span>
          <strong className="sp-m-value">{formatPercent(seller.achievedPercent)}</strong>
        </div>
        <div>
          <span className="sp-m-label">Falta</span>
          <span className="sp-m-value">{formatCurrency(seller.remaining)}</span>
        </div>
      </div>

      <div className="sp-seller-metrics">
        <div>
          <span className="sp-m-label">Média/dia</span>
          <span className="sp-m-value">{formatCurrency(seller.dailyAverage)}</span>
        </div>
        <div>
          <span className="sp-m-label">Meta diária</span>
          <span className="sp-m-value">{formatCurrency(seller.dailyGoalNeeded)}</span>
        </div>
        <div>
          <span className="sp-m-label">Projeção</span>
          <span className="sp-m-value">{formatCurrency(seller.projection)}</span>
        </div>
        <div>
          <span className="sp-m-label">Melhor dia</span>
          <span className="sp-m-value">{formatCurrency(seller.bestDay)}</span>
        </div>
      </div>
    </div>
  );
}

function DepartmentSection({ department, sellers }: { department: string; sellers: SellerGoal[] }) {
  if (sellers.length === 0) return null;

  const totalAchieved = sellers.reduce((s, v) => s + v.achieved, 0);
  const totalGoal = sellers.reduce((s, v) => s + v.monthlyGoal, 0);

  return (
    <div className="sp-dept-section">
      <div className="sp-dept-header">
        <h3 className="sp-dept-title">{departmentIcon(department)} {department}</h3>
        <span className="sp-dept-summary">
          {formatCurrency(totalAchieved)} / {formatCurrency(totalGoal)} ({formatPercent(totalGoal > 0 ? totalAchieved / totalGoal : 0)})
        </span>
      </div>
      <div className="sp-seller-grid">
        {sellers.map((seller) => (
          <SellerCard key={seller.name} seller={seller} />
        ))}
      </div>
    </div>
  );
}

export function SalesTeamPanel() {
  const [data, setData] = useState<SpreadsheetData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deptFilter, setDeptFilter] = useState<DepartmentFilter>("all");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetch("/api/metas", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar metas");
        return res.json() as Promise<SpreadsheetData>;
      })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro desconhecido"));
  }, []);

  const filteredSellers = useMemo(() => {
    if (!data) return [];
    let list = [...data.sellers];

    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }

    if (deptFilter !== "all") {
      list = list.filter((s) => s.department === deptFilter);
    }

    if (searchName.trim()) {
      const q = searchName.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    return list;
  }, [data, statusFilter, deptFilter, searchName]);

  const groupedByDept = useMemo(() => {
    const groups: Record<string, SellerGoal[]> = {};
    for (const dept of DEPARTMENTS) {
      groups[dept] = filteredSellers.filter((s) => s.department === dept);
    }
    return groups;
  }, [filteredSellers]);

  if (error) {
    return (
      <section className="card sp-panel">
        <p className="section-eyebrow">Equipe de vendas</p>
        <h2 className="section-title">Performance da equipe</h2>
        <p className="section-copy">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card sp-panel">
        <p className="section-eyebrow">Equipe de vendas</p>
        <h2 className="section-title">Performance da equipe</h2>
        <p className="section-copy">Carregando dados...</p>
      </section>
    );
  }

  return (
    <section className="card sp-panel">
      <div className="sp-header">
        <div>
          <p className="section-eyebrow">Loja física — Performance</p>
          <h2 className="section-title">Desempenho da equipe</h2>
          <p className="section-copy">
            Acompanhamento de metas e resultados individuais por setor.
          </p>
        </div>
        <span className="connector-chip">
          {data.source === "google-sheets" ? "Google Sheets" : "Dados locais"}
        </span>
      </div>

      <OverviewStrip data={data} />

      <div className="sp-filters">
        <input
          className="sp-search"
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Buscar vendedor..."
          type="text"
          value={searchName}
        />
        <select
          className="sp-select"
          onChange={(e) => setDeptFilter(e.target.value as DepartmentFilter)}
          value={deptFilter}
        >
          <option value="all">Todos os setores</option>
          <option value="Chapelaria">Chapelaria</option>
          <option value="Selaria">Selaria</option>
          <option value="Vestuário">Vestuário</option>
        </select>
        <select
          className="sp-select"
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          value={statusFilter}
        >
          <option value="all">Todos os status</option>
          <option value="Acima da Meta">Acima da Meta</option>
          <option value="No Caminho">No Caminho</option>
          <option value="Atenção">Atenção</option>
          <option value="Crítico">Crítico</option>
        </select>
      </div>

      {DEPARTMENTS.map((dept) => (
        <DepartmentSection
          department={dept}
          key={dept}
          sellers={groupedByDept[dept] ?? []}
        />
      ))}

      {filteredSellers.length === 0 && (
        <p className="sp-empty">Nenhum vendedor encontrado com os filtros selecionados.</p>
      )}
    </section>
  );
}
