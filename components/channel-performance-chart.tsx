"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import type { DashboardSnapshot } from "@/lib/types";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
}

export function ChannelPerformanceChart({ snapshot }: { snapshot: DashboardSnapshot }) {
  const physChannel = snapshot.salesChannels.find(c => c.id === "physical");
  const ecomChannel = snapshot.salesChannels.find(c => c.id === "ecommerce");

  function parseBrlToNumber(brlStr?: string) {
    if (!brlStr) return 0;
    // R$ 102.500,00 -> 102500
    const clean = brlStr.split(',')[0].replace(/\D/g, '');
    return Number(clean) || 0;
  }

  const physRevenue = parseBrlToNumber(physChannel?.revenueLabel);
  const ecomRevenue = parseBrlToNumber(ecomChannel?.revenueLabel);

  const data = [
    { 
      name: physChannel?.label || "Loja Física", 
      Realizado: physRevenue, 
      Meta: physRevenue > 0 ? physRevenue * 1.1 : 100000, 
      color: "var(--foreground)" 
    },
    { 
      name: ecomChannel?.label || "E-commerce", 
      Realizado: ecomRevenue, 
      Meta: ecomRevenue > 0 ? ecomRevenue * 1.05 : 50000, 
      color: "var(--primary)" 
    },
  ];

  return (
    <div className="w-full h-[360px] bg-card border border-border rounded-2xl shadow-sm p-6 animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-transparent opacity-60 rounded-l-2xl" />
      <div className="mb-8">
        <h3 className="text-lg font-extrabold font-heading tracking-tight text-foreground">Consolidado Financeiro vs. Metas</h3>
        <p className="text-sm font-medium text-muted-foreground">Comparação direta de performance bruta entre ambos os canais de operação.</p>
      </div>

      <div className="h-[250px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }} barGap={12}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 13, fill: "var(--muted-foreground)", fontWeight: 600 }} 
              axisLine={false} 
              tickLine={false} 
              dy={16} 
            />
            <YAxis 
              tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "var(--muted-foreground)", fontWeight: 500 }}
              dx={-8}
            />
            <Tooltip 
              cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", padding: "12px 16px" }}
              itemStyle={{ fontWeight: 600, fontSize: "14px" }}
              labelStyle={{ fontWeight: 700, marginBottom: "8px", color: "var(--foreground)" }}
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "24px" }} 
              iconType="circle"
              iconSize={10}
            />
            <Bar 
              dataKey="Realizado" 
              radius={[6, 6, 0, 0]} 
              isAnimationActive={true} 
              animationDuration={1500} 
              animationEasing="ease-out"
              barSize={45}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <Bar 
              dataKey="Meta" 
              fill="var(--muted-foreground)" 
              opacity={0.3}
              radius={[6, 6, 0, 0]} 
              isAnimationActive={true} 
              animationDuration={1500} 
              animationEasing="ease-out" 
              barSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
