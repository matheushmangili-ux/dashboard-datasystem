"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Target, Calendar, TrendingUp, ChevronDown, Store, Users,
  BarChart3, Award, Building2, Flame, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  Legend, RadialBarChart, RadialBar,
} from "recharts";

/* ───── Types ───── */
interface Seller {
  id: string;
  nome: string;
  foto: string;
  departamento: string;
  canal: string;
}

interface StoreMeta {
  id: string;
  name: string;
  canal: string;
  metaTotal: number;
  realizado: number;
}

/* ───── Mock stores performance ───── */
const MOCK_STORES: StoreMeta[] = [
  { id: "1", name: "Loja Física Principal", canal: "Loja Fisica", metaTotal: 180000, realizado: 142560 },
  { id: "2", name: "E-commerce (Tray)", canal: "E-commerce (Tray)", metaTotal: 85000, realizado: 71400 },
  { id: "3", name: "Venda Corporativa / B2B", canal: "Venda Corporativa / B2B", metaTotal: 45000, realizado: 28350 },
];

/* ───── Mock seller performance (seeded from localStorage names) ───── */
function generateSellerPerformance(sellers: Seller[]): { seller: Seller; meta: number; realizado: number; percent: number }[] {
  // Deterministic "random" based on seller name length
  return sellers.map((s) => {
    const seed = s.nome.length * 7 + s.departamento.length * 3;
    const meta = 15000 + (seed % 10) * 2000;
    const percent = 45 + (seed % 55);
    const realizado = Math.round((meta * percent) / 100);
    return { seller: s, meta, realizado, percent };
  });
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DEPARTMENTS = ["Vestuário", "Chapelaria", "Selaria", "Calçados", "Geral / Outros"];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/* ───── Radial gauge for store ───── */
function StoreGauge({ store }: { store: StoreMeta }) {
  const percent = store.metaTotal > 0 ? Math.round((store.realizado / store.metaTotal) * 100) : 0;
  const isGood = percent >= 70;
  const isMid = percent >= 40 && percent < 70;

  const data = [{ name: store.name, value: percent, fill: isGood ? "var(--success)" : isMid ? "var(--western-gold)" : "var(--destructive)" }];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
      <div className="flex items-center gap-2 mb-3">
        <Store className="w-4 h-4 text-primary" />
        <span className="text-sm font-bold text-foreground truncate">{store.name}</span>
      </div>

      <div className="h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={12} data={data} startAngle={180} endAngle={0}>
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "var(--muted)" }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center -mt-6 relative z-10">
        <p className={`text-3xl font-black font-heading tabular-nums ${isGood ? "text-success" : isMid ? "text-[var(--western-gold)]" : "text-destructive"}`}>
          {percent}%
        </p>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">Atingimento</p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Meta</p>
          <p className="text-xs font-mono font-bold text-foreground">{formatCurrency(store.metaTotal)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Realizado</p>
          <p className="text-xs font-mono font-bold text-foreground">{formatCurrency(store.realizado)}</p>
        </div>
      </div>
    </div>
  );
}

/* ───── Seller performance row ───── */
function SellerRow({ data, index }: { data: { seller: Seller; meta: number; realizado: number; percent: number }; index: number }) {
  const isGood = data.percent >= 70;
  const isMid = data.percent >= 40 && data.percent < 70;
  const color = isGood ? "text-success" : isMid ? "text-[var(--western-gold)]" : "text-destructive";
  const barColor = isGood ? "bg-success" : isMid ? "bg-[var(--western-gold)]" : "bg-destructive";
  const bgColor = isGood ? "bg-success/5" : isMid ? "bg-[var(--western-gold)]/5" : "bg-destructive/5";

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border border-border/60 ${bgColor} hover:border-primary/30 transition-all animate-in fade-in slide-in-from-bottom-2`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      {/* Rank */}
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-black text-muted-foreground shrink-0">
        {index + 1}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground truncate">{data.seller.nome}</p>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
          {data.seller.departamento} • {data.seller.canal?.split(" ")[0] || "—"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex-1 max-w-[200px] hidden md:block">
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(data.percent, 100)}%` }}
          />
        </div>
      </div>

      {/* Values */}
      <div className="text-right shrink-0">
        <p className={`text-lg font-black font-heading tabular-nums ${color}`}>
          {data.percent}%
        </p>
        <p className="text-[10px] text-muted-foreground font-mono">
          {formatCurrency(data.realizado)} / {formatCurrency(data.meta)}
        </p>
      </div>

      {/* Arrow */}
      <div className="shrink-0">
        {data.percent >= 70 ? (
          <ArrowUpRight className="w-4 h-4 text-success" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-destructive" />
        )}
      </div>
    </div>
  );
}

/* ───── Department bar chart ───── */
function DepartmentChart({ sellers }: { sellers: Seller[] }) {
  const data = DEPARTMENTS.map((dept) => {
    const deptSellers = sellers.filter((s) => s.departamento === dept);
    const count = deptSellers.length;
    const seed = dept.length * 13;
    const percent = count > 0 ? 35 + (seed % 60) : 0;
    return { name: dept.length > 10 ? dept.slice(0, 10) + "…" : dept, Atingimento: percent, Vendedores: count };
  });

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            formatter={(value: number, name: string) => [name === "Atingimento" ? `${value}%` : value, name]}
          />
          <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
          <Bar dataKey="Atingimento" fill="var(--primary)" radius={[6, 6, 0, 0]} animationDuration={1200} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═════════════════════════════════════════════════════ */
/* ═══               MAIN COMPONENT               ═══ */
/* ═════════════════════════════════════════════════════ */

export function MetasView() {
  const currentMonth = MONTHS[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedCanal, setSelectedCanal] = useState<string>("Todos");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filterDept, setFilterDept] = useState<string>("Todos");

  useEffect(() => {
    const stored = localStorage.getItem("tc_sellers");
    if (stored) {
      try {
        setSellers(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const sellerPerformance = useMemo(() => {
    let data = generateSellerPerformance(sellers);
    if (filterDept !== "Todos") {
      data = data.filter((d) => d.seller.departamento === filterDept);
    }
    if (selectedCanal !== "Todos") {
      data = data.filter((d) => d.seller.canal?.includes(selectedCanal));
    }
    return data.sort((a, b) => b.percent - a.percent);
  }, [sellers, filterDept, selectedCanal]);

  const filteredStores = useMemo(() => {
    if (selectedCanal === "Todos") return MOCK_STORES;
    return MOCK_STORES.filter((s) => s.canal.includes(selectedCanal));
  }, [selectedCanal]);

  /* Summary stats */
  const totalMeta = MOCK_STORES.reduce((a, s) => a + s.metaTotal, 0);
  const totalRealizado = MOCK_STORES.reduce((a, s) => a + s.realizado, 0);
  const overallPercent = totalMeta > 0 ? Math.round((totalRealizado / totalMeta) * 100) : 0;
  const avgSellerPercent = sellerPerformance.length > 0
    ? Math.round(sellerPerformance.reduce((a, s) => a + s.percent, 0) / sellerPerformance.length)
    : 0;
  const topPerformer = sellerPerformance[0];

  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <div className="flex items-center gap-3 mb-1">
          <Target className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-extrabold font-heading tracking-tight">Metas da Loja</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          Visualize o atingimento das metas por loja e por vendedor. Para configurar metas, acesse <b>Cadastros → Diretrizes de Metas</b>.
        </p>
      </header>

      <div className="p-8 w-full max-w-[1400px] flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* ── Filters ── */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-5 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">Filtros</span>
          </div>

          <div className="flex flex-wrap gap-4 flex-1">
            <div className="relative min-w-[160px]">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none text-sm font-medium"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m} {new Date().getFullYear()}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={selectedCanal}
                onChange={(e) => setSelectedCanal(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none text-sm font-medium"
              >
                <option>Todos</option>
                <option>Loja Fisica</option>
                <option>E-commerce</option>
                <option>Corporativa</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none text-sm font-medium"
              >
                <option>Todos</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Summary KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Meta Consolidada",
              value: formatCurrency(totalMeta),
              sub: selectedMonth + " " + new Date().getFullYear(),
              icon: Target,
              color: "text-primary",
            },
            {
              label: "Total Realizado",
              value: formatCurrency(totalRealizado),
              sub: `${overallPercent}% da meta`,
              icon: TrendingUp,
              color: overallPercent >= 70 ? "text-success" : "text-[var(--western-gold)]",
            },
            {
              label: "Média dos Vendedores",
              value: `${avgSellerPercent}%`,
              sub: `${sellerPerformance.length} vendedor(es)`,
              icon: Users,
              color: avgSellerPercent >= 70 ? "text-success" : "text-[var(--western-gold)]",
            },
            {
              label: "Top Performer",
              value: topPerformer ? `${topPerformer.percent}%` : "—",
              sub: topPerformer?.seller.nome || "Cadastre vendedores",
              icon: Award,
              color: "text-[var(--western-gold)]",
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
                </div>
                <p className={`text-2xl font-black font-heading tabular-nums ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{kpi.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── Performance por Loja ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-heading tracking-tight">Performance por Loja</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredStores.map((store) => (
              <StoreGauge key={store.id} store={store} />
            ))}
          </div>
        </div>

        {/* ── Performance por Departamento ── */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-heading tracking-tight">Atingimento por Departamento</h2>
          </div>
          <DepartmentChart sellers={sellers} />
        </div>

        {/* ── Performance por Vendedor ── */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[var(--western-sunset)]" />
              <h2 className="text-lg font-bold font-heading tracking-tight">Ranking de Vendedores</h2>
            </div>
            <span className="text-xs font-bold bg-muted px-3 py-1 rounded-full text-muted-foreground border border-border">
              {sellerPerformance.length} vendedor(es)
            </span>
          </div>

          <div className="p-6 space-y-3">
            {sellerPerformance.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-border/80">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  Nenhum vendedor cadastrado. Acesse <b>Cadastros → Vendedores</b> para adicionar sua equipe.
                </p>
              </div>
            ) : (
              sellerPerformance.map((data, i) => (
                <SellerRow key={data.seller.id} data={data} index={i} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
