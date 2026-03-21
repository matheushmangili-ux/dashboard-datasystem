import { loadTraySalesChannel } from "@/lib/tray/service";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await loadTraySalesChannel());
}
