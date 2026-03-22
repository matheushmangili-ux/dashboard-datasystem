import { AccessShell } from "@/components/access-shell";
import { getSessionUser } from "@/app/actions/auth";
import { getIntegrationReadiness, loadDashboardSnapshot } from "@/lib/erp/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [snapshot, readiness, user] = await Promise.all([
    loadDashboardSnapshot(),
    Promise.resolve(getIntegrationReadiness()),
    getSessionUser()
  ]);

  return <AccessShell initialSnapshot={snapshot} readiness={readiness} initialUser={user} />;
}
