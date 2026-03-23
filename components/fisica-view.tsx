"use client";

import { useState } from "react";
import { Filter, Store, Calendar, Users, TrendingUp, Smartphone, BookOpen, Send, Target, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

type TimeRange = "hoje" | "semana" | "mes" | "trimestre" | "ano";

interface SalespersonOTO {
  sentRate: number;
  conversionRate: number;
  availableContacts: number;
}

interface SalespersonCatalogQ1 {
  sentToday: number;
  sentWeek: number;
  sentMonth: number;
}

interface SalespersonDetailed {
  id: string;
  name: string;
  photoUrl: string;
  team: string;
  revenue: number;
  goal: number;
  yoyPercent: number;
  oto: SalespersonOTO;
  catalogQ1: SalespersonCatalogQ1;
  chartData: { label: string; value: number }[];
}

const MOCK_SELLERS: SalespersonDetailed[] = [
  {
    id: "v1",
    name: "Ana Silva",
    photoUrl: "https://i.pravatar.cc/150?u=ana_s",
    team: "Vendas Loja 1",
    revenue: 32500,
    goal: 30000,
    yoyPercent: 12.5,
    oto: { sentRate: 85, conversionRate: 15.2, availableContacts: 320 },
    catalogQ1: { sentToday: 12, sentWeek: 45, sentMonth: 180 },
    chartData: [
      { label: "Seg", value: 4500 }, { label: "Ter", value: 3800 }, { label: "Qua", value: 4200 },
      { label: "Qui", value: 5100 }, { label: "Sex", value: 6800 }, { label: "Sáb", value: 8100 }
    ]
  },
  {
    id: "v2",
    name: "Carlos Mendes",
    photoUrl: "https://i.pravatar.cc/150?u=carlos_m",
    team: "Vendas VIP",
    revenue: 28900,
    goal: 32000,
    yoyPercent: -2.4,
    oto: { sentRate: 60, conversionRate: 8.5, availableContacts: 150 },
    catalogQ1: { sentToday: 5, sentWeek: 20, sentMonth: 95 },
    chartData: [
      { label: "Seg", value: 3000 }, { label: "Ter", value: 3200 }, { label: "Qua", value: 2900 },
      { label: "Qui", value: 4100 }, { label: "Sex", value: 6500 }, { label: "Sáb", value: 9200 }
    ]
  },
  {
    id: "v3",
    name: "Roberto Dias",
    photoUrl: "https://i.pravatar.cc/150?u=roberto_d",
    team: "Vendas Loja 1",
    revenue: 19800,
    goal: 20000,
    yoyPercent: 8.1,
    oto: { sentRate: 92, conversionRate: 18.0, availableContacts: 410 },
    catalogQ1: { sentToday: 18, sentWeek: 72, sentMonth: 305 },
    chartData: [
      { label: "Seg", value: 2100 }, { label: "Ter", value: 2500 }, { label: "Qua", value: 2800 },
      { label: "Qui", value: 3400 }, { label: "Sex", value: 4000 }, { label: "Sáb", value: 5000 }
    ]
  }
];

export function FisicaView() {
  const [timeRange, setTimeRange] = useState<TimeRange>("semana");
  const [sellerFilter, setSellerFilter] = useState("Todos");

  return (
    <div className="flex-1 flex flex-col font-sans bg-background min-h-screen">
      {/* SUBHEADER COM FILTROS */}
      <div className="sticky top-0 z-20 w-full border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            Loja Física
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Análise de Performance e Atendimento por Vendedor</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            {(["hoje", "semana", "mes", "ano"] as TimeRange[]).map((tr) => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                  timeRange === tr
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          <div className="relative group">
            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
              className="appearance-none bg-background border border-border text-sm font-medium rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="Todos">Todas as Equipes</option>
              <option value="Vendas Loja 1">Vendas Loja 1</option>
              <option value="Vendas VIP">Vendas VIP</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* RENDER DOS VENDEDORES */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {MOCK_SELLERS.filter(s => sellerFilter === "Todos" || s.team === sellerFilter).map((seller) => (
            <div key={seller.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
              
              {/* Vendedor Header */}
              <div className="flex items-center gap-4 p-5 border-b border-border bg-muted/20">
                <img 
                  src={seller.photoUrl} 
                  alt={seller.name} 
                  className="w-16 h-16 rounded-full border-2 border-background shadow-md object-cover" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-foreground">{seller.name}</h3>
                      <p className="text-xs font-medium text-muted-foreground">{seller.team}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-foreground drop-shadow-sm">
                        R$ {seller.revenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </div>
                      <div className="flex items-center justify-end gap-2 text-xs font-semibold mt-1">
                        <span className="text-muted-foreground text-[10px] uppercase">YoY</span>
                        <span className={seller.yoyPercent >= 0 ? "text-success" : "text-destructive"}>
                          {seller.yoyPercent > 0 ? "+" : ""}{seller.yoyPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50">
                
                {/* TOOL 1: OTO CRM */}
                <div className="bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold">Ferramenta OTO (CRM)</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-center flex flex-col justify-center">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Taxa Envio</p>
                      <p className="text-lg font-black text-foreground">{seller.oto.sentRate}%</p>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-center flex flex-col justify-center">
                      <p className="text-[10px] uppercase font-bold text-primary mb-1">Conversão</p>
                      <p className="text-lg font-black text-primary">{seller.oto.conversionRate}%</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-center flex flex-col justify-center">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Contatos</p>
                      <p className="text-lg font-black text-foreground">{seller.oto.availableContacts}</p>
                    </div>
                  </div>
                </div>

                {/* TOOL 2: Catálogo +Q1 */}
                <div className="bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold">Catálogo +Q1</h4>
                  </div>
                  {(() => {
                    let catValue = seller.catalogQ1.sentWeek;
                    let catTarget = 40;
                    if (timeRange === 'hoje') { catValue = seller.catalogQ1.sentToday; catTarget = 10; }
                    else if (timeRange === 'mes') { catValue = seller.catalogQ1.sentMonth; catTarget = 150; }
                    else if (timeRange === 'trimestre') { catValue = seller.catalogQ1.sentMonth * 3; catTarget = 450; }
                    else if (timeRange === 'ano') { catValue = seller.catalogQ1.sentMonth * 12; catTarget = 1800; }
                    
                    return (
                      <div className="bg-muted/30 p-4 rounded-lg border border-border/50 flex flex-col justify-center h-[88px]">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                          Envios ({timeRange === 'hoje' ? 'Dia' : timeRange})
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-4xl font-black text-foreground drop-shadow-sm">{catValue}</p>
                          {catValue >= catTarget && (
                            <div className="bg-amber-500/10 p-2 rounded-full border border-amber-500/20 shadow-sm" title="Meta Atingida!">
                              <Award className="w-6 h-6 text-amber-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* Chart: Variação Semanal */}
              <div className="p-5 border-t border-border bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-[12px] font-bold uppercase text-muted-foreground tracking-wider">Tração de Vendas ({timeRange})</h4>
                </div>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seller.chartData}>
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {
                          seller.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 4000 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.4)'} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
