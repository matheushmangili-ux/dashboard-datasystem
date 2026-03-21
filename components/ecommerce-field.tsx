"use client";

import type { ReactNode } from "react";

import type { SalesChannelSnapshot } from "@/lib/types";

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  tone: "live" | "pending";
  icon: ReactNode;
}

const modules: ModuleCard[] = [
  {
    id: "results",
    title: "Resultados",
    subtitle: "Vendas e faturamento",
    status: "Pronto para ligar",
    tone: "live",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M3 13h4v8H3zm7-6h4v14h-4zm7 3h4v11h-4z" />
      </svg>
    )
  },
  {
    id: "traffic",
    title: "Tráfego",
    subtitle: "Visitantes e origem",
    status: "Em construção",
    tone: "pending",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M3 17h18v2H3zm2-2 4-5 4 3 5-7 3 2-7 9-4-3-3 4z" />
      </svg>
    )
  },
  {
    id: "keywords",
    title: "Palavras-chave",
    subtitle: "SEO e performance",
    status: "Em construção",
    tone: "pending",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M10 4a6 6 0 1 0 4.47 10.03l4.75 4.75 1.41-1.41-4.75-4.75A6 6 0 0 0 10 4z" />
      </svg>
    )
  },
  {
    id: "support",
    title: "Atendimento",
    subtitle: "Chats e tempo de resposta",
    status: "Em construção",
    tone: "pending",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M4 4h16v12H5.17L4 17.17V4z" />
      </svg>
    )
  },
  {
    id: "customers",
    title: "Clientes",
    subtitle: "Novos e recorrentes",
    status: "Em construção",
    tone: "pending",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h10v-2c0-1.66 1.33-3 3-3h3c1.67 0 3 1.34 3 3v2h5v-2c0-2.66-5.33-4-8-4H8z" />
      </svg>
    )
  },
  {
    id: "products",
    title: "Produtos",
    subtitle: "Performance e estoque",
    status: "Em construção",
    tone: "pending",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M21 16V8l-8-5-8 5v8l8 5 8-5z" />
      </svg>
    )
  }
];

export function EcommerceField({
  channel
}: {
  channel: SalesChannelSnapshot;
}) {
  return (
    <section className="ecommerce-shell">
      <div className="ecommerce-layout">
        <article className="ecommerce-brand-panel">
          <div className="ecommerce-brand-badge">Texas Center</div>
          <p className="section-eyebrow">TexCommerce</p>
          <h4 className="ecommerce-title">Relatórios estratégicos do e-commerce</h4>
          <p className="section-copy">
            Base visual reaproveitada do HTML enviado pelo colaborador, pronta
            para plugar indicadores, relatórios e atalhos reais da operação
            digital.
          </p>

          <div className="ecommerce-summary-grid">
            <div className="ecommerce-summary-card">
              <span>Receita</span>
              <strong>{channel.revenueLabel}</strong>
            </div>
            <div className="ecommerce-summary-card">
              <span>Pedidos</span>
              <strong>{channel.ordersLabel}</strong>
            </div>
            <div className="ecommerce-summary-card">
              <span>Ticket médio</span>
              <strong>{channel.averageTicketLabel}</strong>
            </div>
            <div className="ecommerce-summary-card">
              <span>Status</span>
              <strong>{channel.deltaLabel}</strong>
            </div>
          </div>

          <div className="ecommerce-brand-footer">
            <span className="connector-chip">{channel.sourceLabel}</span>
            <span className={`connector-health ${channel.health}`}>
              {channel.health}
            </span>
          </div>
        </article>

        <article className="ecommerce-modules-panel">
          <div className="ecommerce-modules-header">
            <div>
              <p className="section-eyebrow">Atalhos do canal</p>
              <h4 className="ecommerce-title ecommerce-title-small">
                Módulos do e-commerce
              </h4>
            </div>
            <button className="ecommerce-calc-button" type="button">
              Calculadora de parcelas
            </button>
          </div>

          <div className="ecommerce-module-grid">
            {modules.map((module) => (
              <button
                className="ecommerce-module-card"
                key={module.id}
                type="button"
              >
                <div className="ecommerce-module-top">
                  {module.icon}
                  <span className={`ecommerce-module-status ${module.tone}`}>
                    {module.status}
                  </span>
                </div>
                <strong>{module.title}</strong>
                <span className="ecommerce-module-subtitle">{module.subtitle}</span>
              </button>
            ))}
          </div>

          <p className="ecommerce-footer-note">
            Relatórios internos do e-commerce Texas Center.
          </p>
        </article>
      </div>
    </section>
  );
}
