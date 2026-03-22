"use client";

import Image from "next/image";
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
    subtitle: "Vendas e faturacao",
    status: "Pronto a usar",
    tone: "live",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M3 13h4v8H3zm7-6h4v14h-4zm7 3h4v11h-4z" />
      </svg>
    )
  },
  {
    id: "traffic",
    title: "Trafego",
    subtitle: "Visitantes e origem",
    status: "Em construcao",
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
    status: "Em construcao",
    tone: "pending",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M10 4a6 6 0 1 0 4.47 10.03l4.75 4.75 1.41-1.41-4.75-4.75A6 6 0 0 0 10 4z" />
      </svg>
    )
  },
  {
    id: "support",
    title: "Apoio ao Cliente",
    subtitle: "Chats e tempo de resposta",
    status: "Em construcao",
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
    status: "Em construcao",
    tone: "pending",
    icon: (
      <svg aria-hidden="true" className="ecommerce-module-icon" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h10v-2c0-1.66 1.33-3 3-3h3c1.67 0 3 1.34 3 3v2h5v-2c0-2.66-5.33-4-8-4H8z" />
      </svg>
    )
  },
  {
    id: "products",
    title: "Artigos",
    subtitle: "Performance e stock",
    status: "Em construcao",
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
          <Image
            src="/western-desert.svg"
            alt=""
            aria-hidden="true"
            width={1440}
            height={320}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "auto",
              opacity: 0.1,
              pointerEvents: "none"
            }}
          />
          <Image
            src="/western-corner.svg"
            alt=""
            aria-hidden="true"
            width={120}
            height={120}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "auto",
              opacity: 0.15,
              pointerEvents: "none"
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="ecommerce-brand-badge">Texas Center</div>
            <p className="section-eyebrow" style={{ marginTop: "16px" }}>
              TexCommerce
            </p>
            <h4 className="ecommerce-title">Relatorios estrategicos do e-commerce</h4>
            <p className="section-copy">
              Base visual reaproveitada do HTML enviado, pronta para plugar
              indicadores, relatorios e atalhos reais da operacao digital.
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
                <span>Ticket medio</span>
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
          </div>
        </article>

        <article className="ecommerce-modules-panel">
          <div className="ecommerce-modules-header">
            <div>
              <p className="section-eyebrow">Atalhos do canal</p>
              <h4 className="ecommerce-title ecommerce-title-small">
                Modulos do e-commerce
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
            Relatorios internos do e-commerce Texas Center.
          </p>
        </article>
      </div>
    </section>
  );
}
