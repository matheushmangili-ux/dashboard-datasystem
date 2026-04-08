"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, TrendingUp, Download, RefreshCw, Award, ShoppingBag,
  Layers, ArrowUpDown, Users, Repeat2, CreditCard, Banknote, AlertCircle
} from "lucide-react";
import { UploadReport } from "@/components/upload-report";
import type { VendedorResultado } from "@/lib/supabase/types";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt  = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
const fmtN = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const pct  = (v: number) => `${v.toFixed(1)}%`;

function PctBar({ value }: { value: number }) {
  const capped = Math.min(value, 120);
  const color  =
    value < 50  ? "bg-red-500"
    : value < 71  ? "bg-orange-400"
    : value < 86  ? "bg-yellow-400"
    : value < 100 ? "bg-emerald-400"
    : value < 120 ? "bg-green-500"
    : "bg-[var(--western-gold)]";
  return (
    <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${(capped / 120) * 100}%` }} />
    </div>
  );
}

function FaixaBadge({ label }: { label: string }) {
  const color =
    label.startsWith("0–50")    ? "bg-red-500/15 text-red-400 border-red-500/30"
    : label.startsWith("51–70") ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
    : label.startsWith("71–85") ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
    : label.startsWith("86–99") ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    : label.startsWith("100")   ? "bg-green-500/15 text-green-400 border-green-500/30"
    : "bg-[var(--western-gold)]/15 text-[var(--western-gold)] border-[var(--western-gold)]/30";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color} whitespace-nowrap`}>
      {label}
    </span>
  );
}

const DEPT_COLOR: Record<string, string> = {
  Chapelaria: "border-l-[#9C6B3C]",
  Selaria:    "border-l-[#2F5597]",
  Vestuário:  "border-l-[#BF8F00]",
};

type SortKey = "pct_meta" | "total_vendido" | "comissao_rs" | "ticket_medio_mes" | "pa_medio_mes";

// ── main component ────────────────────────────────────────────────────────────
export function ResultadosView() {
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [data,       setData]       = useState<VendedorResultado[]>([]);
  const [sortKey,    setSortKey]    = useState<SortKey>("pct_meta");
  const [sortDesc,   setSortDesc]   = useState(true);
  const [filterDept, setFilterDept] = useState<string>("Todos");
  const [showUpload, setShowUpload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/resultados");
      if (!res.ok) throw new Error("Erro ao buscar dados");
      const json = await res.json();
      setData(json.resultado ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/download-xlsx");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `Resultado_Abril_2026_${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const sorted = [...data]
    .filter((v) => filterDept === "Todos" || v.departamento === filterDept)
    .sort((a, b) => {
      const av = a[sortKey] as number, bv = b[sortKey] as number;
      return sortDesc ? bv - av : av - bv;
    });

  const total_loja      = data.reduce((s, v) => s + v.total_vendido, 0);
  const total_meta      = data.reduce((s, v) => s + v.meta_bronze,   0);
  const total_comissao  = data.reduce((s, v) => s + v.comissao_rs,   0);
  const pct_loja        = total_meta > 0 ? (total_loja / total_meta) * 100 : 0;

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc((d) => !d);
    else { setSortKey(key); setSortDesc(true); }
  }

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${sortKey === k ? "text-[var(--western-gold)]" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      {/* Header */}
      <header className="px-6 py-6 border-b border-border/50 bg-card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--western-gold)]/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-[var(--western-gold)]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold font-heading tracking-tight">
                Resultados <span className="text-[var(--western-gold)]">Abril 2026</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Vendas acumuladas · metas · comissões · indicadores por vendedor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowUpload((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--western-gold)]/15 border border-[var(--western-gold)]/30 text-[var(--western-gold)] hover:bg-[var(--western-gold)]/25 transition-colors text-sm font-bold"
            >
              <TrendingUp className="w-4 h-4" />
              Importar Relatório
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors text-sm font-bold disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Gerando..." : "Baixar xlsx"}
            </button>
            <button
              onClick={fetchData}
              className="p-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Atualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 flex-1">
        {/* Upload panel */}
        {showUpload && (
          <div className="rounded-2xl border border-[var(--western-gold)]/30 bg-card p-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <h2 className="text-sm font-bold font-heading mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--western-gold)]" />
              Importar Relatorio_PedidosPA
            </h2>
            <UploadReport onSuccess={() => { setShowUpload(false); fetchData(); }} />
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BarChart3,   label: "Acumulado Loja",   value: fmt(total_loja),     sub: `de ${fmt(total_meta)} (meta)`, color: "text-blue-400" },
            { icon: TrendingUp,  label: "% Meta Bronze",     value: pct(pct_loja),       sub: "atingimento geral",           color: pct_loja >= 100 ? "text-green-400" : pct_loja >= 70 ? "text-yellow-400" : "text-red-400" },
            { icon: Award,       label: "Comissão Estimada", value: fmt(total_comissao), sub: "total da equipe",             color: "text-[var(--western-gold)]" },
            { icon: Users,       label: "Vendedores",        value: String(data.length), sub: "no período",                  color: "text-purple-400" },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
              </div>
              <p className={`text-xl font-black font-heading ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Filters + sort bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {["Todos", "Chapelaria", "Selaria", "Vestuário"].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDept(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  filterDept === d
                    ? "bg-[var(--western-gold)]/20 border-[var(--western-gold)]/50 text-[var(--western-gold)]"
                    : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <SortBtn k="pct_meta"        label="% Meta"   />
            <SortBtn k="total_vendido"   label="Vendas"   />
            <SortBtn k="comissao_rs"     label="Comissão" />
            <SortBtn k="ticket_medio_mes" label="Ticket"  />
            <SortBtn k="pa_medio_mes"    label="P.A."     />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Carregando resultados...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-muted/40">
              <TrendingUp className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-bold font-heading text-lg">Nenhum dado importado ainda</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique em <strong>Importar Relatório</strong> e envie o .xls do dia.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((v, idx) => (
              <div
                key={v.vendedor}
                className={`bg-card rounded-2xl border border-border/50 border-l-4 ${DEPT_COLOR[v.departamento] ?? ""} overflow-hidden hover:border-[var(--western-gold)]/30 transition-colors`}
              >
                {/* Top row */}
                <div className="px-5 py-4 flex items-center gap-4 flex-wrap">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--western-gold)]/15 text-[var(--western-gold)] font-black text-sm shrink-0">
                    {idx + 1}
                  </div>

                  {/* Name + dept */}
                  <div className="flex-1 min-w-[140px]">
                    <p className="font-bold font-heading text-sm leading-tight">{v.vendedor}</p>
                    <p className="text-xs text-muted-foreground">{v.departamento}</p>
                  </div>

                  {/* % Meta + bar */}
                  <div className="w-28 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">% Meta</span>
                      <span className={`text-sm font-black ${
                        v.pct_meta < 50 ? "text-red-400" : v.pct_meta < 86 ? "text-yellow-400" : v.pct_meta >= 100 ? "text-green-400" : "text-emerald-400"
                      }`}>
                        {pct(v.pct_meta)}
                      </span>
                    </div>
                    <PctBar value={v.pct_meta} />
                  </div>

                  {/* Faixa */}
                  <div className="shrink-0">
                    <FaixaBadge label={v.faixa_comissao} />
                  </div>

                  {/* Vendido vs meta */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black font-heading">{fmt(v.total_vendido)}</p>
                    <p className="text-xs text-muted-foreground">de {fmt(v.meta_bronze)}</p>
                  </div>

                  {/* Comissão */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Comissão</p>
                    <p className="text-sm font-bold text-[var(--western-gold)]">{fmt(v.comissao_rs)}</p>
                    <p className="text-[10px] text-muted-foreground">{v.comissao_pct.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Bottom row — indicadores */}
                <div className="px-5 py-3 bg-muted/20 border-t border-border/30 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { icon: ShoppingBag, label: "Vendas",    value: String(v.total_vendas_qtd) },
                    { icon: Layers,      label: "Itens",     value: String(v.total_itens) },
                    { icon: BarChart3,   label: "P.A.",      value: fmtN(v.pa_medio_mes) },
                    { icon: CreditCard, label: "Ticket",    value: fmt(v.ticket_medio_mes) },
                    { icon: Repeat2,     label: "Trocas",    value: String(v.total_trocas) },
                    { icon: Banknote,    label: "À Vista",   value: pct(v.total_vendido > 0 ? (v.total_vista / v.total_vendido) * 100 : 0) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
                        <p className="text-xs font-bold mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
