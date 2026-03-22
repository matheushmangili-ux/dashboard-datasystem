"use client";

import { useState, useMemo } from "react";
import {
  Target, TrendingUp, TrendingDown, Users, DollarSign,
  ShoppingCart, Percent, Award, ChevronDown, ChevronUp,
  BarChart3, CalendarDays, Coins
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, Legend
} from "recharts";

import type {
  SpreadsheetData,
  SellerGoal,
  WeeklySummary,
  WeekDetail,
  CommissionEntry
} from "@/lib/spreadsheet/parse-metas";

/* ─────── helpers ─────── */

function fmtCurrency(v: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function fmtPercent(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

function statusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("acima") || s.includes("excelente")) return "text-success";
  if (s.includes("caminho") || s.includes("bom")) return "text-blue-500";
  if (s.includes("aten")) return "text-amber-500";
  if (s.includes("cr")) return "text-destructive";
  if (s.includes("aguard")) return "text-muted-foreground";
  return "text-foreground";
}

function statusBg(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("acima") || s.includes("excelente")) return "bg-success/10 border-success/20";
  if (s.includes("caminho") || s.includes("bom")) return "bg-blue-500/10 border-blue-500/20";
  if (s.includes("aten")) return "bg-amber-500/10 border-amber-500/20";
  if (s.includes("cr")) return "bg-destructive/10 border-destructive/20";
  if (s.includes("aguard")) return "bg-muted/30 border-border";
  return "bg-muted/30 border-border";
}

function barColor(percent: number): string {
  if (percent >= 1) return "hsl(var(--success))";
  if (percent >= 0.7) return "hsl(var(--primary))";
  if (percent >= 0.5) return "hsl(210 80% 55%)";
  return "hsl(var(--destructive))";
}

/* ─────── sub-components ─────── */

type TabId = "geral" | "semanas" | "ranking" | "comissao";

function KpiHighlight({
  label,
  value,
  caption,
  icon: Icon,
  accent
}: {
  label: string;
  value: string;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "success" | "amber" | "blue";
}) {
  const accentClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  };
  const cls = accent ? accentClasses[accent] : "bg-muted/50 text-foreground border-border";

  return (
    <div className={`p-5 rounded-xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${cls}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 opacity-70" />
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
      </div>
      <div className="text-3xl font-black font-heading tracking-tight">{value}</div>
      <p className="text-xs mt-1 opacity-60">{caption}</p>
    </div>
  );
}

function WeeklyOverviewCards({ weeks }: { weeks: WeeklySummary[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {weeks.map((w) => {
        const isPositive = w.achievedPercent >= 1;
        return (
          <div key={w.weekNumber} className="p-4 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                Semana {w.weekNumber}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                w.achieved === 0
                  ? "bg-muted text-muted-foreground"
                  : isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
              }`}>
                {w.achieved === 0 ? "Aguardando" : fmtPercent(w.achievedPercent)}
              </span>
            </div>
            <div className="text-lg font-bold">{fmtCurrency(w.achieved)}</div>
            <div className="text-xs text-muted-foreground">Meta: {fmtCurrency(w.goal)}</div>
            <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${isPositive ? "bg-success" : "bg-primary"}`}
                style={{ width: `${Math.min(w.achievedPercent * 100, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SellerRankingTable({ sellers }: { sellers: SellerGoal[] }) {
  const [sortKey, setSortKey] = useState<"rank" | "achieved" | "achievedPercent" | "projection">("rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const copy = [...sellers];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return copy;
  }, [sellers, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "rank" ? "asc" : "desc");
    }
  };

  const SortIcon = sortDir === "asc" ? ChevronUp : ChevronDown;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 px-3 cursor-pointer hover:text-primary" onClick={() => toggleSort("rank")}>
              <div className="flex items-center gap-1"># {sortKey === "rank" && <SortIcon className="w-3 h-3" />}</div>
            </th>
            <th className="py-3 px-3">Vendedor</th>
            <th className="py-3 px-3 text-right">Meta Mês</th>
            <th className="py-3 px-3 text-right cursor-pointer hover:text-primary" onClick={() => toggleSort("achieved")}>
              <div className="flex items-center justify-end gap-1">Realizado {sortKey === "achieved" && <SortIcon className="w-3 h-3" />}</div>
            </th>
            <th className="py-3 px-3 text-right cursor-pointer hover:text-primary" onClick={() => toggleSort("achievedPercent")}>
              <div className="flex items-center justify-end gap-1">% Ating. {sortKey === "achievedPercent" && <SortIcon className="w-3 h-3" />}</div>
            </th>
            <th className="py-3 px-3 text-right">Falta</th>
            <th className="py-3 px-3 text-right">Meta/Dia</th>
            <th className="py-3 px-3 text-right cursor-pointer hover:text-primary" onClick={() => toggleSort("projection")}>
              <div className="flex items-center justify-end gap-1">Projeção {sortKey === "projection" && <SortIcon className="w-3 h-3" />}</div>
            </th>
            <th className="py-3 px-3 text-right">Média/Dia</th>
            <th className="py-3 px-3 text-right">Melhor Dia</th>
            <th className="py-3 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={s.name} className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${i === 0 ? "bg-success/5" : ""}`}>
              <td className="py-3 px-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.rank <= 3 ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground"
                }`}>
                  {s.rank}
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.department}</div>
              </td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(s.monthlyGoal)}</td>
              <td className="py-3 px-3 text-right font-bold">{fmtCurrency(s.achieved)}</td>
              <td className="py-3 px-3 text-right">
                <span className={`font-bold ${s.achievedPercent >= 0.7 ? "text-success" : s.achievedPercent >= 0.5 ? "text-amber-500" : "text-destructive"}`}>
                  {fmtPercent(s.achievedPercent)}
                </span>
              </td>
              <td className="py-3 px-3 text-right font-mono text-xs text-muted-foreground">{fmtCurrency(s.remaining)}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(s.dailyGoalNeeded)}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(s.projection)}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(s.dailyAverage)}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(s.bestDay)}</td>
              <td className="py-3 px-3 text-center">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${statusBg(s.status)} ${statusColor(s.status)}`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WeekDetailPanel({ detail }: { detail: WeekDetail }) {
  const [expanded, setExpanded] = useState(false);
  const displaySellers = expanded ? detail.sellers : detail.sellers.slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between">
        <div>
          <h4 className="font-bold tracking-tight">{detail.title}</h4>
          <p className="text-xs text-muted-foreground">{detail.workingDays} dias úteis | Dias: {detail.dayLabels.join(", ")}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/10 text-left">
              <th className="py-2 px-3 font-semibold">Vendedor</th>
              <th className="py-2 px-3 text-right font-semibold">Meta Sem.</th>
              {detail.dayLabels.map((d, i) => (
                <th key={i} className="py-2 px-3 text-right font-semibold">{d}</th>
              ))}
              <th className="py-2 px-3 text-right font-semibold">Total</th>
              <th className="py-2 px-3 text-right font-semibold">%</th>
              <th className="py-2 px-3 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {displaySellers.map((s) => (
              <tr key={s.name} className="border-b border-border/30 hover:bg-muted/20">
                <td className="py-2 px-3 font-semibold whitespace-nowrap">{s.name}</td>
                <td className="py-2 px-3 text-right font-mono">{fmtCurrency(s.weeklyGoal)}</td>
                {detail.dayLabels.map((_, i) => (
                  <td key={i} className="py-2 px-3 text-right font-mono">
                    {s.dailySales[i] !== undefined ? fmtCurrency(s.dailySales[i]) : "—"}
                  </td>
                ))}
                <td className="py-2 px-3 text-right font-bold">{fmtCurrency(s.totalAchieved)}</td>
                <td className="py-2 px-3 text-right">
                  <span className={`font-bold ${s.achievedPercent >= 1 ? "text-success" : s.achievedPercent >= 0.7 ? "text-amber-500" : "text-destructive"}`}>
                    {fmtPercent(s.achievedPercent)}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBg(s.status)} ${statusColor(s.status)}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail.sellers.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs font-semibold text-primary hover:bg-muted/30 transition-colors border-t border-border"
        >
          {expanded ? "Ver menos" : `Ver todos (${detail.sellers.length})`}
        </button>
      )}
    </div>
  );
}

function CommissionTable({ commissions }: { commissions: CommissionEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 px-3">Vendedor</th>
            <th className="py-3 px-3 text-right">Sem 1</th>
            <th className="py-3 px-3 text-right">Sem 2</th>
            <th className="py-3 px-3 text-right">Sem 3</th>
            <th className="py-3 px-3 text-right">Sem 4</th>
            <th className="py-3 px-3 text-right">Total</th>
            <th className="py-3 px-3 text-right">% Ating.</th>
            <th className="py-3 px-3">Faixa</th>
            <th className="py-3 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((c) => (
            <tr key={c.name} className="border-b border-border/40 hover:bg-muted/30">
              <td className="py-3 px-3 font-semibold">{c.name}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(c.week1)}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(c.week2)}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(c.week3)}</td>
              <td className="py-3 px-3 text-right font-mono text-xs">{fmtCurrency(c.week4)}</td>
              <td className="py-3 px-3 text-right font-bold">{fmtCurrency(c.total)}</td>
              <td className="py-3 px-3 text-right font-bold">
                <span className={c.achievedPercent >= 1 ? "text-success" : c.achievedPercent >= 0.5 ? "text-amber-500" : "text-destructive"}>
                  {fmtPercent(c.achievedPercent)}
                </span>
              </td>
              <td className="py-3 px-3 text-xs text-muted-foreground">{c.band}</td>
              <td className="py-3 px-3 text-center">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${statusBg(c.status)} ${statusColor(c.status)}`}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────── main component ─────── */

export function MetasView({ data }: { data: SpreadsheetData }) {
  const [activeTab, setActiveTab] = useState<TabId>("geral");
  const [selectedWeek, setSelectedWeek] = useState(0);

  const { overview, sellers, weeks, weekDetails, commissions } = data;

  const totalTeamAchieved = sellers.reduce((sum, s) => sum + s.achieved, 0);
  const totalTeamGoal = sellers.reduce((sum, s) => sum + s.monthlyGoal, 0);

  // Chart data for seller performance
  const sellerChartData = useMemo(() =>
    [...sellers]
      .sort((a, b) => b.achieved - a.achieved)
      .map((s) => ({
        name: s.name.split(" ")[0],
        achieved: s.achieved,
        goal: s.monthlyGoal,
        percent: s.achievedPercent
      })),
    [sellers]
  );

  // Chart data for weekly performance
  const weekChartData = useMemo(() =>
    weeks.map((w) => ({
      name: `Sem ${w.weekNumber}`,
      meta: w.goal,
      realizado: w.achieved,
      percent: w.achievedPercent
    })),
    [weeks]
  );

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "geral", label: "Visão Geral", icon: BarChart3 },
    { id: "semanas", label: "Semanas", icon: CalendarDays },
    { id: "ranking", label: "Ranking", icon: Award },
    { id: "comissao", label: "Comissionamento", icon: Coins }
  ];

  return (
    <div className="flex-1 flex flex-col font-sans bg-background min-h-screen">
      {/* HEADER */}
      <header className="px-8 py-6 w-full border-b border-border/50 bg-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold font-heading tracking-tight flex items-center gap-3">
              <Target className="w-7 h-7 text-primary" />
              Metas Março 2026
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Acompanhamento consolidado de vendas da loja | Atualizado: {new Date(data.updatedAt).toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
              overview.rhythm === "CRÍTICO"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-success/10 text-success border-success/20"
            }`}>
              Ritmo: {overview.rhythm}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
              {overview.daysWorked}/{overview.daysTotal} dias
            </span>
          </div>
        </div>

        {/* TABS */}
        <nav className="flex mt-6 bg-muted/50 p-1 rounded-lg border border-border w-fit">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500">

        {/* ─── TAB: VISÃO GERAL ─── */}
        {activeTab === "geral" && (
          <>
            {/* Hero KPI Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Big Revenue Card */}
              <div className="lg:col-span-2 p-6 rounded-2xl border border-primary/20 bg-primary text-primary-foreground shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
                <p className="text-primary-foreground/70 font-medium text-xs uppercase mb-1 tracking-wider">Realizado do Mês</p>
                <h2 className="text-4xl font-black font-heading tracking-tight">{fmtCurrency(overview.achievedTotal)}</h2>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-block px-2.5 py-1 bg-white/10 rounded-lg text-xs font-bold backdrop-blur-sm">
                    {fmtPercent(overview.achievedPercent)} da meta
                  </span>
                  <span className="text-xs text-primary-foreground/60">
                    Meta: {fmtCurrency(overview.monthlyGoal)}
                  </span>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-2 text-primary-foreground/70 font-medium">
                    <span>Progresso</span>
                    <span>{fmtPercent(overview.achievedPercent)}</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-3">
                    <div
                      className="bg-success h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(overview.achievedPercent * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <KpiHighlight
                label="Tm p.U"
                value={fmtCurrency(overview.ticketMedioPU)}
                caption="Ticket Médio por Unidade"
                icon={DollarSign}
                accent="primary"
              />
              <KpiHighlight
                label="P.A."
                value={overview.piecesPerAttendance.toFixed(2)}
                caption="Peças por Atendimento"
                icon={ShoppingCart}
                accent="blue"
              />
              <KpiHighlight
                label="Taxa de Conversão"
                value={`${overview.conversionRate}%`}
                caption="Fluxo / Vendas"
                icon={Percent}
                accent="amber"
              />
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Projeção</span>
                </div>
                <div className="text-xl font-bold">{fmtCurrency(overview.projection)}</div>
                <p className="text-xs text-muted-foreground">{fmtPercent(overview.projectionPercent)} da meta</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Meta Diária</span>
                </div>
                <div className="text-xl font-bold">{fmtCurrency(overview.dailyGoalNeeded)}</div>
                <p className="text-xs text-muted-foreground">Necessário por dia</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Dias Restantes</span>
                </div>
                <div className="text-xl font-bold">{overview.daysRemaining}</div>
                <p className="text-xs text-muted-foreground">{overview.daysWorked} trabalhados de {overview.daysTotal}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  {overview.vsLastYearPercent >= 1 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-xs font-bold uppercase text-muted-foreground">vs Ano Anterior</span>
                </div>
                <div className="text-xl font-bold">{fmtPercent(overview.vsLastYearPercent)}</div>
                <p className="text-xs text-muted-foreground">Ref LY: {fmtCurrency(overview.refLastYear)}</p>
              </div>
            </div>

            {/* Weekly Overview */}
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Visão por Semana
              </h3>
              <WeeklyOverviewCards weeks={weeks} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Chart */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-4">Meta vs Realizado por Semana</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekChartData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [fmtCurrency(Number(value))]}
                      />
                      <Bar dataKey="meta" fill="hsl(var(--muted-foreground) / 0.3)" radius={[4, 4, 0, 0]} name="Meta" />
                      <Bar dataKey="realizado" radius={[4, 4, 0, 0]} name="Realizado">
                        {weekChartData.map((entry, index) => (
                          <Cell key={index} fill={barColor(entry.percent)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Seller Chart */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-4">Realizado por Vendedor</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sellerChartData} layout="vertical" barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [fmtCurrency(Number(value))]}
                      />
                      <Bar dataKey="achieved" radius={[0, 4, 4, 0]} name="Realizado">
                        {sellerChartData.map((entry, index) => (
                          <Cell key={index} fill={barColor(entry.percent)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Ranking Preview */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold tracking-tight">Ranking Individual</h3>
                </div>
                <button
                  onClick={() => setActiveTab("ranking")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Ver completo &rarr;
                </button>
              </div>
              <SellerRankingTable sellers={sellers} />
            </div>
          </>
        )}

        {/* ─── TAB: SEMANAS ─── */}
        {activeTab === "semanas" && (
          <>
            {weekDetails.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                {weekDetails.map((wd, i) => (
                  <button
                    key={wd.weekNumber}
                    onClick={() => setSelectedWeek(i)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      selectedWeek === i
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    Semana {wd.weekNumber}
                  </button>
                ))}
              </div>
            )}

            <WeeklyOverviewCards weeks={weeks} />

            {weekDetails.length > 0 && (
              <WeekDetailPanel detail={weekDetails[selectedWeek]} />
            )}
          </>
        )}

        {/* ─── TAB: RANKING ─── */}
        {activeTab === "ranking" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiHighlight
                label="Tm p.U"
                value={fmtCurrency(overview.ticketMedioPU)}
                caption="Ticket Médio por Unidade"
                icon={DollarSign}
                accent="primary"
              />
              <KpiHighlight
                label="P.A."
                value={overview.piecesPerAttendance.toFixed(2)}
                caption="Peças por Atendimento"
                icon={ShoppingCart}
                accent="blue"
              />
              <KpiHighlight
                label="Taxa de Conversão"
                value={`${overview.conversionRate}%`}
                caption="Fluxo / Vendas"
                icon={Percent}
                accent="amber"
              />
              <KpiHighlight
                label="Equipe Total"
                value={fmtCurrency(totalTeamAchieved)}
                caption={`Meta: ${fmtCurrency(totalTeamGoal)}`}
                icon={Users}
                accent="success"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold tracking-tight">Ranking Individual - Desempenho do Mês</h3>
                </div>
              </div>
              <SellerRankingTable sellers={sellers} />
            </div>

            {/* Seller Performance Chart */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-4">Comparativo Meta vs Realizado</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sellerChartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any) => [fmtCurrency(Number(value))]}
                    />
                    <Legend formatter={(value: string) => (value === "goal" ? "Meta" : "Realizado")} />
                    <Bar dataKey="goal" fill="hsl(var(--muted-foreground) / 0.3)" radius={[4, 4, 0, 0]} name="goal" />
                    <Bar dataKey="achieved" radius={[4, 4, 0, 0]} name="achieved">
                      {sellerChartData.map((entry, index) => (
                        <Cell key={index} fill={barColor(entry.percent)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ─── TAB: COMISSIONAMENTO ─── */}
        {activeTab === "comissao" && (
          <>
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold tracking-tight">Comissionamento - Resumo do Mês</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Valores de comissão por semana e faixa de atingimento</p>
              </div>
              <CommissionTable commissions={commissions} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
