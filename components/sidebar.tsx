"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { 
  LayoutDashboard, Users, Target, PieChart, Store, 
  ShoppingCart, Settings, ChevronDown, Activity, TextSearch, 
  MessageSquare, Briefcase, Package, TrendingUp, Calculator
} from "lucide-react";

export type SidebarView = 
  | "dashboard" | "vendedores" | "metas" | "indicadores" | "fisica" 
  | "ecommerce" | "cadastros" | "admin"
  | "ecommerce-resultados" | "ecommerce-trafego" | "ecommerce-seo"
  | "ecommerce-atendimento" | "ecommerce-clientes" | "ecommerce-produtos";

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
  badge?: string;
  badgeType?: "alert" | "new" | "count";
  subItems?: { id: string; label: string; icon: LucideIcon; tooltip: string }[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

/* ----- Western humor quotes for sidebar footer ----- */
const WESTERN_QUOTES = [
  "O varejo é como o velho oeste: quem puxa primeiro, vende mais.",
  "Não existe meta inatingível, existe cowboy preguiçoso.",
  "Vender é como laçar: mire no cliente certo.",
  "No velho oeste do varejo, o estoque vazio é o pior bandido.",
  "Yeehaw! Mais um dia pra bater a meta, parceiro!",
  "Cowboy que não cavalga, não vende.",
  "O deserto do varejo tem oásis: se chama conversão.",
  "Ticket médio baixo? Hora de selar o cavalo!",
  "Como dizem no oeste: quem chega primeiro, vende melhor.",
  "A poeira baixa, mas o faturamento tem que subir!",
  "Parceiro, meta batida é como pôr-do-sol: bonito demais!",
  "No varejo, cada cliente é um duelo. Não vacile!",
];

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Operacional",
    items: [
      { id: "dashboard", label: "Painel Geral", icon: LayoutDashboard, tooltip: "Onde o dinheiro galopa" },
      { id: "vendedores", label: "Vendedores", icon: Users, tooltip: "Os cowboys da operação" },
      { id: "metas", label: "Metas", icon: Target, tooltip: "Mire bem, parceiro!" },
      { id: "indicadores", label: "Indicadores", icon: PieChart, tooltip: "Os números não mentem, cowboy" },
    ],
  },
  {
    title: "Canais de Venda",
    items: [
      { id: "fisica", label: "Loja Física", icon: Store, tooltip: "O saloon principal" },
      { 
        id: "ecommerce", 
        label: "E-commerce", 
        icon: ShoppingCart,
        tooltip: "Vendas pelo deserto digital",
        badge: "6",
        badgeType: "count",
        subItems: [
          { id: "ecommerce-resultados", label: "Resultados", icon: Activity, tooltip: "Faturamento do rancho digital" },
          { id: "ecommerce-trafego", label: "Tráfego", icon: Users, tooltip: "Quantos cavaleiros passaram" },
          { id: "ecommerce-seo", label: "Palavras-chave", icon: TextSearch, tooltip: "O mapa do tesouro" },
          { id: "ecommerce-atendimento", label: "Atendimento", icon: MessageSquare, tooltip: "Pronto-socorro do cliente" },
          { id: "ecommerce-clientes", label: "Clientes", icon: Briefcase, tooltip: "Novos vs velhos parceiros" },
          { id: "ecommerce-produtos", label: "Produtos", icon: Package, tooltip: "O inventário do armazém" },
        ]
      },
    ],
  },
  {
    title: "Gestão",
    items: [
      { id: "cadastros", label: "Cadastros", icon: Settings, tooltip: "Onde tudo começa, parceiro" },
    ],
  },
];

/* ----- Connection status indicator ----- */
function StatusDot({ status, label }: { status: "online" | "warning" | "offline"; label: string }) {
  const colors = {
    online: "bg-success",
    warning: "bg-[var(--western-gold)]",
    offline: "bg-destructive",
  };
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-2 w-2">
        {status === "online" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[status]}`} />
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

/* ----- Badge component ----- */
function MenuBadge({ text, type }: { text: string; type: "alert" | "new" | "count" }) {
  if (type === "new") {
    return (
      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[var(--western-gold)]/20 text-[var(--western-gold)] tracking-wider">
        Novo
      </span>
    );
  }
  if (type === "alert") {
    return (
      <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
        {text}
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary/15 text-primary">
      {text}
    </span>
  );
}

export function Sidebar({ 
  currentView, 
  onNavigate,
  todayRevenue,
}: { 
  currentView: string; 
  onNavigate: (view: SidebarView) => void;
  todayRevenue?: string;
}) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ ecommerce: false });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [lassoing, setLassoing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % WESTERN_QUOTES.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogoClick = () => {
    setLassoing(true);
    setTimeout(() => setLassoing(false), 800);
  };

  return (
    <aside className="w-[280px] h-screen bg-card border-r border-border flex flex-col fixed top-0 left-0 hidden md:flex z-50">
      {/* Logo + Branding */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-bold shadow-md hover:rotate-12 transition-transform cursor-pointer ${lassoing ? "animate-[lasso-spin_0.4s_ease-in-out_2]" : ""}`}
            style={!lassoing ? { animation: "brand-glow 4s ease-in-out infinite" } : undefined}
            onClick={handleLogoClick}
            title="Yeehaw!"
          >
            TC
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading tracking-tight">
              Texas Center
            </h1>
            <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">Western Dashboard</p>
          </div>
        </div>

        {/* Quick Revenue Snapshot (benchmark: Bling/Shopify style) */}
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Hoje</span>
          </div>
          <p className="text-lg font-bold font-heading text-foreground">{todayRevenue ?? "--"}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <StatusDot status="online" label="Data System" />
            <StatusDot status="online" label="Tray" />
          </div>
        </div>
      </div>

      {/* Section-based navigation (benchmark: Bling ERP sections) */}
      <nav className="flex-1 px-4 overflow-y-auto pb-6 custom-scrollbar">
        {MENU_SECTIONS.map((section, sectionIdx) => (
          <div key={section.title} className={sectionIdx > 0 ? "mt-5" : ""}>
            {/* Section header with gold accent */}
            <div className="flex items-center gap-2 mb-2 px-2">
              <div className="h-[1px] w-3 bg-[var(--western-gold)]/40" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{section.title}</span>
              <div className="h-[1px] flex-1 bg-border/30" />
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
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
                      title={item.tooltip}
                      className={`group w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-[1px] active:scale-[0.98] ${
                        highlightHeader 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${highlightHeader ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        {item.label}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && item.badgeType && !highlightHeader && (
                          <MenuBadge text={item.badge} type={item.badgeType} />
                        )}
                        {item.subItems && (
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSubMenuOpen ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </button>

                    {/* Sub-menu */}
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
                                title={sub.tooltip}
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
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer with humor + calculator */}
      <div className="p-4 border-t border-border/50 bg-muted/10">
        <button 
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-muted-foreground bg-background border border-border hover:bg-muted hover:text-foreground transition-all hover:-translate-y-[2px]"
        >
          <Calculator className="w-4 h-4" />
          Calculadora de Parcelas
        </button>

        {/* Rotating western quote */}
        <div className="mt-3 px-2 min-h-[32px] flex items-center justify-center">
          <p 
            key={quoteIndex} 
            className="text-[10px] text-center text-muted-foreground/50 italic leading-tight animate-in fade-in duration-500"
          >
            &ldquo;{WESTERN_QUOTES[quoteIndex]}&rdquo;
          </p>
        </div>

        <p className="text-[11px] text-center font-mono text-muted-foreground/60 mt-2">
          Texas Center v2.0 <span className="text-[var(--western-gold)]">&#9733;</span>
        </p>
      </div>
    </aside>
  );
}
