"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Dashboard error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="shell access-shell">
          <section className="hero">
            <span className="hero-topline">Pulse | erro</span>
            <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <h1>
                  Algo deu errado,
                  <br />
                  mas estamos aqui.
                </h1>
                <p>
                  O painel encontrou um problema inesperado. Tente recarregar a
                  página. Se o erro persistir, entre em contato com o suporte.
                </p>
                {this.state.errorMessage ? (
                  <p style={{ opacity: 0.6, fontSize: "0.88rem", marginTop: 12 }}>
                    Detalhe: {this.state.errorMessage}
                  </p>
                ) : null}
                <button
                  className="primary-button"
                  onClick={() => window.location.reload()}
                  style={{ marginTop: 24 }}
                  type="button"
                >
                  Recarregar página
                </button>
              </div>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
