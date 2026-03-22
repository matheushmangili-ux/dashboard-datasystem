import { AccessShell } from "@/components/access-shell";
import { getSessionUser } from "@/app/actions/auth";
import { getIntegrationReadiness, loadDashboardSnapshot } from "@/lib/erp/service";
import { loadSpreadsheetData } from "@/lib/spreadsheet/parse-metas";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [snapshot, readiness, user, metasData] = await Promise.all([
    loadDashboardSnapshot(),
    Promise.resolve(getIntegrationReadiness()),
    getSessionUser(),
    loadSpreadsheetData()
  ]);

  return <AccessShell initialSnapshot={snapshot} readiness={readiness} initialUser={user} metasData={metasData} />;
}
