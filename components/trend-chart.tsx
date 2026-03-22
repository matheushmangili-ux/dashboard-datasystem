"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { TrendPoint } from "@/lib/types";

export function TrendChart({ points }: { points: TrendPoint[] }) {
  if (!points || points.length === 0) return null;

  return (
    <div className="w-full h-[280px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            dy={10}
          />
          <YAxis hide domain={["dataMin - 5000", "dataMax + 5000"]} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px", color: "var(--muted-foreground)" }}
            itemStyle={{ color: "var(--foreground)", fontSize: "14px", padding: "2px 0" }}
            formatter={(value: any) =>
              new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
            }
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorTarget)"
            name="Meta (Projeção)"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--success)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            name="Realizado"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
