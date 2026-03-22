"use client";

import { useTransition, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInAction, signOutAction } from "@/app/actions/auth";

import { AppWorkspace } from "@/components/app-workspace";
import type { AuthUser } from "@/lib/auth/types";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import type { DashboardSnapshot } from "@/lib/types";

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
    <main className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">

      <div className="relative z-10 w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-3xl font-extrabold uppercase shadow-xl ring-4 ring-primary/10 tracking-tighter">
              TC
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground font-heading tracking-tight">
          Acesso ao Painel
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Acompanhe os resultados da operação em tempo real.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-card py-8 px-4 shadow-xl sm:rounded-2xl border border-border sm:px-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/30" />
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-foreground tracking-tight">
                Usuário do Colaborador
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
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold tracking-wide text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? "Validando..." : "Entrar"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs font-mono text-muted-foreground pt-6 border-t border-border/50">
            Texas Center Dashboard
            <br />
            Configuração de Teste
          </div>
        </div>
      </div>
      
      </div> {/* Close relative wrapper */}
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
