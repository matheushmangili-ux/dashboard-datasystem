"use client";

import { useEffect, useState } from "react";

/* ───── Animated Cowboy SVGs ───── */

function SadCowboy() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="cowboy-svg">
      {/* Hat */}
      <g className="cowboy-hat">
        <ellipse cx="60" cy="32" rx="38" ry="8" fill="var(--western-leather)" opacity="0.9" />
        <path d="M32 32 Q38 8 60 10 Q82 8 88 32" fill="var(--western-leather)" />
        <path d="M40 14 Q60 6 80 14" stroke="var(--western-gold)" strokeWidth="2" fill="none" opacity="0.6" />
      </g>
      {/* Face */}
      <g className="cowboy-face">
        <circle cx="60" cy="60" r="24" fill="#F5D6B8" />
        {/* Sad eyes */}
        <g className="cowboy-eyes">
          <circle cx="50" cy="55" r="3" fill="#2c1810" />
          <circle cx="70" cy="55" r="3" fill="#2c1810" />
          {/* Eyebrows angled sad */}
          <line x1="44" y1="48" x2="53" y2="50" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="48" x2="67" y2="50" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Sad mouth */}
        <path d="M48 72 Q60 65 72 72" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" className="cowboy-mouth" />
        {/* Tear */}
        <g className="cowboy-tear">
          <circle cx="74" cy="62" r="2" fill="#60A5FA" opacity="0.7" />
        </g>
      </g>
      {/* Bandana */}
      <path d="M38 78 Q60 85 82 78 L78 90 Q60 95 42 90Z" fill="var(--destructive)" opacity="0.7" />
      {/* Body hint */}
      <rect x="45" y="90" width="30" height="20" rx="8" fill="var(--western-leather)" opacity="0.4" />
    </svg>
  );
}

function NeutralCowboy() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="cowboy-svg">
      {/* Hat */}
      <g className="cowboy-hat">
        <ellipse cx="60" cy="32" rx="38" ry="8" fill="var(--western-leather)" opacity="0.9" />
        <path d="M32 32 Q38 8 60 10 Q82 8 88 32" fill="var(--western-leather)" />
        <path d="M40 14 Q60 6 80 14" stroke="var(--western-gold)" strokeWidth="2" fill="none" opacity="0.6" />
        {/* Star badge on hat */}
        <polygon points="60,16 62,22 68,22 63,26 65,32 60,28 55,32 57,26 52,22 58,22" fill="var(--western-gold)" opacity="0.5" />
      </g>
      {/* Face */}
      <g className="cowboy-face">
        <circle cx="60" cy="60" r="24" fill="#F5D6B8" />
        {/* Neutral eyes */}
        <g className="cowboy-eyes">
          <circle cx="50" cy="55" r="3" fill="#2c1810" />
          <circle cx="70" cy="55" r="3" fill="#2c1810" />
          {/* Straight eyebrows */}
          <line x1="44" y1="48" x2="56" y2="48" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="48" x2="64" y2="48" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Neutral mouth */}
        <line x1="50" y1="70" x2="70" y2="70" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" className="cowboy-mouth" />
      </g>
      {/* Bandana */}
      <path d="M38 78 Q60 85 82 78 L78 90 Q60 95 42 90Z" fill="var(--western-gold)" opacity="0.5" />
      {/* Body hint */}
      <rect x="45" y="90" width="30" height="20" rx="8" fill="var(--western-leather)" opacity="0.4" />
    </svg>
  );
}

function HappyCowboy() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="cowboy-svg">
      {/* Hat */}
      <g className="cowboy-hat">
        <ellipse cx="60" cy="32" rx="38" ry="8" fill="var(--western-leather)" opacity="0.9" />
        <path d="M32 32 Q38 8 60 10 Q82 8 88 32" fill="var(--western-leather)" />
        <path d="M40 14 Q60 6 80 14" stroke="var(--western-gold)" strokeWidth="2.5" fill="none" opacity="0.8" />
        {/* Star badge on hat */}
        <polygon points="60,16 62,22 68,22 63,26 65,32 60,28 55,32 57,26 52,22 58,22" fill="var(--western-gold)" opacity="0.8" />
      </g>
      {/* Face */}
      <g className="cowboy-face">
        <circle cx="60" cy="60" r="24" fill="#F5D6B8" />
        {/* Happy eyes (squinting) */}
        <g className="cowboy-eyes">
          <path d="M46 55 Q50 51 54 55" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M66 55 Q70 51 74 55" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
        {/* Big smile */}
        <path d="M46 67 Q60 80 74 67" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" className="cowboy-mouth" />
        {/* Blush */}
        <circle cx="42" cy="64" r="5" fill="#F87171" opacity="0.2" />
        <circle cx="78" cy="64" r="5" fill="#F87171" opacity="0.2" />
      </g>
      {/* Bandana */}
      <path d="M38 78 Q60 85 82 78 L78 90 Q60 95 42 90Z" fill="var(--success)" opacity="0.5" />
      {/* Body hint */}
      <rect x="45" y="90" width="30" height="20" rx="8" fill="var(--western-leather)" opacity="0.4" />
      {/* Sparkles around */}
      <g className="cowboy-sparkles">
        <polygon points="20,40 22,36 24,40 22,44" fill="var(--western-gold)" opacity="0.6" />
        <polygon points="96,45 98,41 100,45 98,49" fill="var(--western-gold)" opacity="0.6" />
        <polygon points="30,20 31,17 32,20 31,23" fill="var(--western-gold)" opacity="0.4" />
      </g>
    </svg>
  );
}

/* ───── Main Component ───── */

interface ProfitMarginCardProps {
  margin?: number;
}

export function ProfitMarginCard({ margin: propMargin }: ProfitMarginCardProps) {
  // Use mock value if not provided
  const margin = propMargin ?? 57.3;

  const [animatedMargin, setAnimatedMargin] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 2000;
    const startTime = Date.now();
    let rafId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimatedMargin(margin * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [margin]);

  // Determine status
  const getStatus = (m: number) => {
    if (m > 60) return { label: "Excelente", color: "text-success", bg: "bg-success/10 border-success/20", barColor: "bg-success", ring: "ring-success/30" };
    if (m >= 55) return { label: "Boa", color: "text-[var(--western-gold)]", bg: "bg-[var(--western-gold)]/10 border-[var(--western-gold)]/20", barColor: "bg-[var(--western-gold)]", ring: "ring-[var(--western-gold)]/30" };
    return { label: "Precisa Melhorar", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", barColor: "bg-destructive", ring: "ring-destructive/30" };
  };

  const status = getStatus(margin);

  const CowboyComponent = margin > 60 ? HappyCowboy : margin >= 55 ? NeutralCowboy : SadCowboy;

  if (!mounted) return null;

  return (
    <div className={`relative p-6 rounded-2xl border shadow-sm overflow-hidden ${status.bg} transition-all duration-500 hover:shadow-md hover:-translate-y-0.5`}>
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: margin > 60 ? "var(--success)" : margin >= 55 ? "var(--western-gold)" : "var(--destructive)" }} />

      <div className="flex items-start gap-5 relative z-10">
        {/* Cowboy animation */}
        <div className="shrink-0 cowboy-container">
          <CowboyComponent />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Margem de Lucro</h3>
            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className={`text-4xl font-black font-heading tabular-nums ${status.color} mt-1`}>
            {animatedMargin.toFixed(1)}%
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground mb-1.5">
              <span>0%</span>
              <span className="text-destructive">55%</span>
              <span className="text-[var(--western-gold)]">60%</span>
              <span className="text-success">100%</span>
            </div>
            <div className="relative w-full h-3 bg-black/5 rounded-full overflow-hidden">
              {/* Zone indicators */}
              <div className="absolute inset-0 flex">
                <div className="h-full bg-destructive/10" style={{ width: "55%" }} />
                <div className="h-full bg-[var(--western-gold)]/10" style={{ width: "5%" }} />
                <div className="h-full bg-success/10" style={{ width: "40%" }} />
              </div>
              {/* Actual progress */}
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-[2000ms] ease-out ${status.barColor}`}
                style={{ width: `${Math.min(animatedMargin, 100)}%`, opacity: 0.7 }}
              />
              {/* Indicator dot */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-[2000ms] ease-out ${status.barColor}`}
                style={{ left: `calc(${Math.min(animatedMargin, 100)}% - 8px)` }}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-[10px] font-bold">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">0-54% Ruim</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[var(--western-gold)]" />
              <span className="text-muted-foreground">55-60% Boa</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-muted-foreground">&gt;60% Excelente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
