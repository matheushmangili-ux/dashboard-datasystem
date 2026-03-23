"use client";

import { useState, useEffect, useMemo } from "react";
import { SidebarView } from "./sidebar";
import {
  PlusCircle, Target, Users, Trash2, Calendar, ChevronDown,
  Percent, Building2, BarChart3, Sparkles,
} from "lucide-react";

export type Seller = {
  id: string;
  nome: string;
  email: string;
  nascimento: string;
  admissao: string;
  cpf: string;
  telefone: string;
  foto: string;
  departamento: string;
  canal: string;
  status: string;
};

const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DEPARTMENTS = ["Vestuário", "Chapelaria", "Selaria", "Calçados", "Geral / Outros"];
const DEFAULT_DEPT_PERCENTS = [40, 20, 15, 15, 10];
const DEFAULT_WEEK_PERCENTS = [22, 25, 28, 25];

const LAST_YEAR_MONTHLY: Record<string, { total: number; weeks: number[] }> = {
  "Janeiro": { total: 120000, weeks: [28000, 30000, 32000, 30000] },
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function CadastrosView({ onNavigate }: { onNavigate: (view: SidebarView) => void }) {
  const [activeTab, setActiveTab] = useState<"vendedores" | "metas">("vendedores");
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Seller form
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [admissao, setAdmissao] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState("");
  const [departamento, setDepartamento] = useState("Vestuário");
  const [canal, setCanal] = useState("Loja Física Principal (Data System)");
  const [status, setStatus] = useState("Ativo - Em Loja");

  // Goal config state
  const currentMonth = MONTHS[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [totalGoal, setTotalGoal] = useState<number>(0);
  const [canalMeta, setCanalMeta] = useState<string>("Loja Fisica");
  const [weekPercents, setWeekPercents] = useState<number[]>([...DEFAULT_WEEK_PERCENTS]);
  const [deptPercents, setDeptPercents] = useState<number[]>([...DEFAULT_DEPT_PERCENTS]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tc_sellers");
    if (stored) {
      try {
        setSellers(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const saveSellers = (newSellers: Seller[]) => {
    setSellers(newSellers);
    localStorage.setItem("tc_sellers", JSON.stringify(newSellers));
  };

  const handleCreateSeller = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeller: Seller = {
      id: Math.random().toString(36).substr(2, 9),
      nome, email, nascimento, admissao, cpf, telefone, foto, departamento, canal, status
    };
    saveSellers([...sellers, newSeller]);
    setNome(""); setEmail(""); setNascimento(""); setAdmissao("");
    setCpf(""); setTelefone(""); setFoto("");
    alert("Vendedor cadastrado com sucesso!");
  };

  const handleDelete = (id: string) => {
    saveSellers(sellers.filter(s => s.id !== id));
  };

  /* ── Meta computed values ── */
  const lastYear = LAST_YEAR_MONTHLY[selectedMonth] || { total: 0, weeks: [0, 0, 0, 0] };
  const totalWeekPercent = weekPercents.reduce((a, b) => a + b, 0);
  const isWeekPercentValid = totalWeekPercent === 100;
  const totalDeptPercent = deptPercents.reduce((a, b) => a + b, 0);
  const isDeptPercentValid = totalDeptPercent === 100;

  const depts = useMemo(() => {
    return DEPARTMENTS.map((name, i) => {
      const pct = deptPercents[i] || 0;
      const value = Math.round((totalGoal * pct) / 100);
      const deptSellers = sellers.filter(s => s.departamento === name);
      const sellerValue = deptSellers.length > 0 ? value / deptSellers.length : 0;
      return { name, percent: pct, value, sellers: deptSellers, sellerValue };
    });
  }, [totalGoal, deptPercents, sellers]);

  const growthPercent = useMemo(() => {
    if (!lastYear.total || !totalGoal) return 0;
    return ((totalGoal - lastYear.total) / lastYear.total) * 100;
  }, [totalGoal, lastYear.total]);

  const handleMetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeekPercentValid || !isDeptPercentValid || totalGoal <= 0) return;
    setIsSubmitted(true);
  };

  const handleMetaReset = () => {
    setIsSubmitted(false);
    setTotalGoal(0);
    setWeekPercents([...DEFAULT_WEEK_PERCENTS]);
    setDeptPercents([...DEFAULT_DEPT_PERCENTS]);
  };

  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <h1 className="text-3xl font-extrabold font-heading tracking-tight">Central de Cadastros</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Gerencie sua equipe de vendas e configure as metas operacionais do varejo.</p>
      </header>

      <div className="p-8 w-full max-w-[1200px]">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-muted/40 p-1.5 rounded-xl w-fit border border-border/50">
          <button
            onClick={() => setActiveTab("vendedores")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              activeTab === "vendedores"
                ? "bg-background shadow-md text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="w-4 h-4" /> Vendedores
          </button>
          <button
            onClick={() => setActiveTab("metas")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              activeTab === "metas"
                ? "bg-background shadow-md text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Target className="w-4 h-4" /> Configuração de Metas
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* ═══════════ TAB: VENDEDORES ═══════════ */}
          {activeTab === "vendedores" && (
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              {/* Form */}
              <div className="bg-card border border-border rounded-2xl shadow-sm p-8 flex-1 w-full max-w-[800px]">
                <h2 className="text-xl font-bold mb-6 font-heading tracking-tight">Novo Vendedor</h2>
                <form className="space-y-5" onSubmit={handleCreateSeller}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Nome Completo</label>
                      <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Ana Ribeiro" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder-muted-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">E-mail</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ana@exemplo.com" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Telefone / WhatsApp</label>
                      <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">CPF</label>
                      <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Data de Nascimento</label>
                      <input type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all cursor-text tracking-wide" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Data de Admissão</label>
                      <input type="date" value={admissao} onChange={e => setAdmissao(e.target.value)} required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all cursor-text tracking-wide" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">URL da Foto</label>
                      <input type="url" value={foto} onChange={e => setFoto(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Departamento (Peso)</label>
                      <select value={departamento} onChange={e => setDepartamento(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                        <option>Vestuário</option>
                        <option>Chapelaria</option>
                        <option>Selaria</option>
                        <option>Calçados</option>
                        <option>Geral / Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Canal Comercial / Equipe</label>
                      <select value={canal} onChange={e => setCanal(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                        <option>Loja Física Principal (Data System)</option>
                        <option>E-commerce (Tray)</option>
                        <option>Venda Corporativa / B2B</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Status do Colaborador</label>
                      <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                        <option>Ativo - Em Loja</option>
                        <option>Afastado</option>
                        <option>Desligado</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md w-full md:w-auto">
                      <PlusCircle className="w-5 h-5" /> Cadastrar Vendedor
                    </button>
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="bg-card border border-border rounded-2xl shadow-sm p-6 w-full xl:w-[400px]">
                <h3 className="text-lg font-bold font-heading mb-4 border-b border-border/50 pb-2">Vendedores Cadastrados ({sellers.length})</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {sellers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhum vendedor cadastrado ainda.</p>
                  ) : (
                    sellers.map(s => (
                      <div key={s.id} className="p-3 bg-muted/20 border border-border/50 rounded-xl flex items-center gap-3 relative group">
                        <img
                          src={s.foto || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + s.nome}
                          alt={s.nome}
                          className="w-10 h-10 rounded-full bg-background border border-border object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{s.nome}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold truncate">{s.departamento} &bull; {s.canal.split(' ')[0]}</p>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg absolute right-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TAB: CONFIGURAÇÃO DE METAS ═══════════ */}
          {activeTab === "metas" && (
            <div className="space-y-6 max-w-[1000px]">
              <form onSubmit={handleMetaSubmit}>
                {/* Global Config */}
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
                          onChange={(e) => { setSelectedMonth(e.target.value); setIsSubmitted(false); }}
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
                          value={canalMeta}
                          onChange={(e) => setCanalMeta(e.target.value)}
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
                          onChange={(e) => { setTotalGoal(Number(e.target.value)); setIsSubmitted(false); }}
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
                        {growthPercent !== 0 && (
                          <span className={`ml-3 text-xs font-bold ${growthPercent > 0 ? "text-success" : "text-destructive"}`}>
                            {growthPercent > 0 ? "+" : ""}{growthPercent.toFixed(1)}%
                          </span>
                        )}
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
                    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
                          <Percent className="w-5 h-5 text-muted-foreground" />
                          Distribuição Semanal
                        </h2>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isWeekPercentValid ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                          Total: {totalWeekPercent}%
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {weekPercents.map((pct, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <span className="text-xs font-bold w-20">Semana {i + 1}</span>
                            <input
                              type="number" min="0" max="100"
                              value={pct}
                              onChange={(e) => {
                                const next = [...weekPercents];
                                next[i] = Number(e.target.value);
                                setWeekPercents(next);
                              }}
                              className="flex-1 w-full px-2 py-1, text-xs bg-background border border-border rounded"
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
                      <button
                        type="submit"
                        disabled={!isWeekPercentValid || !isDeptPercentValid || totalGoal <= 0}
                        className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto"
                      >
                        <Target className="w-5 h-5" />
                        Salvar Configuração de Metas
                      </button>

                      {isSubmitted && (
                        <button
                          type="button"
                          onClick={handleMetaReset}
                          className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
                        >
                          Resetar Planejamento
                        </button>
                      )}
                    </div>
                  </>
                )}
              </form>

              {/* Success message */}
              {isSubmitted && (
                <div className="bg-success/10 border border-success/30 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-success" />
                    <h3 className="text-lg font-bold font-heading text-success">Metas Configuradas com Sucesso!</h3>
                  </div>
                  <p className="text-sm text-foreground/80 mb-4">
                    A meta de <b>{formatCurrency(totalGoal)}</b> para <b>{selectedMonth}</b> foi configurada.
                    Os departamentos foram distribuídos com os pesos definidos.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {depts.filter(d => d.value > 0).map((d, i) => (
                      <div key={i} className="p-3 bg-background/50 rounded-xl border border-border/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase">{d.name}</p>
                        <p className="text-sm font-mono font-bold text-foreground mt-1">{formatCurrency(d.value)}</p>
                        <p className="text-[10px] text-muted-foreground">{d.sellers.length} vendedor(es) • {formatCurrency(d.sellerValue)}/cada</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 font-medium">
                    Visualize o atingimento em tempo real no painel de <b>Metas</b> no menu principal.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
