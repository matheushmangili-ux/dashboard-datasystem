import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";
import { getSemana } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

// ── Mapeamento nome do relatório → nome na planilha ──────────────────────────
const NAME_MAP: { keywords: string[]; target: string }[] = [
  { keywords: ["JOAO VICTOR", "JOAO VIC"],             target: "João Victor"      },
  { keywords: ["AGNALDO"],                              target: "Agnaldo"          },
  { keywords: ["FERNANDO REZENDE"],                     target: "Fernando Rezende" },
  { keywords: ["LUIZ ALBERTO"],                         target: "Luiz Alberto"     },
  { keywords: ["MANOEL VICTOR", "MANOEL"],              target: "Manoel"           },
  { keywords: ["MICHELE ALVES", "MICHELE"],             target: "Michele"          },
  { keywords: ["KAROLINE"],                             target: "Karoline"         },
  { keywords: ["KAUE", "KAUÊ"],                         target: "Kauê"             },
  { keywords: ["JULIO CESAR", "JÚLIO CESAR"],           target: "Júlio César"      },
  { keywords: ["ALEXANDRE LEITE", "ALEXANDRE"],         target: "Alexandre"        },
  { keywords: ["LUIZ FERNANDO", "FERNANDO PEREIRA"],   target: "Fernando"         },
  { keywords: ["LEDSON"],                               target: "Ledson"           },
];

function normalize(s: string) {
  return String(s).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function mapVendor(nomeRelatorio: string): string | null {
  const norm = normalize(nomeRelatorio).replace(/^\d+-\d+\s+/, "");
  for (const { keywords, target } of NAME_MAP) {
    if (keywords.some((k) => norm.includes(k))) return target;
  }
  return null;
}

function parseDate(headerValue: unknown): { day: number; month: number; year: number } | null {
  const m = String(headerValue ?? "").match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  return { day: parseInt(m[1]), month: parseInt(m[2]), year: parseInt(m[3]) };
}

function normalizeValue(raw: unknown): number | null {
  const v = parseFloat(String(raw).replace(",", "."));
  if (isNaN(v) || v <= 0) return null;
  // Inteiros >= 1000 têm o decimal perdido na geração do XLS — dividir por 100
  return Number.isInteger(v) && v >= 1000 ? v / 100 : v * 1000;
}

// ── POST /api/upload-report ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }
    if (!file.name.match(/\.(xls|xlsx)$/i)) {
      return NextResponse.json({ error: "Formato inválido. Envie um arquivo .xls ou .xlsx." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });

    // Data está na Sheet1, dados na Sheet2
    const sheet1 = wb.Sheets[wb.SheetNames[0]];
    const sheet2 = wb.Sheets[wb.SheetNames[1]];
    const rows1 = XLSX.utils.sheet_to_json<unknown[]>(sheet1, { header: 1, defval: "" });
    const rows2 = XLSX.utils.sheet_to_json<unknown[]>(sheet2, { header: 1, defval: "" });

    const dateInfo = parseDate(rows1[0]?.[0]);
    if (!dateInfo) {
      return NextResponse.json({ error: "Não foi possível identificar a data no cabeçalho." }, { status: 422 });
    }

    const { day, month, year } = dateInfo;
    if (month !== 4 || year !== 2026) {
      return NextResponse.json(
        { error: `Data do relatório: ${day}/${month}/${year}. Esta planilha é de Abril/2026.` },
        { status: 422 }
      );
    }

    const semana = getSemana(day);
    if (!semana) {
      return NextResponse.json(
        { error: `Dia ${day}/04 não pertence a nenhuma semana útil (verifique feriados/domingos).` },
        { status: 422 }
      );
    }

    const dataISO = `2026-04-${String(day).padStart(2, "0")}`;

    // Índices das colunas (0-based): Sheet2 header row (index 1)
    // [Vendedor, Dias, Vendas, %, Itens, %, PA, Trocas, Total Vendas, %, Ticket, Preço, Vista, %, Prazo, %]
    const COL = { NOME: 0, DIAS: 1, VENDAS: 2, ITENS: 4, PA: 6, TROCAS: 7,
                  TOTAL: 8, TICKET: 10, PRECO: 11, VISTA: 12, PRAZO: 14 };

    const records: {
      data: string; semana: "S1"|"S2"|"S3"|"S4"; vendedor: string;
      dias_trabalhados: number; num_vendas: number; itens: number; pa: number;
      trocas: number; total_vendas: number; ticket_medio: number; preco_medio: number;
      total_vista: number; total_prazo: number;
    }[] = [];

    for (let i = 2; i < rows2.length; i++) {
      const row = rows2[i] as unknown[];
      const nomeRaw = String(row[COL.NOME] ?? "").trim();
      if (!nomeRaw || normalize(nomeRaw).includes("TOTAL")) continue;

      const vendedor = mapVendor(nomeRaw);
      if (!vendedor) continue;

      const total = normalizeValue(row[COL.TOTAL]);
      if (total === null) continue;

      const ticket = normalizeValue(row[COL.TICKET]);
      const preco  = normalizeValue(row[COL.PRECO]);
      const vista  = normalizeValue(row[COL.VISTA]);
      const prazo  = normalizeValue(row[COL.PRAZO]);

      records.push({
        data: dataISO,
        semana,
        vendedor,
        dias_trabalhados: Number(row[COL.DIAS]) || 1,
        num_vendas:  Number(row[COL.VENDAS]) || 0,
        itens:       Number(row[COL.ITENS])  || 0,
        pa:          Number(row[COL.PA])     || 0,
        trocas:      Number(row[COL.TROCAS]) || 0,
        total_vendas: total,
        ticket_medio: ticket ?? 0,
        preco_medio:  preco  ?? 0,
        total_vista:  vista  ?? 0,
        total_prazo:  prazo  ?? 0,
      });
    }

    if (records.length === 0) {
      return NextResponse.json({ error: "Nenhum vendedor reconhecido no relatório." }, { status: 422 });
    }

    // Upsert no Supabase (conflito em data + vendedor → atualiza)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
      .from("relatorio_diario")
      .upsert(records, { onConflict: "data,vendedor" });

    if (dbError) {
      console.error("Supabase upsert error:", dbError);
      return NextResponse.json({ error: "Erro ao salvar no banco: " + dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: dataISO,
      semana,
      registros: records.length,
      vendedores: records.map((r) => ({ vendedor: r.vendedor, total: r.total_vendas })),
    });
  } catch (err) {
    console.error("upload-report error:", err);
    return NextResponse.json({ error: "Erro interno ao processar o arquivo." }, { status: 500 });
  }
}
