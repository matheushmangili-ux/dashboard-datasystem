"use client";

import { useEffect, useState } from "react";

/* ----- Tumbleweed SVG ----- */
function TumbleweedSvg({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="18" stroke="var(--western-rust)" strokeWidth="2.5" opacity="0.55" />
      <circle cx="22" cy="22" r="11" stroke="var(--western-rust)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="22" cy="22" r="5" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
      <line x1="4" y1="22" x2="40" y2="22" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="4" x2="22" y2="40" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
      <line x1="8" y1="8" x2="36" y2="36" stroke="var(--western-rust)" strokeWidth="1" opacity="0.25" />
      <line x1="36" y1="8" x2="8" y2="36" stroke="var(--western-rust)" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

/* ----- Cactus SVG ----- */
function CactusSvg({ height = 56 }: { height?: number }) {
  const scale = height / 56;
  return (
    <svg width={28 * scale} height={height} viewBox="0 0 28 56" fill="none" aria-hidden="true">
      <rect x="10" y="6" width="8" height="50" rx="4" fill="var(--western-cactus)" opacity="0.4" />
      <rect x="0" y="18" width="12" height="6" rx="3" fill="var(--western-cactus)" opacity="0.4" />
      <rect x="0" y="16" width="5" height="14" rx="2.5" fill="var(--western-cactus)" opacity="0.4" />
      <rect x="18" y="28" width="10" height="6" rx="3" fill="var(--western-cactus)" opacity="0.4" />
      <rect x="23" y="24" width="5" height="14" rx="2.5" fill="var(--western-cactus)" opacity="0.4" />
    </svg>
  );
}

/* ----- Horse silhouette SVG ----- */
function HorseSvg() {
  return (
    <svg width="80" height="52" viewBox="0 0 80 52" fill="none" aria-hidden="true">
      <path
        d="M8,44 C8,44 12,36 18,34 C24,32 28,28 30,24 C32,20 36,16 40,14 C44,12 50,10 54,12 C58,14 60,18 62,22 C64,26 66,30 70,32 C74,34 78,36 78,40 C78,44 74,48 70,48 C66,48 64,44 60,44 C56,44 52,46 48,48 C44,50 40,50 36,48 C32,46 28,46 24,46 C20,46 16,48 12,48 C8,48 8,44 8,44Z"
        fill="var(--western-leather)"
        opacity="0.35"
      />
      <path
        d="M54,12 C52,8 50,4 52,2 C54,0 56,2 56,4 C56,6 54,10 54,12Z"
        fill="var(--western-leather)"
        opacity="0.35"
      />
      <path
        d="M56,4 C58,4 60,6 60,8"
        stroke="var(--western-leather)"
        strokeWidth="1.5"
        opacity="0.3"
      />
    </svg>
  );
}

/* ===== Bottom bar animation (tumbleweeds, horse, cacti) ===== */
export function DashboardAnimation() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden" style={{ height: 140 }}>
      {/* Desert ground line */}
      <svg className="absolute bottom-0 w-full" height="60" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 Q360,10 720,25 T1440,20 L1440,60 L0,60Z" fill="var(--western-sand)" opacity="0.15" />
        <path d="M0,40 Q400,25 800,35 T1440,30 L1440,60 L0,60Z" fill="var(--western-leather)" opacity="0.08" />
      </svg>

      {/* Tumbleweed rolling across (first 10s of the 20s cycle) */}
      <div
        className="absolute bottom-6"
        style={{ animation: "tumbleweed 20s linear infinite" }}
      >
        <div style={{ animation: "tumbleweed-bounce 1.3s ease-in-out infinite" }}>
          <TumbleweedSvg size={44} />
        </div>
      </div>

      {/* Horse silhouette galloping (second 10s of the 20s cycle) */}
      <div
        className="absolute bottom-4"
        style={{ animation: "horse-gallop 20s linear infinite" }}
      >
        <HorseSvg />
      </div>

      {/* Static cacti on the sides */}
      <div className="absolute bottom-0 left-[5%]" style={{ animation: "cactus-sway 6s ease-in-out infinite" }}>
        <CactusSvg height={50} />
      </div>
      <div className="absolute bottom-0 left-[15%]" style={{ animation: "cactus-sway 7s ease-in-out 1.5s infinite" }}>
        <CactusSvg height={36} />
      </div>
      <div className="absolute bottom-0 right-[8%]" style={{ animation: "cactus-sway 5.5s ease-in-out 0.8s infinite" }}>
        <CactusSvg height={46} />
      </div>
      <div className="absolute bottom-0 right-[18%]" style={{ animation: "cactus-sway 8s ease-in-out 2s infinite" }}>
        <CactusSvg height={32} />
      </div>

      {/* Dust clouds */}
      <div
        className="absolute bottom-3 h-6 w-40 rounded-full bg-[var(--western-sand)]"
        style={{ animation: "desert-dust 14s linear infinite", filter: "blur(18px)" }}
      />
      <div
        className="absolute bottom-5 h-4 w-28 rounded-full bg-[var(--western-sand)]"
        style={{ animation: "desert-dust 18s linear 6s infinite", filter: "blur(14px)" }}
      />
    </div>
  );
}

/* ===== Subtle home desert scene (extends login atmosphere) ===== */
export function HomeDesertScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Very subtle sky gradient at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-[200px]" 
        style={{
          background: "linear-gradient(to bottom, var(--western-sand), transparent)",
          opacity: 0.06,
        }}
      />

      {/* Removed faint sun glow in top-right as requested */}

      {/* Twinkling stars (very subtle) */}
      {[
        { top: "5%", left: "15%", delay: "0s", size: 2 },
        { top: "8%", left: "40%", delay: "2s", size: 1.5 },
        { top: "3%", left: "65%", delay: "1s", size: 2 },
        { top: "12%", left: "80%", delay: "3.5s", size: 1.5 },
        { top: "6%", left: "30%", delay: "4s", size: 2 },
        { top: "10%", left: "55%", delay: "1.5s", size: 1.5 },
        { top: "4%", left: "90%", delay: "2.5s", size: 2 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[var(--western-gold)]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `star-twinkle 4s ease-in-out ${s.delay} infinite`,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Floating dust particles (extremely subtle) */}
      <div
        className="absolute top-[20%] h-3 w-24 rounded-full bg-[var(--western-sand)]"
        style={{ animation: "desert-dust 25s linear infinite", filter: "blur(12px)", opacity: 0.06 }}
      />
      <div
        className="absolute top-[45%] h-2 w-16 rounded-full bg-[var(--western-sand)]"
        style={{ animation: "desert-dust 30s linear 8s infinite", filter: "blur(10px)", opacity: 0.04 }}
      />
      <div
        className="absolute top-[70%] h-2 w-20 rounded-full bg-[var(--western-sand)]"
        style={{ animation: "desert-dust 22s linear 15s infinite", filter: "blur(14px)", opacity: 0.05 }}
      />

      {/* Very faint desert horizon silhouette at the bottom */}
      <svg className="absolute bottom-0 w-full opacity-[0.03]" height="80" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,50 Q200,20 400,40 T800,30 T1200,45 T1440,35 L1440,80 L0,80Z" fill="var(--western-leather)" />
      </svg>
    </div>
  );
}
