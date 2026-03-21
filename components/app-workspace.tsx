"use client";

import { useMemo, useState } from "react";

import { AdminWorkspace } from "@/components/admin-workspace";
import { RealtimeDashboard } from "@/components/realtime-dashboard";
import { getPermissions } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import type { DashboardSnapshot } from "@/lib/types";

type WorkspaceView = "dashboard" | "admin";

export function AppWorkspace({
  currentUser,
  initialSnapshot,
  onSignOut,
  readiness
}: {
  currentUser: AuthUser;
  initialSnapshot: DashboardSnapshot;
  onSignOut: () => void;
  readiness: IntegrationReadiness;
}) {
  const permissions = useMemo(
    () => getPermissions(currentUser.role),
    [currentUser.role]
  );
  const canAccessAdmin = permissions.canViewConnectorStatus;
  const [view, setView] = useState<WorkspaceView>("dashboard");

  return (
    <div className="workspace-stack">
      <section className="workspace-nav card">
        <div>
          <p className="section-eyebrow">Workspace</p>
          <h2 className="status-value">Painel operacional</h2>
        </div>

        <div className="tab-row">
          <button
            className={`tab-button ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
            type="button"
          >
            Dashboard
          </button>
          {canAccessAdmin ? (
            <button
              className={`tab-button ${view === "admin" ? "active" : ""}`}
              onClick={() => setView("admin")}
              type="button"
            >
              Administração
            </button>
          ) : null}
        </div>
      </section>

      {view === "admin" && canAccessAdmin ? (
        <AdminWorkspace currentUser={currentUser} readiness={readiness} />
      ) : (
        <RealtimeDashboard
          currentUser={currentUser}
          initialSnapshot={initialSnapshot}
          onSignOut={onSignOut}
        />
      )}
    </div>
  );
}
