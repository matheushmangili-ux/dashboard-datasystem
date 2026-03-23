"use client";

import { useTransition, useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInAction, signOutAction } from "@/app/actions/auth";

import { AppWorkspace } from "@/components/app-workspace";
import type { AuthUser } from "@/lib/auth/types";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import type { DashboardSnapshot } from "@/lib/types";

/* ---------- Cyber-Western background for login ---------- */
function CyberWesternScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(184, 115, 51, 0.8)";
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 160, 23, ${1 - dist/150})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5deb3]/40 via-[#e8c89a]/30 to-[#c08050]/50" />
      
      <div
        className="absolute top-[8%] right-[12%] w-28 h-28 rounded-full z-0"
        style={{
          background: "radial-gradient(circle, var(--western-gold) 0%, rgba(212,160,23,0.3) 55%, transparent 70%)",
          animation: "sunset-pulse 4s ease-in-out infinite",
        }}
      />

      <div 
        className="absolute bottom-0 left-0 w-full h-[50%] opacity-20 z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(184,115,51,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(184,115,51,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(600px) rotateX(70deg)",
          transformOrigin: "bottom center"
        }}
      />

      <svg className="absolute bottom-0 left-0 w-full z-0" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "40%" }}>
        <path d="M0,224 C180,140 360,260 540,200 C720,140 900,240 1080,180 C1260,120 1380,200 1440,160 L1440,320 L0,320Z" fill="var(--western-rust)" opacity="0.2" />
        <path d="M0,260 C200,200 400,280 600,240 C800,200 1000,270 1200,230 C1320,210 1400,250 1440,240 L1440,320 L0,320Z" fill="var(--western-leather)" opacity="0.15" />
      </svg>

      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      <div
        className="absolute bottom-[18%] z-10"
        style={{ animation: "tumbleweed 20s linear infinite" }}
      >
        <div style={{ animation: "tumbleweed-bounce 1.2s ease-in-out infinite" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="var(--western-gold)" strokeWidth="2" opacity="0.8" style={{ filter: "drop-shadow(0 0 4px var(--western-gold))" }} />
            <circle cx="20" cy="20" r="10" stroke="var(--western-gold)" strokeWidth="1.5" opacity="0.6" />
            <line x1="4" y1="20" x2="36" y2="20" stroke="var(--western-gold)" strokeWidth="1.5" opacity="0.5" />
            <line x1="20" y1="4" x2="20" y2="36" stroke="var(--western-gold)" strokeWidth="1.5" opacity="0.5" />
            <line x1="8" y1="8" x2="32" y2="32" stroke="var(--western-gold)" strokeWidth="1.5" opacity="0.4" />
            <line x1="32" y1="8" x2="8" y2="32" stroke="var(--western-gold)" strokeWidth="1.5" opacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------- animated desert background for login ---------- */
function LoginDesertScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5deb3] via-[#e8c89a] to-[#c08050] opacity-40" />

      {/* Sun with pulsing glow */}
      <div
        className="absolute top-[8%] right-[12%] w-28 h-28 rounded-full"
        style={{
          background: "radial-gradient(circle, var(--western-gold) 0%, rgba(212,160,23,0.3) 55%, transparent 70%)",
          animation: "sunset-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Desert hills */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "40%" }}>
        <path d="M0,224 C180,140 360,260 540,200 C720,140 900,240 1080,180 C1260,120 1380,200 1440,160 L1440,320 L0,320Z" fill="var(--western-rust)" opacity="0.25" />
        <path d="M0,260 C200,200 400,280 600,240 C800,200 1000,270 1200,230 C1320,210 1400,250 1440,240 L1440,320 L0,320Z" fill="var(--western-leather)" opacity="0.2" />
      </svg>

      {/* Tumbleweed 1 */}
      <div
        className="absolute bottom-[18%]"
        style={{ animation: "tumbleweed 18s linear infinite" }}
      >
        <div style={{ animation: "tumbleweed-bounce 1.2s ease-in-out infinite" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="var(--western-rust)" strokeWidth="2" opacity="0.5" />
            <circle cx="20" cy="20" r="10" stroke="var(--western-rust)" strokeWidth="1.5" opacity="0.4" />
            <line x1="4" y1="20" x2="36" y2="20" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="4" x2="20" y2="36" stroke="var(--western-rust)" strokeWidth="1" opacity="0.3" />
            <line x1="8" y1="8" x2="32" y2="32" stroke="var(--western-rust)" strokeWidth="1" opacity="0.25" />
            <line x1="32" y1="8" x2="8" y2="32" stroke="var(--western-rust)" strokeWidth="1" opacity="0.25" />
          </svg>
        </div>
      </div>

      {/* Tumbleweed 2 (delayed) */}
      <div
        className="absolute bottom-[22%]"
        style={{ animation: "tumbleweed 24s linear 8s infinite" }}
      >
        <div style={{ animation: "tumbleweed-bounce 1.5s ease-in-out infinite" }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="var(--western-rust)" strokeWidth="2" opacity="0.35" />
            <circle cx="20" cy="20" r="10" stroke="var(--western-rust)" strokeWidth="1.5" opacity="0.3" />
            <line x1="4" y1="20" x2="36" y2="20" stroke="var(--western-rust)" strokeWidth="1" opacity="0.2" />
            <line x1="20" y1="4" x2="20" y2="36" stroke="var(--western-rust)" strokeWidth="1" opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* Cactus left */}
      <div className="absolute bottom-[12%] left-[8%]" style={{ animation: "cactus-sway 5s ease-in-out infinite" }}>
        <svg width="32" height="60" viewBox="0 0 32 60" fill="none" opacity="0.3">
          <rect x="12" y="8" width="8" height="52" rx="4" fill="var(--western-cactus)" />
          <rect x="0" y="20" width="14" height="6" rx="3" fill="var(--western-cactus)" />
          <rect x="0" y="18" width="6" height="14" rx="3" fill="var(--western-cactus)" />
          <rect x="20" y="30" width="12" height="6" rx="3" fill="var(--western-cactus)" />
          <rect x="26" y="26" width="6" height="16" rx="3" fill="var(--western-cactus)" />
        </svg>
      </div>

      {/* Cactus right */}
      <div className="absolute bottom-[14%] right-[10%]" style={{ animation: "cactus-sway 6s ease-in-out 1s infinite" }}>
        <svg width="28" height="50" viewBox="0 0 32 60" fill="none" opacity="0.25">
          <rect x="12" y="10" width="8" height="50" rx="4" fill="var(--western-cactus)" />
          <rect x="20" y="22" width="12" height="6" rx="3" fill="var(--western-cactus)" />
          <rect x="26" y="18" width="6" height="16" rx="3" fill="var(--western-cactus)" />
        </svg>
      </div>

      {/* Dust particles */}
      <div className="absolute bottom-[16%] h-8 w-48 rounded-full bg-[var(--western-sand)]" style={{ animation: "desert-dust 12s linear infinite", filter: "blur(20px)" }} />
      <div className="absolute bottom-[20%] h-6 w-36 rounded-full bg-[var(--western-sand)]" style={{ animation: "desert-dust 16s linear 5s infinite", filter: "blur(16px)" }} />

      {/* Twinkling stars (subtle) */}
      {[
        { top: "12%", left: "20%", delay: "0s", size: 3 },
        { top: "8%", left: "45%", delay: "1.5s", size: 2 },
        { top: "15%", left: "70%", delay: "0.8s", size: 4 },
        { top: "5%", left: "85%", delay: "2.2s", size: 2 },
        { top: "18%", left: "35%", delay: "3s", size: 3 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[var(--western-gold)]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `star-twinkle 3s ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!login.trim() || !password.trim()) {
      setErrorMessage("Preencha o login e a senha.");
      return;
    }

    startTransition(async () => {
      const result = await signInAction(login, password);
      if (!result.success) {
        setErrorMessage(result.error ?? "Login falhou");
        return;
      }
      setErrorMessage(null);
      router.refresh();
    });
  };

  return (
    <main className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden bg-gradient-to-b from-background via-background to-[var(--western-sand)]/20">
      {/* Cyber-Western animated background */}
      <CyberWesternScene />

      <div className="relative z-10 w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-md" style={{ animation: "western-fade-in 0.6s ease-out" }}>
          <div className="flex justify-center">
            <div
              className="flex items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm"
              style={{ animation: "brand-glow 4s ease-in-out infinite" }}
            >
              <img src="/logo.png" alt="Texas Center Logo" className="w-20 h-20 object-contain drop-shadow-xl" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground font-heading tracking-tight">
            Acesso ao Painel
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Acompanhe os resultados da operacao em tempo real.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" style={{ animation: "western-fade-in 0.8s ease-out 0.15s both" }}>
          <div className="bg-card py-8 px-4 shadow-xl sm:rounded-2xl border border-border sm:px-10 relative overflow-hidden western-ornament">
            {/* Top gold gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--western-gold)] via-primary to-[var(--western-gold)]" />

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-foreground tracking-tight">
                  Usuario do Colaborador
                </label>
                <div className="mt-1.5">
                  <input
                    type="text"
                    autoComplete="username"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Ex: Ana Silva"
                    className="appearance-none block w-full px-4 py-2.5 border border-border rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground tracking-tight">
                  Senha / PIN
                </label>
                <div className="mt-1.5">
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha de acesso"
                    className="appearance-none block w-full px-4 py-2.5 border border-border rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background transition-all"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg border border-destructive/20 text-center">
                  {errorMessage}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold tracking-wide text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isPending ? "Validando..." : "Entrar"}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-xs font-mono text-muted-foreground pt-6 border-t border-border/50">
              <span className="text-[var(--western-gold)] font-semibold">Texas Center</span> Dashboard
              <br />
              <span className="opacity-60">Configuracao de Teste</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function AccessShell({
  initialSnapshot,
  readiness,
  initialUser
}: {
  initialSnapshot: DashboardSnapshot;
  readiness: IntegrationReadiness;
  initialUser: AuthUser | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
      router.refresh();
    });
  };

  if (!initialUser) {
    return <LoginScreen />;
  }

  return (
    <AppWorkspace
      currentUser={initialUser}
      initialSnapshot={initialSnapshot}
      onSignOut={handleSignOut}
      readiness={readiness}
    />
  );
}
