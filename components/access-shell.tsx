"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { AppWorkspace } from "@/components/app-workspace";
import { demoUsers, getRoleLabel } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import type { DashboardSnapshot } from "@/lib/types";

const STORAGE_KEY = "pulse-dashboard-session";

function loadStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  const userId = raw.trim();
  return demoUsers.find((user) => user.id === userId) ?? null;
}

function DemoAccess({
  onSignIn
}: {
  onSignIn: (user: AuthUser) => void;
}) {
  const [selectedUserId, setSelectedUserId] = useState(demoUsers[0]?.id ?? "");
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedUser = useMemo(
    () => demoUsers.find((user) => user.id === selectedUserId) ?? demoUsers[0],
    [selectedUserId]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedUser) {
      setErrorMessage("Selecione um perfil de acesso.");
      return;
    }

    if (pin !== selectedUser.pin) {
      setErrorMessage("PIN inválido para este perfil.");
      return;
    }

    setErrorMessage(null);
    onSignIn(selectedUser);
  };

  return (
    <main className="shell access-shell">
      <section className="hero">
        <span className="hero-topline">Pulse access | colaborador</span>
        <div className="hero-grid">
          <div>
            <h1>
              Acesso por perfil,
              <br />
              pronto para escalar.
            </h1>
            <p>
              Enquanto a autenticação do ERP ainda não chegou, o produto já pode
              operar com perfis simulados. Depois, basta trocar esta etapa por SSO,
              API ou login nativo sem refazer o dashboard.
            </p>
          </div>

          <aside className="status-panel">
            <p className="status-label">Perfis liberados</p>
            <h2 className="status-value">{demoUsers.length} acessos demo</h2>
            <p className="status-note">
              Gestão, supervisão e operação já possuem permissões visuais
              separadas.
            </p>
          </aside>
        </div>
      </section>

      <section className="auth-layout">
        <article className="card auth-card">
          <p className="section-eyebrow">Entrar</p>
          <h2 className="section-title">Escolha um perfil</h2>
          <p className="section-copy">
            Esta camada é provisória, mas já organiza a experiência por papel.
          </p>

          <form className="sign-in-form" onSubmit={handleSubmit}>
            <div className="identity-grid">
              {demoUsers.map((user) => {
                const active = user.id === selectedUserId;

                return (
                  <button
                    className={`identity-card ${active ? "active" : ""}`}
                    key={user.id}
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setPin("");
                      setErrorMessage(null);
                    }}
                    type="button"
                  >
                    <span className="identity-role">{getRoleLabel(user.role)}</span>
                    <strong>{user.name}</strong>
                    <span>{user.title}</span>
                    <span>{user.team}</span>
                  </button>
                );
              })}
            </div>

            <label className="field-block">
              <span>PIN de acesso</span>
              <input
                className="field-input"
                onChange={(event) => setPin(event.target.value)}
                placeholder="Digite o PIN demo"
                type="password"
                value={pin}
              />
            </label>

            <p className="field-hint">PINs demo: 1234, 2345 e 3456.</p>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <button className="primary-button" type="submit">
              Entrar no painel
            </button>
          </form>
        </article>

        <article className="card auth-card compact">
          <p className="section-eyebrow">Como fica depois</p>
          <h2 className="section-title">Porta pronta para SSO ou ERP</h2>
          <p className="section-copy">
            Quando a autenticação real existir, esta tela pode ser trocada por login
            corporativo, token do ERP ou permissão por equipe sem alterar os
            componentes de visualização.
          </p>
        </article>
      </section>
    </main>
  );
}

export function AccessShell({
  initialSnapshot,
  readiness
}: {
  initialSnapshot: DashboardSnapshot;
  readiness: IntegrationReadiness;
}) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null | undefined>(
    undefined
  );

  useEffect(() => {
    setCurrentUser(loadStoredUser());
  }, []);

  const handleSignIn = (user: AuthUser) => {
    window.localStorage.setItem(STORAGE_KEY, user.id);
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  };

  if (currentUser === undefined) {
    return (
      <main className="shell access-shell">
        <section className="hero">
          <span className="hero-topline">Pulse access | carregando</span>
          <div className="hero-grid">
            <div>
              <h1>
                Abrindo o painel,
                <br />
                um instante.
              </h1>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!currentUser) {
    return <DemoAccess onSignIn={handleSignIn} />;
  }

  return (
    <AppWorkspace
      currentUser={currentUser}
      initialSnapshot={initialSnapshot}
      onSignOut={handleSignOut}
      readiness={readiness}
    />
  );
}
