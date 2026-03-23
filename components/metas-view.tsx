"use client";

import { useState, useEffect, useMemo } from "react";
import { Target, Calendar, TrendingUp, ChevronDown, Percent, BarChart3, Sparkles, Building2, Users } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, Legend
} from "recharts";

/* ───── Types ───── */
interface WeekGoal {
  week: number;
  label: string;
  value: number;
  percent: number;
}

interface Seller {
  id: string;
  nome: string;
  foto: string;
  departamento: string;
  canal: string;
}

/* ───── Mock data for last year's revenue ───── */
const LAST_YEAR_MONTHLY: Record<string, { total: number; weeks: number[] }> = {
  "Janeiro": { total: 120000, weeks: [28000, 30000, 32000, 30000] },
  // ... omitting some for brevity to keep file clean, but let's just keep the original structure
  "Fevereiro": { total: 110000, weeks: [26000, 28000, 29000, 27000] },
  "Marco": { total: 135000, weeks: [32000, 34000, 35000, 34000] },
  "Abril": { total: 125000, weeks: [30000, 31000, 33000, 31000] },
  "Maio": { total: 140000, weeks: [33000, 35000, 37000, 35000] },
  "Junho": { total: 115000, weeks: [27000, 29000, 30000, 29000] },
  "Julho": { total: 130000, weeks: [31000, 33000, 34000, 32000] },
  "Agosto": { total: 145000, weeks: [34000, 36000, 38000, 37000] },
  "Setembro": { total: 150000, weeks: [35000, 38000, 39000, 38000] },
  "Outubro": { total: 160000, weeks: [38000, 40000, 42000, 40000] },
  "Novembro": { total: 180000, weeks: [42000, 45000, 48000, 45000] },
  "Dezembro": { total: 200000, weeks: [47000, 50000, 53000, 50000] },
};

const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DEFAULT_WEEK_PERCENTS = [22, 25, 28, 25];

const DEPARTMENTS = ["Vestuário", "Chapelaria", "Selaria", "Calçados", "Geral / Outros"];
const DEFAULT_DEPT_PERCENTS = [40, 20, 15, 15, 10];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/* ───── Animated growth indicator ───── */
function GrowthAnimation({ growthPercent, isVisible }: { growthPercent: number; isVisible: boolean }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    if (!isVisible) { setAnimatedValue(0); return; }
    setShowSparkle(false);
    let start = 0;
    const target = growthPercent;
    const duration = 1500;
    const startTime = Date.now();
    let rafId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = target * eased;
      setAnimatedValue(start);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setShowSparkle(true);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [growthPercent, isVisible]);

  const isPositive = growthPercent >= 0;
  const color = isPositive ? "text-success" : "text-destructive";
  const bgColor = isPositive ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20";

  return (
    <div className={`relative p-6 rounded-2xl border ${bgColor} transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <TrendingUp className={`w-6 h-6 ${color} ${isPositive ? "" : "rotate-180"}`} />
          {showSparkle && (
            <Sparkles className="w-4 h-4 text-[var(--western-gold)] absolute -top-2 -right-2 animate-pulse" />
          )}
        </div>
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Crescimento vs Ano Anterior
        </span>
      </div>
      <div className={`text-4xl font-black font-heading ${color} tabular-nums`}>
        {isPositive ? "+" : ""}{animatedValue.toFixed(1)}%
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Comparado ao mesmo período em {new Date().getFullYear() - 1}
      </p>

      {/* Animated bar behind */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl overflow-hidden bg-black/5">
        <div
          className={`h-full rounded-b-2xl transition-all duration-[1500ms] ease-out ${isPositive ? "bg-success/40" : "bg-destructive/40"}`}
          style={{ width: `${Math.min(Math.abs(animatedValue), 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ───── Week comparison chart ───── */
function WeekComparisonChart({ currentWeeks, lastYearWeeks }: { currentWeeks: WeekGoal[]; lastYearWeeks: number[] }) {
  const data = currentWeeks.map((w, i) => ({
    name: w.label,
    "Meta Atual": w.value,
    "Ano Anterior": lastYearWeeks[i] || 0,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            formatter={(value) => formatCurrency(Number(value))}
          />
          <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
          <Bar dataKey="Meta Atual" fill="var(--primary)" radius={[6, 6, 0, 0]} animationDuration={1200} />
          <Bar dataKey="Ano Anterior" fill="var(--western-gold)" radius={[6, 6, 0, 0]} opacity={0.6} animationDuration={1200} animationBegin={300} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───── Monthly trend chart ───── */
function MonthlyTrendChart({ selectedMonth, totalGoal }: { selectedMonth: string; totalGoal: number }) {
  const data = MONTHS.map((m) => {
    const ly = LAST_YEAR_MONTHLY[m];
    return {
      name: m.slice(0, 3),
      "Ano Anterior": ly?.total || 0,
      "Meta Atual": m === selectedMonth ? totalGoal : 0,
    };
  });

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--western-gold)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--western-gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} />
          <YAxis tickLine={false} axisLine={false} fontSize={10} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--card)", fontSize: "11px" }} formatter={(value) => formatCurrency(Number(value))} />
          <Area type="monotone" dataKey="Ano Anterior" stroke="var(--western-gold)" fillOpacity={1} fill="url(#colorLY)" strokeWidth={2} animationDuration={2000} />
        </AreaChart>
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
  const [totalGoal, setTotalGoal] = useState<number>(0);
  const [weekPercents, setWeekPercents] = useState<number[]>([...DEFAULT_WEEK_PERCENTS]);
  const [deptPercents, setDeptPercents] = useState<number[]>([...DEFAULT_DEPT_PERCENTS]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [canal, setCanal] = useState<string>("Loja Fisica");
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tc_sellers");
    if (stored) {
      try {
        setSellers(JSON.parse(stored));
      } catch (e) {}
    }
  }, [showChart]); // refetch when submitted

  const lastYear = LAST_YEAR_MONTHLY[selectedMonth] || { total: 0, weeks: [0, 0, 0, 0] };

  const weeks: WeekGoal[] = useMemo(() => {
    return weekPercents.map((pct, i) => ({
      week: i + 1,
      label: `Semana ${i + 1}`,
      value: Math.round((totalGoal * pct) / 100),
      percent: pct,
    }));
  }, [totalGoal, weekPercents]);

  const depts = useMemo(() => {
    return DEPARTMENTS.map((name, i) => {
      const pct = deptPercents[i] || 0;
      const value = Math.round((totalGoal * pct) / 100);
      const deptSellers = sellers.filter(s => s.departamento === name);
      const sellerValue = deptSellers.length > 0 ? value / deptSellers.length : 0;
      
      return { 
        name, 
        percent: pct, 
        value, 
        sellers: deptSellers, 
        sellerValue 
      };
    });
  }, [totalGoal, deptPercents, sellers]);

  const growthPercent = useMemo(() => {
    if (!lastYear.total || !totalGoal) return 0;
    return ((totalGoal - lastYear.total) / lastYear.total) * 100;
  }, [totalGoal, lastYear.total]);

  const totalWeekPercent = weekPercents.reduce((a, b) => a + b, 0);
  const isWeekPercentValid = totalWeekPercent === 100;

  const totalDeptPercent = deptPercents.reduce((a, b) => a + b, 0);
  const isDeptPercentValid = totalDeptPercent === 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeekPercentValid || !isDeptPercentValid || totalGoal <= 0) return;
    setIsSubmitted(true);
    setShowChart(false);
    setTimeout(() => setShowChart(true), 200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setShowChart(false);
    setTotalGoal(0);
    setWeekPercents([...DEFAULT_WEEK_PERCENTS]);
    setDeptPercents([...DEFAULT_DEPT_PERCENTS]);
  };

  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <div className="flex items-center gap-3 mb-1">
          <Target className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-extrabold font-heading tracking-tight">Metas da Loja</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          Cadastre as metas mensais, distribua por departamentos e defina os alvos de cada vendedor.
        </p>
      </header>

      <div className="p-8 w-full max-w-[1200px] flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <form onSubmit={handleSubmit}>
          {/* Month + Channel + Total Goal */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold font-heading tracking-tight mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Configuração Global da Meta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold mb-1.5 text-foreground">Mês de Referência</label>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => { setSelectedMonth(e.target.value); setIsSubmitted(false); setShowChart(false); }}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m} {new Date().getFullYear()}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 text-foreground">Canal da Meta</label>
                <div className="relative">
                  <select
                    value={canal}
                    onChange={(e) => setCanal(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none"
                  >
                    <option>Loja Fisica</option>
                    <option>Consolidado Global</option>
                    <option>E-commerce (Tray)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 text-foreground">Meta Total do Mês</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-muted-foreground font-bold">R$</span>
                  <input
                    type="number"
                    placeholder="150.000"
                    min="0"
                    value={totalGoal || ""}
                    onChange={(e) => { setTotalGoal(Number(e.target.value)); setIsSubmitted(false); setShowChart(false); }}
                    required
                    className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            {totalGoal > 0 && (
              <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border/50 flex items-center gap-3 animate-in fade-in duration-300">
                <BarChart3 className="w-5 h-5 text-[var(--western-gold)]" />
                <div>
                  <span className="text-xs font-bold uppercase text-muted-foreground">
                    Referência {selectedMonth} {new Date().getFullYear() - 1}:
                  </span>
                  <span className="text-sm font-bold ml-2 text-foreground">{formatCurrency(lastYear.total)}</span>
                </div>
              </div>
            )}
          </div>

          {totalGoal > 0 && (
            <>
              {/* Department breakdown */}
              <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Pesos por Departamento
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDeptPercentValid ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    Total: {totalDeptPercent}% {!isDeptPercentValid && " (deve ser 100%)"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {depts.map((d, i) => (
                    <div key={i} className="p-4 bg-muted/20 border border-border/60 rounded-xl hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-foreground truncate">{d.name}</span>
                        <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border/50">
                          {d.percent}%
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Peso na Loja</label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={deptPercents[i]}
                          onChange={(e) => {
                            const next = [...deptPercents];
                            next[i] = Number(e.target.value);
                            setDeptPercents(next);
                          }}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Meta do Setor</label>
                        <div className="text-sm font-mono font-bold text-primary bg-background border border-border rounded-lg px-3 py-1.5 overflow-hidden text-ellipsis">
                          {formatCurrency(d.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly breakdown */}
              {/* Keeping weekly breakdown collapsed visually or minimalist since focus is on departments/sellers */}
              <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
                    <Percent className="w-5 h-5 text-muted-foreground" />
                    Distribuição Gráfica Semanal (Opcional)
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${isWeekPercentValid ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    Total: {totalWeekPercent}%
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70 hover:opacity-100 transition-opacity">
                  {weeks.map((week, i) => (
                    <div key={i} className="flex gap-2 items-center">
                       <span className="text-xs font-bold w-16">{week.label}</span>
                       <input 
                         type="number" min="0" max="100" 
                         value={weekPercents[i]} 
                         onChange={(e) => {
                            const next = [...weekPercents];
                            next[i] = Number(e.target.value);
                            setWeekPercents(next);
                         }}
                         className="flex-1 w-full px-2 py-1 text-xs bg-background border border-border rounded"
                       />
                       <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={!isWeekPercentValid || !isDeptPercentValid || totalGoal <= 0}
                  className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  <Target className="w-5 h-5" />
                  Calcular Metas e Distribuir Equipe
                </button>

                {isSubmitted && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
                  >
                    Resetar Planejamento
                  </button>
                )}
              </div>
            </>
          )}
        </form>

        {/* ═══ Distributed Goals (shown after submit) ═══ */}
        {isSubmitted && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Dept/Seller Allocation Area */}
            <div className={`bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-700 ${showChart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="p-6 border-b border-border bg-muted/10">
                <h3 className="text-xl font-bold font-heading tracking-tight flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Meta Individual dos Vendedores
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Valores calculados automaticamente pelo peso de cada departamento e divididos entre os vendedores cadastrados no setor.</p>
              </div>

              <div className="p-6">
                {depts.map((d, i) => (
                  <div key={i} className="mb-8 last:mb-0">
                    <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-2">
                      <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-primary/20 ring-2 ring-primary"></span>
                         <h4 className="font-bold text-lg">{d.name}</h4>
                         <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded-md ml-2 border border-border">{d.percent}%</span>
                      </div>
                      <span className="font-bold text-foreground text-lg">{formatCurrency(d.value)}</span>
                    </div>

                    {d.sellers.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-border/80 bg-background text-center text-sm text-muted-foreground">
                        Nenhum vendedor cadastrado neste departamento. Vá em <span className="font-bold text-foreground">Vendedores</span> para adicionar.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {d.sellers.map(s => (
                          <div key={s.id} className="p-4 bg-background border border-border/80 rounded-xl shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                              <img 
                                src={s.foto || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + s.nome} 
                                alt={s.nome} 
                                className="w-12 h-12 rounded-full border border-border/50 bg-muted object-cover" 
                              />
                              <div>
                                <p className="font-bold text-sm truncate">{s.nome}</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Meta Sugerida</p>
                              </div>
                            </div>
                            <div className="mt-auto relative">
                              <span className="absolute left-3 top-2 text-muted-foreground text-xs font-bold">R$</span>
                              <input 
                                type="number" 
                                defaultValue={Math.round(d.sellerValue)}
                                className="w-full pl-9 pr-3 py-2 text-lg font-mono font-bold bg-muted/20 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="mt-6 pt-6 border-t border-border flex justify-end">
                   <button onClick={() => alert("Metas individuais salvas no ERP!")} className="bg-foreground text-background font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity">
                     Salvar Metas Individuais
                   </button>
                </div>
              </div>
            </div>

            {/* Growth percentage card */}
            <GrowthAnimation growthPercent={growthPercent} isVisible={showChart} />

            {/* Weekly comparison chart */}
            <div className={`bg-card border border-border rounded-2xl shadow-sm p-6 transition-all duration-700 delay-300 ${showChart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <h3 className="text-lg font-bold font-heading tracking-tight mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Comparativo Semanal projetado: Meta vs Ano Anterior
              </h3>
              <WeekComparisonChart currentWeeks={weeks} lastYearWeeks={lastYear.weeks} />
            </div>

            {/* Monthly overview */}
            <div className={`bg-card border border-border rounded-2xl shadow-sm p-6 transition-all duration-700 delay-500 ${showChart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <h3 className="text-lg font-bold font-heading tracking-tight mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--western-gold)]" />
                Panorama Anual - Faturamento {new Date().getFullYear() - 1}
              </h3>
              <MonthlyTrendChart selectedMonth={selectedMonth} totalGoal={totalGoal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
