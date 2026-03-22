"use client";

import { useState } from "react";
import { SidebarView } from "./sidebar";
import { PlusCircle, Target, Users } from "lucide-react";

export function CadastrosView({ onNavigate }: { onNavigate: (view: SidebarView) => void }) {
  const [activeTab, setActiveTab] = useState<"vendedores" | "metas">("vendedores");

  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <h1 className="text-3xl font-extrabold font-heading tracking-tight">Central de Cadastros</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Gerencie sua equipe de vendas e metas operacionais do varejo.</p>
      </header>
      
      <div className="p-8 w-full max-w-[1200px]">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-muted/40 p-1.5 rounded-xl w-fit border border-border/50">
          <button 
            onClick={() => setActiveTab("vendedores")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              activeTab === "vendedores" 
                ? "bg-background shadow-md text-foreground ring-1 ring-border" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="w-4 h-4" /> Cadastrar Vendedores
          </button>
          <button 
            onClick={() => setActiveTab("metas")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              activeTab === "metas" 
                ? "bg-background shadow-md text-foreground ring-1 ring-border" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Target className="w-4 h-4" /> Metas Ponderadas
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "vendedores" && (
            <div className="bg-card border border-border rounded-2xl shadow-sm p-8 lg:w-3/4 max-w-[800px]">
              <h2 className="text-xl font-bold mb-6 font-heading tracking-tight">Novo Vendedor</h2>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Vendedor cadastrado na base com sucesso!"); }}>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">Nome Completo</label>
                  <input type="text" placeholder="Ex: Ana Ribeiro" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-muted-foreground" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Canal Comercial / Equipe</label>
                    <select className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                      <option>Loja Física Principal (Data System)</option>
                      <option>E-commerce (Tray)</option>
                      <option>Venda Corporativa / B2B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Status do Colaborador</label>
                    <select className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                      <option>Ativo - Em Loja</option>
                      <option>Afastado</option>
                      <option>Desligado</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md">
                    <PlusCircle className="w-5 h-5" /> Adicionar Vendedor à Fila
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "metas" && (
            <div className="bg-card border border-border rounded-2xl shadow-sm p-8 w-full max-w-[900px]">
              <h2 className="text-xl font-bold mb-2 font-heading tracking-tight">Metas Ponderadas (Semanal/Quinzenal)</h2>
              <p className="text-sm text-muted-foreground mb-8 font-medium">Defina o atingimento financeiro desejado para períodos customizados. O painel usará essas datas para mensuração de YoY e performance.</p>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Meta distribuída e registrada nos motores (Data System / Tray) com sucesso!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/20 border border-border/50 rounded-xl">
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Período de Início</label>
                    <input type="date" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-text" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Data de Fim (Encerramento)</label>
                    <input type="date" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-text" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Valor Projetado (Meta Financeira)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-muted-foreground font-bold">R$</span>
                      <input type="number" placeholder="150.000" min="0" required className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono font-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Canal da Meta</label>
                    <select className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                      <option>Loja Física Analítica</option>
                      <option>Tráfego + E-commerce</option>
                      <option>Consolidado Global</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-6">
                  <button type="submit" className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md w-full md:w-auto">
                    <Target className="w-5 h-5" /> Provisionar Meta
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
