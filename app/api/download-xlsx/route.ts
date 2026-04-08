import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { supabase } from "@/lib/supabase/client";
import { getFaixaComissao, SEMANAS } from "@/lib/supabase/types";
import type { Database } from "@/lib/supabase/types";

type MetaRow   = Database["public"]["Tables"]["metas_mensais"]["Row"];
type DiarioRow = Database["public"]["Tables"]["relatorio_diario"]["Row"];

export const dynamic = "force-dynamic";

const moneyFmt = '"R$ "#,##0.00;("R$ "#,##0.00);"-"';
const pctFmt   = "0.0%";

function solidFill(hex: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: hex } };
}

function col(n: number): string {
  let r = "";
  while (n > 0) { n--; r = String.fromCharCode(65 + (n % 26)) + r; n = Math.floor(n / 26); }
  return r;
}

export async function GET() {
  try {
    // Buscar todos os dados com type assertions explícitas para evitar inferência 'never'
    const metasRes  = await supabase.from("metas_mensais").select("*");
    const diarioRes = await supabase.from("relatorio_diario").select("*").order("data", { ascending: true });

    const metas  = (metasRes.data  ?? []) as MetaRow[];
    const diario = (diarioRes.data ?? []) as DiarioRow[];

    const wb = new ExcelJS.Workbook();
    wb.creator = "Texas Center Dashboard";
    wb.created = new Date();

    const metaMap = Object.fromEntries(metas.map((m) => [m.vendedor, m]));

    const VENDEDORES_ORDER = [
      "João Victor", "Agnaldo", "Fernando Rezende", "Luiz Alberto",
      "Manoel", "Michele", "Karoline", "Kauê", "Júlio César",
      "Alexandre", "Fernando", "Ledson",
    ];

    // Para cada semana, agrupar dados por vendedor + dia
    for (const [semName, semInfo] of Object.entries(SEMANAS)) {
      const ws = wb.addWorksheet(semName);
      ws.properties.tabColor = { argb: semName === "S1" ? "FFE26B0A" : semName === "S2" ? "FF375623" : semName === "S3" ? "FF7030A0" : "FFC00000" };

      const dias = semInfo.dias as readonly number[];
      const lastCol = 6 + dias.length + 4; // A-F + days + Total+%+Faixa+Com

      // Row 1 title
      ws.mergeCells(1, 1, 1, lastCol);
      const t = ws.getRow(1).getCell(1);
      t.value = `TEXAS CENTER · RESULTADO ${semName} · ${semInfo.label}`;
      t.font = { name: "Arial", bold: true, size: 12, color: { argb: "FFFFFFFF" } };
      t.fill = solidFill("FF1F3864");
      t.alignment = { horizontal: "center", vertical: "middle" };
      ws.getRow(1).height = 28;

      // Row 2 headers
      ws.getRow(2).height = 32;
      const hdrs: [number, string, string][] = [
        [1, "VENDEDOR", "FF1F3864"],
        [2, "DEPT", "FF1F3864"],
        [3, "META BRONZE", "FF1F3864"],
        [4, "META PRATA", "FF1F3864"],
        [5, "META OURO", "FF1F3864"],
        [6, "META DIAMANTE", "FF1F3864"],
      ];
      for (const [c, lbl, bg] of hdrs) {
        const cell = ws.getRow(2).getCell(c);
        cell.value = lbl;
        cell.fill = solidFill(bg);
        cell.font = { name: "Arial", bold: true, size: 9, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      }
      for (let di = 0; di < dias.length; di++) {
        const c = ws.getRow(2).getCell(7 + di);
        c.value = `${String(dias[di]).padStart(2, "0")}/abr`;
        c.fill = solidFill("FFE65100");
        c.font = { name: "Arial", bold: true, size: 9, color: { argb: "FFFFFFFF" } };
        c.alignment = { horizontal: "center", vertical: "middle" };
      }
      const calcHdrs = ["TOTAL VENDIDO", "% META", "FAIXA COMISSÃO", "COMISSÃO R$"];
      for (let ci = 0; ci < calcHdrs.length; ci++) {
        const c = ws.getRow(2).getCell(7 + dias.length + ci);
        c.value = calcHdrs[ci];
        c.fill = solidFill("FF1B5E20");
        c.font = { name: "Arial", bold: true, size: 9, color: { argb: "FFFFFFFF" } };
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      }

      // Col widths
      ws.getColumn(1).width = 20;
      ws.getColumn(2).width = 13;
      for (let c = 3; c <= 6; c++) ws.getColumn(c).width = 14;
      for (let di = 0; di < dias.length; di++) ws.getColumn(7 + di).width = 12;
      ws.getColumn(7 + dias.length).width = 15;
      ws.getColumn(8 + dias.length).width = 10;
      ws.getColumn(9 + dias.length).width = 18;
      ws.getColumn(10 + dias.length).width = 14;

      // Data rows
      for (let vi = 0; vi < VENDEDORES_ORDER.length; vi++) {
        const nome = VENDEDORES_ORDER[vi];
        const m = metaMap[nome];
        if (!m) continue;
        const row = ws.getRow(3 + vi);
        row.height = 20;
        const bg = vi % 2 === 0 ? "FFF2F2F2" : "FFFFFFFF";

        row.getCell(1).value = nome;
        row.getCell(1).fill = solidFill(bg);
        row.getCell(1).font = { name: "Arial", bold: true, size: 10 };
        row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

        const deptColor = m.departamento === "Chapelaria" ? "FF9C6B3C" : m.departamento === "Selaria" ? "FF2F5597" : "FFBF8F00";
        row.getCell(2).value = m.departamento;
        row.getCell(2).fill = solidFill(deptColor);
        row.getCell(2).font = { name: "Arial", bold: true, size: 8, color: { argb: "FFFFFFFF" } };
        row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };

        for (const [c, val] of [[3, m.meta_bronze],[4, m.meta_prata],[5, m.meta_ouro],[6, m.meta_diamante]] as [number,number][]) {
          const cell = row.getCell(c);
          cell.value = val;
          cell.numFmt = moneyFmt;
          cell.fill = solidFill(bg);
          cell.font = { name: "Arial", size: 9, color: { argb: "FF0000FF" } };
          cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        // Day cells from Supabase
        let totalSem = 0;
        for (let di = 0; di < dias.length; di++) {
          const dataStr = `2026-04-${String(dias[di]).padStart(2, "0")}`;
          const reg = diario.find((d) => d.vendedor === nome && d.data === dataStr);
          const val = reg ? Number(reg.total_vendas) : null;
          const cell = row.getCell(7 + di);
          cell.value = val ?? null;
          if (val !== null) totalSem += val;
          cell.numFmt = moneyFmt;
          cell.fill = solidFill(val !== null ? bg : "FFFFFDE7");
          cell.font = { name: "Arial", size: 10, color: { argb: "FF0000FF" } };
          cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        // Total
        const cTot = row.getCell(7 + dias.length);
        cTot.value = totalSem || null;
        cTot.numFmt = moneyFmt;
        cTot.fill = solidFill(bg);
        cTot.font = { name: "Arial", bold: true, size: 10 };
        cTot.alignment = { horizontal: "right", vertical: "middle" };

        // % meta
        const pct = totalSem > 0 ? totalSem / m.meta_bronze : null;
        const cPct = row.getCell(8 + dias.length);
        cPct.value = pct;
        cPct.numFmt = pctFmt;
        cPct.fill = solidFill(
          !pct ? bg : pct < 0.5 ? "FFFFCCCC" : pct < 0.71 ? "FFFFE0B2" : pct < 0.86 ? "FFFFF9C4" : pct < 1.0 ? "FFC8E6C9" : pct < 1.2 ? "FFA5D6A7" : "FF2E7D32"
        );
        cPct.font = { name: "Arial", bold: true, size: 10, color: { argb: !pct ? "FF000000" : pct >= 1.2 ? "FFFFFFFF" : "FF000000" } };
        cPct.alignment = { horizontal: "center", vertical: "middle" };

        // Faixa
        const faixa = pct ? getFaixaComissao(pct * 100) : null;
        const cFx = row.getCell(9 + dias.length);
        cFx.value = faixa?.label ?? "";
        cFx.fill = solidFill(bg);
        cFx.font = { name: "Arial", size: 8 };
        cFx.alignment = { horizontal: "center", vertical: "middle" };

        // Comissão R$
        const com = faixa && totalSem > 0 ? totalSem * faixa.pct : null;
        const cCom = row.getCell(10 + dias.length);
        cCom.value = com;
        cCom.numFmt = moneyFmt;
        cCom.fill = solidFill(bg);
        cCom.font = { name: "Arial", bold: true, size: 10 };
        cCom.alignment = { horizontal: "right", vertical: "middle" };
      }

      ws.views = [{ state: "frozen", xSplit: 2, ySplit: 2, topLeftCell: "C3" }];
    }

    const buffer = await wb.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Resultado_Abril_2026_${new Date().toISOString().slice(0,10)}.xlsx"`,
      },
    });
  } catch (err) {
    console.error("download-xlsx error:", err);
    return NextResponse.json({ error: "Erro ao gerar planilha." }, { status: 500 });
  }
}
