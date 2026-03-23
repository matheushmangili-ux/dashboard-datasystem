"use client";

import { useState } from "react";

import { AdminWorkspace } from "@/components/admin-workspace";
import { RealtimeDashboard } from "@/components/realtime-dashboard";
import { Sidebar, type SidebarView } from "@/components/sidebar";
import { CadastrosView } from "@/components/cadastros-view";
import { IndicadoresView } from "@/components/indicadores-view";
import { EcommerceView } from "@/components/ecommerce-view";
import { FisicaView } from "@/components/fisica-view";
import { MetasView } from "@/components/metas-view";
import { MelhorEnvioView } from "@/components/melhor-envio-view";
import type { AuthUser } from "@/lib/auth/types";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import type { DashboardSnapshot } from "@/lib/types";
import type { SpreadsheetData } from "@/lib/spreadsheet/parse-metas";

export function AppWorkspace({
  currentUser,
  initialSnapshot,
  onSignOut,
  readiness,
  metasData
}: {
  currentUser: AuthUser;
  initialSnapshot: DashboardSnapshot;
  onSignOut: () => void;
  readiness: IntegrationReadiness;
  metasData: SpreadsheetData;
}) {
  const [view, setView] = useState<SidebarView>("dashboard");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar currentView={view} onNavigate={setView} todayRevenue={initialSnapshot.salesChannels[0]?.revenueLabel} />
      
      <div className="flex-1 md:ml-[280px] overflow-x-hidden min-h-screen relative flex flex-col">
        {view === "cadastros" ? (
          <CadastrosView onNavigate={setView} />
        ) : view === "indicadores" ? (
          <IndicadoresView onNavigate={setView} snapshot={initialSnapshot} />
        ) : view.startsWith("ecommerce-") ? (
          <EcommerceView activeView={view as any} />
        ) : view === "admin" ? (
          <div className="p-6">
            <button 
              onClick={() => setView("dashboard")}
              className="mb-8 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 inline-flex items-center gap-2"
            >
              &larr; Voltar para o Dashboard Operacional
            </button>
            <AdminWorkspace currentUser={currentUser} readiness={readiness} />
          </div>
        ) : view === "fisica" ? (
          <FisicaView />
        ) : view === "metas" ? (
          <MetasView data={metasData} />
        ) : view === "melhor-envio" ? (
          <MelhorEnvioView />
        ) : (
          <div className="flex-1">
            {/* Outras telas (vendedores, metas) podem renderizar views especificas,
                aqui deixaremos o RealtimeDashboard lidando com tudo provisoriamente. */}
            <RealtimeDashboard
              currentUser={currentUser}
              initialSnapshot={initialSnapshot}
              onSignOut={onSignOut}
              forceActiveChannel={undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
