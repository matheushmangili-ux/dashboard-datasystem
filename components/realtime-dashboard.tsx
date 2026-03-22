"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { LogOut, TrendingUp, Trophy, AlertTriangle } from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { SalesTeamPanel } from "@/components/sales-team-panel";
import { TrendChart } from "@/components/trend-chart";
import { HorseAnimation } from "@/components/animations";
import { DashboardClock } from "@/components/dashboard-clock";
import { getRoleLabel } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";
import type { DashboardSnapshot, SalesChannelId } from "@/lib/types";

const REFRESH_INTERVAL_MS = 15000;

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then(async (res) => {
    if (!res.ok) throw new Error("Falha ao atualizar o painel.");
    return res.json();
  });

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeStyle: "short"
  }).format(new Date(iso));
}

export function RealtimeDashboard({
  initialSnapshot,
  currentUser,
  onSignOut,
  forceActiveChannel
}: {
  initialSnapshot: DashboardSnapshot;
  currentUser: AuthUser;
  onSignOut: () => void;
  forceActiveChannel?: SalesChannelId;
}) {
  const [activeChannelId, setActiveChannelId] = useState<SalesChannelId>(forceActiveChannel || "physical");

  // Keep internal state in sync if the sidebar navigation changes the prop
  if (forceActiveChannel && forceActiveChannel !== activeChannelId) {
    setActiveChannelId(forceActiveChannel);
  }

  const { data, isValidating } = useSWR<DashboardSnapshot>(
    "/api/dashboard",
    fetcher,
    {
      fallbackData: initialSnapshot,
      refreshInterval: REFRESH_INTERVAL_MS
    }
  );

  const snapshot = data ?? initialSnapshot;
  const isPending = isValidating;

  const activeChannel = useMemo(
    () =>
      snapshot.salesChannels.find((channel) => channel.id === activeChannelId) ??
      snapshot.salesChannels[0],
    [activeChannelId, snapshot.salesChannels]
  );

  const activeLeaderboard = useMemo(
    () =>
      snapshot.channelLeaderboards.find(
        (item) => item.channelId === activeChannelId
      ) ?? snapshot.channelLeaderboards[0],
    [activeChannelId, snapshot.channelLeaderboards]
  );


  if (!activeChannel) return null;

  // Calculate goal achievement based on latest trend point target vs revenue (simplified mock logic)
  const currentRevenueNum = activeChannel.trendPoints[activeChannel.trendPoints.length - 1]?.value || 0;
  const currentTargetNum = activeChannel.trendPoints[activeChannel.trendPoints.length - 1]?.target || 1;
  const achievementPercent = Math.min((currentRevenueNum / currentTargetNum) * 100, 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      {/* HEADER NAV */}
      <header className="sticky top-0 z-10 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold font-heading tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs font-bold">
                TC
              </div>
              Texas Center<span className="text-muted-foreground font-medium"> Dashboard</span>
            </h1>
            
            <nav className="hidden md:flex bg-muted/50 p-1 rounded-lg border border-border">
              {(["physical", "ecommerce"] as SalesChannelId[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChannelId(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeChannelId === tab
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "physical" ? "Loja Física (Data System)" : "E-commerce (Tray)"}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <img 
              src="https://images.tcdn.com.br/files/548537/themes/757/img/settings/logo.png?45076445528a6de8946fee0b2dd90ccc" 
              alt="Texas Center" 
              className="h-8 object-contain select-none shrink-0 invert dark:invert-0 brightness-0 dark:brightness-100" 
            />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{getRoleLabel(currentUser.role)}</p>
            </div>
            <button 
              onClick={onSignOut}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <DashboardClock />
          <button className="secondary-button" onClick={onSignOut} type="button">
            Sair
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 space-y-6">
        
        {/* HERO METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Revenue Meta Card */}
          <div className="lg:col-span-1 p-6 rounded-2xl border border-border bg-primary text-primary-foreground shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div>
              <p className="text-primary-foreground/70 font-medium tracking-tight text-sm uppercase mb-1">Faturamento Hoje</p>
              <h2 className="text-4xl font-bold font-heading tracking-tight">{activeChannel.revenueLabel}</h2>
              <div className="mt-2 inline-block px-2 py-1 bg-white/10 rounded text-xs font-semibold backdrop-blur-sm">
                {activeChannel.deltaLabel}
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2 text-primary-foreground/80 font-medium">
                <span>Meta atingida</span>
                <span>{achievementPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${achievementPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-primary-foreground/60 mt-3 text-right">
                Última sincronização: {formatTime(snapshot.generatedAt)}
              </p>
            </div>
          </div>

          {/* 4 Micro KPIs */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Ticket Médio"
              value={activeChannel.averageTicketLabel}
              caption="Por atendimento"
            />
            <KpiCard
              label="P.A."
              value={`${activeChannel.piecesPerTicket}`}
              caption="Peças por Atendimento"
            />
            <KpiCard
              label="Conversão"
              value={`${activeChannel.conversionRate}%`}
              caption="Fluxo / Vendas"
            />
            <KpiCard
              label="Tickets"
              value={`${activeChannel.ordersCount}`}
              caption="Volume total"
            />
          </div>
        </div>

        {/* MIDDLE GRID: Charts & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Evolução do Faturamento</h3>
                <p className="text-sm text-muted-foreground">Desempenho hora a hora vs Meta Projetada</p>
              </div>
              {isPending && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
              )}
            </div>
            <TrendChart points={activeChannel.trendPoints} />
          </div>

          {/* LEADERBOARD (Salespeople / Ads) */}
          <div className="lg:col-span-1 p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold tracking-tight">
                {activeChannelId === "physical" ? "Ranking de Vendedores" : "Performance de Origem"}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {activeLeaderboard.leaders.map((leader) => (
                <div key={leader.id} className="flex flex-col gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/20">
                        {leader.rank}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{leader.name}</p>
                        <p className="text-xs text-muted-foreground">{leader.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-success">{leader.revenueLabel}</p>
                    </div>
                  </div>
                  
                  {/* Micro KPIs for salesperson */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/40">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">T.M.</p>
                      <p className="text-xs font-semibold">{leader.ticketMedioLabel}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">P.A.</p>
                      <p className="text-xs font-semibold">{leader.piecesPerTicket}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Conv.</p>
                      <p className="text-xs font-semibold">{leader.conversionRate}%</p>
                    </div>
                  </div>
                  
                  {/* Goal Progress */}
                  <div className="mt-1">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground font-medium">Meta</span>
                      <span className={leader.goalAchievement >= 100 ? "text-success font-bold" : "text-foreground font-bold"}>
                        {leader.goalAchievement}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${leader.goalAchievement >= 100 ? "bg-success" : "bg-primary"}`}
                        style={{ width: `${Math.min(leader.goalAchievement, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ALERTS AND YOY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive-foreground shadow-sm">
             <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-semibold tracking-tight text-destructive">Fila de Atenção</h3>
            </div>
            <div className="space-y-3">
              {snapshot.alerts.map(alert => (
                <div key={alert.id} className="p-3 bg-background border border-destructive/10 rounded-lg flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">{alert.title}</span>
                  <span className="text-xs text-muted-foreground">{alert.message}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold tracking-tight">Crescimento Ano Contra Ano (YoY)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {snapshot.yearOverYear.map(yoy => (
                <div key={yoy.id} className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{yoy.label}</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold">{yoy.currentValue}</span>
                    <span className="text-success text-sm font-semibold mb-1">+{yoy.deltaPercent}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">vs {yoy.previousValue} (Ano anterior)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* EASTER EGG: HORSE VS ALIEN */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <HorseAnimation />
      </div>
    </div>
  );
}
