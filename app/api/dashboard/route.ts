import { loadDashboardSnapshot } from "@/lib/erp/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await loadDashboardSnapshot();
  return Response.json(snapshot);
}
