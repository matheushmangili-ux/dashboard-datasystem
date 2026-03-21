import { getIntegrationReadiness } from "@/lib/erp/service";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getIntegrationReadiness());
}
