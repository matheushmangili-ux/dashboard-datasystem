import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getFaixaComissao } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Busca acumulado (view)
    const { data: acumulado, error: e1 } = await supabase
      .from("resultado_acumulado")
      .select("*")
      .order("total_vendido", { ascending: false });

    if (e1) throw e1;

    // Busca metas (para prata/ouro/diamante)
    const { data: metas, error: e2 } = await supabase
      .from("metas_mensais")
      .select("*");

    if (e2) throw e2;

    // Busca todos os registros diários para exibição de histórico
    const { data: diario, error: e3 } = await supabase
      .from("relatorio_diario")
      .select("*")
      .order("data", { ascending: true });

    if (e3) throw e3;

    const metaMap = Object.fromEntries((metas ?? []).map((m) => [m.vendedor, m]));

    const resultado = (acumulado ?? []).map((a) => {
      const m = metaMap[a.vendedor];
      const pct = Number(a.pct_meta) || 0;
      const faixa = getFaixaComissao(pct);

      return {
        vendedor:        a.vendedor,
        departamento:    a.departamento,
        meta_bronze:     m?.meta_bronze     ?? 0,
        meta_prata:      m?.meta_prata      ?? 0,
        meta_ouro:       m?.meta_ouro       ?? 0,
        meta_diamante:   m?.meta_diamante   ?? 0,
        total_vendido:   Number(a.total_vendido)   || 0,
        pct_meta:        pct,
        faixa_comissao:  faixa.label,
        comissao_pct:    faixa.pct * 100,
        comissao_rs:     (Number(a.total_vendido) || 0) * faixa.pct,
        total_vendas_qtd: Number(a.total_vendas_qtd) || 0,
        total_itens:     Number(a.total_itens)     || 0,
        pa_medio_mes:    Number(a.pa_medio_mes)    || 0,
        ticket_medio_mes: Number(a.ticket_medio_mes) || 0,
        total_trocas:    Number(a.total_trocas)    || 0,
        total_vista:     Number(a.total_vista)     || 0,
        total_prazo:     Number(a.total_prazo)     || 0,
      };
    });

    // Agrupar diário por (vendedor, semana)
    const historico: Record<string, Record<string, Array<{ data: string; total: number }>>> = {};
    for (const d of diario ?? []) {
      if (!historico[d.vendedor]) historico[d.vendedor] = {};
      if (!historico[d.vendedor][d.semana]) historico[d.vendedor][d.semana] = [];
      historico[d.vendedor][d.semana].push({ data: d.data, total: Number(d.total_vendas) });
    }

    // Últimas datas com dados
    const datasComDados = [...new Set((diario ?? []).map((d) => d.data))].sort().slice(-30);

    return NextResponse.json({ resultado, historico, datasComDados });
  } catch (err: unknown) {
    console.error("resultados error:", err);
    return NextResponse.json({ error: "Erro ao buscar resultados." }, { status: 500 });
  }
}
