"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { TrendPoint } from "@/lib/types";

// Helper function to mock accumulated YoY data for visual demonstration
function generateMockYoyData(period: "dia" | "semana" | "mes", basePoints: TrendPoint[]) {
  if (period === "dia") {
    let accCurrent = 0;
    let accLast = 0;
    return basePoints.map((p) => {
      accCurrent = p.value; 
      accLast = p.target * 0.82; 
      return {
        label: p.label,
        currentYear: accCurrent,
        lastYear: accLast,
      };
    });
  }
  
  if (period === "semana") {
    return [
      { label: "Seg", currentYear: 15200, lastYear: 13500 },
      { label: "Ter", currentYear: 28400, lastYear: 24200 },
      { label: "Qua", currentYear: 45700, lastYear: 39100 },
      { label: "Qui", currentYear: 67100, lastYear: 58500 },
      { label: "Sex", currentYear: 92800, lastYear: 81300 },
      { label: "Sáb", currentYear: 125400, lastYear: 110200 },
      { label: "Dom", currentYear: 140600, lastYear: 122400 },
    ];
  }
  
  // Mês
  return [
    { label: "Sem 1", currentYear: 140600, lastYear: 122400 },
    { label: "Sem 2", currentYear: 310200, lastYear: 260500 },
    { label: "Sem 3", currentYear: 480100, lastYear: 410200 },
    { label: "Sem 4", currentYear: 695000, lastYear: 580000 },
  ];
}

export function TrendChart({ 
  points, 
  isPending 
}: { 
  points: TrendPoint[];
  isPending?: boolean;
}) {
  const [period, setPeriod] = useState<"dia" | "semana" | "mes">("dia");

  if (!points || points.length === 0) return null;

  const chartData = generateMockYoyData(period, points);

  return (
    <div className="w-full flex flex-col h-full mt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Comparativo YoY (Acumulado)</h3>
          <p className="text-sm text-muted-foreground">Desempenho Este Ano vs Ano Passado</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Refresh indicator */}
          {isPending && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
          )}

          {/* Mini Menu - Redesigned as a wood-like toggle */}
          <div className="flex bg-[var(--western-leather)]/5 p-1 rounded-xl border-2 border-[var(--western-leather)]/10 text-xs font-bold shadow-inner">
            {(["dia", "semana", "mes"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg transition-all duration-300 ${
                  period === p 
                    ? "bg-[var(--western-leather)] text-white shadow-md scale-105" 
                    : "text-muted-foreground hover:text-[var(--western-leather)] hover:bg-[var(--western-leather)]/10"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10} />
            <YAxis hide domain={["dataMin - 5000", "dataMax + 5000"]} />
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--card)", color: "var(--card-foreground)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
              labelStyle={{ fontWeight: "bold", marginBottom: "4px", color: "var(--muted-foreground)" }} 
              itemStyle={{ color: "var(--foreground)", fontSize: "14px", padding: "2px 0" }} 
              formatter={(value: any, name: any) => [
                new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value),
                name as string
              ]} 
            />
            <Area type="monotone" dataKey="lastYear" stroke="var(--muted-foreground)" strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" name="Ano Passado" animationDuration={1500} animationEasing="ease-in-out" />
            <Area type="monotone" dataKey="currentYear" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" name="Este Ano" animationDuration={1500} animationEasing="ease-in-out" activeDot={{ r: 4, strokeWidth: 0, fill: "var(--success)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
