export type Database = {
  public: {
    Tables: {
      metas_mensais: {
        Row: {
          vendedor: string;
          departamento: string;
          meta_bronze: number;
          meta_prata: number;
          meta_ouro: number;
          meta_diamante: number;
        };
        Insert: {
          vendedor: string;
          departamento: string;
          meta_bronze: number;
          meta_prata: number;
          meta_ouro: number;
          meta_diamante: number;
        };
        Update: {
          vendedor?: string;
          departamento?: string;
          meta_bronze?: number;
          meta_prata?: number;
          meta_ouro?: number;
          meta_diamante?: number;
        };
      };
      relatorio_diario: {
        Row: {
          id: string;
          data: string;
          semana: "S1" | "S2" | "S3" | "S4";
          vendedor: string;
          dias_trabalhados: number;
          num_vendas: number | null;
          itens: number | null;
          pa: number | null;
          trocas: number;
          total_vendas: number;
          ticket_medio: number | null;
          preco_medio: number | null;
          total_vista: number;
          total_prazo: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          data: string;
          semana: "S1" | "S2" | "S3" | "S4";
          vendedor: string;
          dias_trabalhados: number;
          num_vendas?: number | null;
          itens?: number | null;
          pa?: number | null;
          trocas?: number;
          total_vendas: number;
          ticket_medio?: number | null;
          preco_medio?: number | null;
          total_vista?: number;
          total_prazo?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          data?: string;
          semana?: "S1" | "S2" | "S3" | "S4";
          vendedor?: string;
          dias_trabalhados?: number;
          num_vendas?: number | null;
          itens?: number | null;
          pa?: number | null;
          trocas?: number;
          total_vendas?: number;
          ticket_medio?: number | null;
          preco_medio?: number | null;
          total_vista?: number;
          total_prazo?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      resultado_acumulado: {
        Row: {
          vendedor: string;
          departamento: string;
          meta_bronze: number;
          total_vendido: number;
          pct_meta: number;
          total_vendas_qtd: number;
          total_itens: number;
          total_trocas: number;
          ticket_medio_mes: number;
          pa_medio_mes: number;
          total_vista: number;
          total_prazo: number;
        };
      };
    };
  };
};

// ── Tipos de domínio usados pelos componentes ─────────────────────────────────

export interface VendedorResultado {
  vendedor: string;
  departamento: string;
  meta_bronze: number;
  meta_prata: number;
  meta_ouro: number;
  meta_diamante: number;
  total_vendido: number;
  pct_meta: number;
  faixa_comissao: string;
  comissao_pct: number;
  comissao_rs: number;
  total_vendas_qtd: number;
  total_itens: number;
  pa_medio_mes: number;
  ticket_medio_mes: number;
  total_trocas: number;
  total_vista: number;
  total_prazo: number;
  dias_por_semana: Record<string, number[]>;
}

export interface RelatorioDiario {
  data: string;
  semana: "S1" | "S2" | "S3" | "S4";
  vendedor: string;
  num_vendas: number;
  itens: number;
  pa: number;
  trocas: number;
  total_vendas: number;
  ticket_medio: number;
  preco_medio: number;
  total_vista: number;
  total_prazo: number;
}

// Semanas fixas de Abril 2026
export const SEMANAS = {
  S1: { label: "01–11/abr", dias: [1, 2, 6, 7, 8, 9, 10, 11], peso: 0.30 },
  S2: { label: "13–18/abr", dias: [13, 14, 15, 16, 17, 18],   peso: 0.23 },
  S3: { label: "20–25/abr", dias: [20, 21, 22, 23, 24, 25],   peso: 0.28 },
  S4: { label: "27–30/abr", dias: [27, 28, 29, 30],           peso: 0.19 },
} as const;

export function getSemana(dia: number): "S1" | "S2" | "S3" | "S4" | null {
  for (const [key, val] of Object.entries(SEMANAS)) {
    if ((val.dias as readonly number[]).includes(dia))
      return key as "S1" | "S2" | "S3" | "S4";
  }
  return null;
}

export function getFaixaComissao(pct: number): { label: string; pct: number } {
  if (pct < 50)  return { label: "0–50% · 0,5%",    pct: 0.005 };
  if (pct < 71)  return { label: "51–70% · 1,0%",   pct: 0.010 };
  if (pct < 86)  return { label: "71–85% · 1,5%",   pct: 0.015 };
  if (pct < 100) return { label: "86–99% · 2,0%",   pct: 0.020 };
  if (pct < 120) return { label: "100–119% · 2,5%", pct: 0.025 };
  return           { label: "120%+ · 3,0%",          pct: 0.030 };
}
