"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

import { AppWorkspace } from "@/components/app-workspace";
import { demoUsers } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";
import type { IntegrationReadiness } from "@/lib/erp/contracts";
import type { DashboardSnapshot } from "@/lib/types";

const STORAGE_KEY = "pulse-dashboard-session";

const LOGO_URL =
  "https://images.tcdn.com.br/files/548537/themes/757/img/settings/logo.png?45076445528a6de8946fee0b2dd90ccc";

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

function LoginScreen({
  onSignIn
}: {
  onSignIn: (user: AuthUser) => void;
}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!login.trim() || !password.trim()) {
      setErrorMessage("Preencha o login e a senha.");
      return;
    }

    const matchedUser = demoUsers.find(
      (user) =>
        (user.name.toLowerCase() === login.trim().toLowerCase() ||
          user.id === login.trim()) &&
        user.pin === password.trim()
    );

    if (!matchedUser) {
      setErrorMessage("Login ou senha invalidos.");
      return;
    }

    setErrorMessage(null);
    onSignIn(matchedUser);
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <Image
              src={LOGO_URL}
              alt="Texas Center"
              className="login-logo"
              width={220}
              height={96}
              priority
            />
            <h1 className="login-welcome">
              Seja bem-vindo ao
              <br />
              Texas Center Dashboard
            </h1>
            <p className="login-brand-copy">
              Acompanhe os resultados da operacao em tempo real.
              Loja fisica e e-commerce em um so lugar.
            </p>
          </div>
        </div>

        <div className="login-form-panel">
          <article className="login-form-card">
            <div className="login-form-header">
              <Image
                src={LOGO_URL}
                alt="Texas Center"
                className="login-logo-small"
                width={120}
                height={52}
                priority
              />
              <p className="section-eyebrow">Acesso ao painel</p>
              <h2 className="login-form-title">Entrar</h2>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field-block">
                <span>Login</span>
                <input
                  className="field-input"
                  onChange={(event) => setLogin(event.target.value)}
                  placeholder="Digite seu login"
                  type="text"
                  value={login}
                  autoComplete="username"
                />
              </label>

              <label className="field-block">
                <span>Senha</span>
                <input
                  className="field-input"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                />
              </label>

              {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

              <button className="primary-button login-button" type="submit">
                Entrar
              </button>
            </form>

            <p className="login-hint">
              Use o nome do colaborador como login e o PIN como senha.
            </p>
          </article>

          <footer className="login-footer">
            <span>Desenvolvido por: matheusmangili</span>
          </footer>
        </div>
      </div>
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
      <main className="login-page">
        <div className="login-loading">
          <Image
            src={LOGO_URL}
            alt="Texas Center"
            className="login-logo"
            width={220}
            height={96}
            priority
          />
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return <LoginScreen onSignIn={handleSignIn} />;
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
