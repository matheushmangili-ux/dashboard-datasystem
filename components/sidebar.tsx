"use client";

import { useState } from "react";
import { 
  LayoutDashboard, Users, Target, PieChart, Store, 
  ShoppingCart, Settings, ChevronDown, Activity, TextSearch, MessageSquare, Briefcase, Package
} from "lucide-react";

export type SidebarView = 
  | "dashboard" | "vendedores" | "metas" | "indicadores" | "fisica" 
  | "ecommerce" | "cadastros" | "admin"
  | "ecommerce-resultados" | "ecommerce-trafego" | "ecommerce-seo"
  | "ecommerce-atendimento" | "ecommerce-clientes" | "ecommerce-produtos";

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  subItems?: { id: string; label: string; icon: any }[];
};

const MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", label: "Menu Principal", icon: LayoutDashboard },
  { id: "vendedores", label: "Vendedores", icon: Users },
  { id: "metas", label: "Metas", icon: Target },
  { id: "indicadores", label: "Indicadores", icon: PieChart },
  { id: "fisica", label: "Loja Física", icon: Store },
  { 
    id: "ecommerce", 
    label: "E-commerce", 
    icon: ShoppingCart,
    subItems: [
      { id: "ecommerce-resultados", label: "Resultados", icon: Activity },
      { id: "ecommerce-trafego", label: "Tráfego", icon: Users },
      { id: "ecommerce-seo", label: "Palavras-chave", icon: TextSearch },
      { id: "ecommerce-atendimento", label: "Atendimento", icon: MessageSquare },
      { id: "ecommerce-clientes", label: "Clientes", icon: Briefcase },
      { id: "ecommerce-produtos", label: "Produtos", icon: Package },
    ]
  },
  { id: "cadastros", label: "Cadastros", icon: Settings },
];

export function Sidebar({ 
  currentView, 
  onNavigate 
}: { 
  currentView: string; 
  onNavigate: (view: SidebarView) => void 
}) {
  // State for accordion toggles
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ ecommerce: false });

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-[280px] h-screen bg-card border-r border-border flex flex-col fixed top-0 left-0 hidden md:flex z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-bold shadow-md hover:rotate-12 transition-transform cursor-pointer">
            TC
          </div>
          <h1 className="text-xl font-bold font-heading tracking-tight">
            Texas Center
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6 custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isMainActive = currentView === item.id;
          const isSubMenuOpen = openMenus[item.id];
          const hasActiveSubItem = item.subItems?.some(s => s.id === currentView);
          const highlightHeader = isMainActive || hasActiveSubItem;
          
          return (
            <div key={item.id} className="flex flex-col gap-1">
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleMenu(item.id);
                  } else {
                    onNavigate(item.id as SidebarView);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-[1px] active:scale-[0.98] ${
                  highlightHeader 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${highlightHeader ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  {item.label}
                </div>
                {item.subItems && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSubMenuOpen ? "rotate-180" : ""}`} />
                )}
              </button>

              {/* Sub-menu Rendering with CSS transitions */}
              {item.subItems && isSubMenuOpen && (
                <div className="pl-4 pr-2 mt-1 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="border-l-2 border-border/60 pl-3 py-1 space-y-1">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentView === sub.id;
                      
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onNavigate(sub.id as SidebarView)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all hover:translate-x-1 ${
                            isSubActive 
                              ? "bg-primary/10 text-foreground font-bold border-l-[3px] border-primary" 
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-[3px] border-transparent"
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 ${isSubActive ? "text-primary" : "text-muted-foreground/70"}`} />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-muted/10">
        <button className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-muted-foreground bg-background border border-border hover:bg-muted hover:text-foreground transition-all hover:-translate-y-[2px]">
          Calculadora de Parcelas
        </button>
        <p className="text-[11px] text-center font-mono text-muted-foreground/60 mt-4">
          Texas Center v2.0
        </p>
      </div>
    </aside>
  );
}
