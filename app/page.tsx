import { AccessShell } from "@/components/access-shell";
import { getIntegrationReadiness, loadDashboardSnapshot } from "@/lib/erp/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [snapshot, readiness] = await Promise.all([
    loadDashboardSnapshot(),
    Promise.resolve(getIntegrationReadiness())
  ]);

  return <AccessShell initialSnapshot={snapshot} readiness={readiness} />;
}
