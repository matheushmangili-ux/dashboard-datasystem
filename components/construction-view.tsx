"use client";

import { AlertTriangle, Hammer, Wrench } from "lucide-react";
import type { SidebarView } from "./sidebar";

function CowboyStandoffAnimation() {
  return (
    <div className="relative w-full max-w-2xl h-[300px] bg-card rounded-2xl overflow-hidden flex items-center justify-between px-12 border-4 border-border/50 shadow-inner">
      {/* Sun/Desert Background Hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--western-gold)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-[var(--western-sand)]/20 border-t border-[var(--western-leather)]/10 pointer-events-none" />
      
      {/* Cowboy 1 (Left) */}
      <div className="cowboy-container transform scale-150 origin-bottom">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="cowboy-svg">
          {/* Hat */}
          <g className="cowboy-hat">
            <ellipse cx="60" cy="32" rx="38" ry="8" fill="var(--western-leather)" opacity="0.9" />
            <path d="M32 32 Q38 8 60 10 Q82 8 88 32" fill="var(--western-leather)" />
            <path d="M40 14 Q60 6 80 14" stroke="var(--western-gold)" strokeWidth="2.5" fill="none" opacity="0.8" />
          </g>
          {/* Face */}
          <g className="cowboy-face">
            <circle cx="60" cy="60" r="24" fill="#F5D6B8" />
            <g className="cowboy-eyes">
              <circle cx="50" cy="55" r="3" fill="#2c1810" />
              <circle cx="70" cy="55" r="3" fill="#2c1810" />
              <line x1="44" y1="48" x2="55" y2="52" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="76" y1="48" x2="65" y2="52" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <line x1="50" y1="70" x2="70" y2="70" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" className="cowboy-mouth" />
          </g>
          <path d="M38 78 Q60 85 82 78 L78 90 Q60 95 42 90Z" fill="var(--destructive)" opacity="0.8" />
          <rect x="45" y="90" width="30" height="20" rx="8" fill="var(--western-leather)" opacity="0.9" />
          {/* Gun */}
          <path d="M75 100 L95 100 L95 95 L80 95 Z" fill="#4b5563" />
        </svg>
      </div>

      {/* Tumbleweed in the middle */}
      <div className="absolute bottom-6 left-[20%]" style={{ animation: "tumbleweed 6s linear infinite" }}>
        <div style={{ animation: "tumbleweed-bounce 1s ease-in-out infinite" }}>
          <svg width="40" height="40" viewBox="0 0 44 44" fill="none" className="scale-125">
            <circle cx="22" cy="22" r="18" stroke="var(--western-rust)" strokeWidth="2.5" opacity="0.55" />
            <circle cx="22" cy="22" r="11" stroke="var(--western-rust)" strokeWidth="1.5" opacity="0.4" />
            <circle cx="22" cy="22" r="5" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
            <line x1="4" y1="22" x2="40" y2="22" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
            <line x1="22" y1="4" x2="22" y2="40" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Cowboy 2 (Right) */}
      <div className="cowboy-container transform scale-150 -scale-x-150 origin-bottom" style={{ animationDelay: "1s" }}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="cowboy-svg">
          {/* Hat */}
          <g className="cowboy-hat" style={{ animationDelay: "1.5s" }}>
            <ellipse cx="60" cy="32" rx="38" ry="8" fill="#1f2937" opacity="0.9" />
            <path d="M32 32 Q38 8 60 10 Q82 8 88 32" fill="#1f2937" />
            <path d="M40 14 Q60 6 80 14" stroke="#9ca3af" strokeWidth="2.5" fill="none" opacity="0.8" />
          </g>
          {/* Face */}
          <g className="cowboy-face">
            <circle cx="60" cy="60" r="24" fill="#F5D6B8" />
            <g className="cowboy-eyes" style={{ animationDelay: "0.5s" }}>
              <circle cx="50" cy="55" r="3" fill="#2c1810" />
              <circle cx="70" cy="55" r="3" fill="#2c1810" />
              <line x1="44" y1="48" x2="55" y2="52" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="76" y1="48" x2="65" y2="52" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <line x1="50" y1="70" x2="70" y2="70" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" className="cowboy-mouth" />
          </g>
          <path d="M38 78 Q60 85 82 78 L78 90 Q60 95 42 90Z" fill="#374151" opacity="0.8" />
          <rect x="45" y="90" width="30" height="20" rx="8" fill="#1f2937" opacity="0.9" />
          {/* Gun */}
          <path d="M75 100 L95 100 L95 95 L80 95 Z" fill="#9ca3af" />
        </svg>
      </div>

      {/* Dramatic Dust Overlay */}
      <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[1px] z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <p className="text-foreground/80 font-heading font-black text-3xl tracking-[0.2em] uppercase drop-shadow-sm">
          A poeira vai subir...
        </p>
      </div>
    </div>
  );
}

export function ConstructionView({ 
  title, 
  description = "Estamos trabalhando duro para trazer novidades para esta área. Volte em breve, parceiro!",
  onNavigate 
}: { 
  title: string;
  description?: string;
  onNavigate?: (view: SidebarView) => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--western-gold)]/20 rounded-xl">
            <Wrench className="w-6 h-6 text-[var(--western-gold)]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading tracking-tight flex items-center gap-3">
              {title}
              <span className="text-sm font-bold bg-[var(--western-gold)]/20 text-[var(--western-gold)] px-3 py-1 rounded-full uppercase tracking-wider">
                Em Construção
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              {description}
            </p>
          </div>
        </div>
      </header>
      
      <div className="p-8 w-full max-w-[1200px] flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CowboyStandoffAnimation />

        <div className="mt-12 text-center space-y-4 max-w-lg">
          <h2 className="text-2xl font-bold font-heading">
            Cuidado com o fogo cruzado!
          </h2>
          <p className="text-muted-foreground">
            Nossos melhores desenvolvedores (e pistoleiros) estão codificando esta página. 
            Melhor buscar cobertura e voltar mais tarde quando a poeira baixar.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Wrench className="w-6 h-6 text-muted-foreground/40 animate-pulse" />
            <Hammer className="w-6 h-6 text-muted-foreground/40 animate-pulse" style={{ animationDelay: "200ms" }} />
            <AlertTriangle className="w-6 h-6 text-muted-foreground/40 animate-pulse" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
