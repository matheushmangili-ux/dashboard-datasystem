"use client";

import { SidebarView } from "./sidebar";
import { ChannelPerformanceChart } from "./channel-performance-chart";
import type { DashboardSnapshot } from "@/lib/types";

export function IndicadoresView({ 
  onNavigate, 
  snapshot 
}: { 
  onNavigate: (view: SidebarView) => void;
  snapshot: DashboardSnapshot;
}) {
  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <h1 className="text-3xl font-extrabold font-heading tracking-tight">Indicadores de Performance</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Análise aprofundada e visualização gráfica dos resultados cruzados entre canais.</p>
      </header>
      
      <div className="p-8 w-full max-w-[1200px] flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="w-full">
          <ChannelPerformanceChart snapshot={snapshot} />
        </div>
      </div>
    </div>
  );
}
