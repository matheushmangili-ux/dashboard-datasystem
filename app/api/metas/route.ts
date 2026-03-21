import { NextResponse } from "next/server";
import { loadSpreadsheetData } from "@/lib/spreadsheet/parse-metas";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadSpreadsheetData();
  return NextResponse.json(data);
}
