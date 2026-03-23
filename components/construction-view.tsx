"use client";

import { Wrench, Hammer, AlertTriangle } from "lucide-react";
import type { SidebarView } from "./sidebar";

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
        {/* Western GIF scene */}
        <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border-4 border-[var(--western-gold)]/30 shadow-2xl group">
          {/* Image */}
          <img
            src="/western-construction.png"
            alt="Cena do Velho Oeste - Página em construção"
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ maxHeight: "380px", objectPosition: "center" }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Animated tumbleweed overlay */}
          <div
            className="absolute bottom-8 pointer-events-none"
            style={{ animation: "tumbleweed 8s linear infinite" }}
          >
            <div style={{ animation: "tumbleweed-bounce 1.2s ease-in-out infinite" }}>
              <svg width="36" height="36" viewBox="0 0 44 44" fill="none" className="opacity-70">
                <circle cx="22" cy="22" r="18" stroke="var(--western-sand)" strokeWidth="2.5" opacity="0.7" />
                <circle cx="22" cy="22" r="11" stroke="var(--western-sand)" strokeWidth="1.5" opacity="0.5" />
                <circle cx="22" cy="22" r="5" stroke="var(--western-sand)" strokeWidth="1" opacity="0.3" />
                <line x1="4" y1="22" x2="40" y2="22" stroke="var(--western-sand)" strokeWidth="1" opacity="0.3" />
                <line x1="22" y1="4" x2="22" y2="40" stroke="var(--western-sand)" strokeWidth="1" opacity="0.3" />
              </svg>
            </div>
          </div>

          {/* Bottom text on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <p className="text-white/90 font-heading font-black text-2xl tracking-wider uppercase drop-shadow-lg" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              A poeira vai baixar em breve...
            </p>
          </div>

          {/* Western corner ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[var(--western-gold)]/50 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[var(--western-gold)]/50 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[var(--western-gold)]/50 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[var(--western-gold)]/50 rounded-br-lg pointer-events-none" />
        </div>

        <div className="mt-10 text-center space-y-4 max-w-lg">
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
