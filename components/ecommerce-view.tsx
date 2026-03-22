"use client";

import { Activity, Users, TextSearch, MessageSquare, Briefcase, Package } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type EcommerceTab = 
  | "ecommerce-resultados" 
  | "ecommerce-trafego" 
  | "ecommerce-seo" 
  | "ecommerce-atendimento" 
  | "ecommerce-clientes" 
  | "ecommerce-produtos";

const mockTrafegoData = [
  { name: "Seg", visitantes: 4000, bounce: 2400 },
  { name: "Ter", visitantes: 3000, bounce: 1398 },
  { name: "Qua", visitantes: 2000, bounce: 9800 },
  { name: "Qui", visitantes: 2780, bounce: 3908 },
  { name: "Sex", visitantes: 1890, bounce: 4800 },
  { name: "Sáb", visitantes: 2390, bounce: 3800 },
  { name: "Dom", visitantes: 3490, bounce: 4300 },
];

export function EcommerceView({ activeView }: { activeView: EcommerceTab }) {

  const renderContent = () => {
    switch (activeView) {
      case "ecommerce-resultados":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <Activity className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-bold mb-2">Vendas e Faturamento</h2>
              <p className="text-4xl font-extrabold text-primary">R$ 48.950,00</p>
              <p className="text-success text-sm font-semibold mt-2">+12% vs semana passada</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="w-full h-40 bg-muted/30 rounded-lg border border-border flex items-center justify-center text-muted-foreground">
                [ Gráfico de Barras YoY ]
              </div>
            </div>
          </div>
        );

      case "ecommerce-trafego":
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Visitantes e Origem</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTrafegoData}>
                    <defs>
                      <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }} />
                    <Area type="monotone" dataKey="visitantes" stroke="var(--primary)" fillOpacity={1} fill="url(#colorVis)" isAnimationActive={true} animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "ecommerce-seo":
        return (
          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-right-4 duration-500">
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <TextSearch className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-bold mb-6">SEO e Performance de Palavras-Chave</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <span className="font-semibold">Bota Western Couro</span>
                  <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full">Top 1</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <span className="font-semibold">Jaqueta Country Masculina</span>
                  <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full">Top 3</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "ecommerce-atendimento":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-4 duration-500">
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-bold mb-2">Tempo de Resposta</h2>
              <p className="text-5xl font-extrabold text-foreground">1m 24s</p>
              <p className="text-muted-foreground text-sm font-semibold mt-2">Média global de chats via WhatsApp</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <p className="text-lg font-bold">Resolução no primeiro contato</p>
              <p className="text-5xl font-black text-success mt-4">92%</p>
            </div>
          </div>
        );

      case "ecommerce-clientes":
        return (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm">
              <Briefcase className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-bold mb-4">Novos vs Recorrentes</h2>
              <div className="flex gap-4 h-16 w-full rounded-xl overflow-hidden mt-6 shadow-inner border border-border/50">
                <div className="bg-primary/80 h-full flex items-center justify-center text-primary-foreground font-bold hover:opacity-90 transition-opacity" style={{ width: '35%' }}>35% Novos</div>
                <div className="bg-primary h-full flex items-center justify-center text-primary-foreground font-bold hover:opacity-90 transition-opacity" style={{ width: '65%' }}>65% Recorrentes</div>
              </div>
            </div>
          </div>
        );

      case "ecommerce-produtos":
        return (
          <div className="grid grid-cols-1 gap-6 animate-in zoom-in-95 duration-500">
            <div className="p-8 bg-card border border-border rounded-2xl shadow-sm">
              <Package className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-bold mb-6">Performance de Produtos e Estoque Físico</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Produto</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Conversão</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Estoque Central</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 font-bold">Chapéu Feltro Colorado</td>
                    <td className="py-4 text-success font-semibold">14.2%</td>
                    <td className="py-4">120 unid.</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 font-bold">Camisa Xadrez Flanela</td>
                    <td className="py-4 text-primary font-semibold">8.5%</td>
                    <td className="py-4 text-destructive font-bold">5 unid. (Alerta)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    return activeView.split('-')[1].charAt(0).toUpperCase() + activeView.split('-')[1].slice(1);
  };

  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <div className="inline-block px-3 py-1 mb-3 bg-primary/10 text-primary font-bold text-xs rounded-full">
          E-commerce (Tray)
        </div>
        <h1 className="text-3xl font-extrabold font-heading tracking-tight">Relatório de {getTitle()}</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Análise aprofundada dos relatórios gerenciais do digital.</p>
      </header>
      <div className="p-8 w-full max-w-[1200px] flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
