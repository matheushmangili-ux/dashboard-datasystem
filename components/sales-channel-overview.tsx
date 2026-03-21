"use client";

import { useMemo, useState } from "react";

import { EcommerceField } from "@/components/ecommerce-field";
import { TrendChart } from "@/components/trend-chart";
import type { SalesChannelId, SalesChannelSnapshot } from "@/lib/types";

export function SalesChannelOverview({
  channels
}: {
  channels: SalesChannelSnapshot[];
}) {
  const [activeChannel, setActiveChannel] = useState<SalesChannelId>("physical");

  const currentChannel = useMemo(
    () =>
      channels.find((channel) => channel.id === activeChannel) ??
      channels[0],
    [activeChannel, channels]
  );

  if (!currentChannel) {
    return null;
  }

  return (
    <section className="card channel-panel">
      <div className="panel-header">
        <div>
          <p className="section-eyebrow">Canais de venda</p>
          <h2 className="section-title">Loja física x E-commerce</h2>
        </div>

        <div className="tab-row">
          {channels.map((channel) => (
            <button
              className={`tab-button ${channel.id === currentChannel.id ? "active" : ""}`}
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              type="button"
            >
              {channel.label}
            </button>
          ))}
        </div>
      </div>

      <div className="channel-layout">
        <div className="channel-selector-list">
          {channels.map((channel) => {
            const active = channel.id === currentChannel.id;

            return (
              <button
                className={`channel-selector ${active ? "active" : ""}`}
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                type="button"
              >
                <div className="channel-selector-top">
                  <strong>{channel.label}</strong>
                  <span className={`connector-health ${channel.health}`}>
                    {channel.health}
                  </span>
                </div>
                <p>{channel.description}</p>
                <div className="channel-selector-metrics">
                  <div className="channel-selector-badge">
                    <small>Receita</small>
                    <strong>{channel.revenueLabel}</strong>
                  </div>
                  <div className="channel-selector-badge">
                    <small>Pedidos</small>
                    <strong>{channel.ordersLabel}</strong>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="channel-detail-card">
          <div className="channel-detail-header">
            <div>
              <p className="section-eyebrow">Painel do canal</p>
              <h3 className="channel-title">{currentChannel.label}</h3>
            </div>
            <span className="connector-chip">{currentChannel.sourceLabel}</span>
          </div>

          {currentChannel.id === "ecommerce" ? (
            <EcommerceField channel={currentChannel} />
          ) : (
            <div className="channel-feature-grid">
              <article className="channel-visual-card channel-preview-card">
                <div className="channel-preview-top">
                  <span className="channel-preview-pill active">Operação presencial</span>
                  <span className="channel-preview-pill">{currentChannel.sourceLabel}</span>
                </div>

                <div className="channel-preview-summary">
                  <strong>{currentChannel.revenueLabel}</strong>
                  <p>{currentChannel.description}</p>
                </div>

                <div className="channel-preview-columns">
                  <div className="channel-preview-mini">
                    <span>Pedidos</span>
                    <strong>{currentChannel.ordersLabel}</strong>
                  </div>
                  <div className="channel-preview-mini">
                    <span>Ticket médio</span>
                    <strong>{currentChannel.averageTicketLabel}</strong>
                  </div>
                  <div className="channel-preview-mini">
                    <span>Status</span>
                    <strong>{currentChannel.deltaLabel}</strong>
                  </div>
                </div>
              </article>

              <article className="channel-insight-card">
                <div className="channel-copy-wrap">
                  <p className="section-copy">{currentChannel.description}</p>
                  <div className="channel-source-row">
                    <span className="connector-chip">{currentChannel.sourceLabel}</span>
                    <span className={`connector-health ${currentChannel.health}`}>
                      {currentChannel.health}
                    </span>
                  </div>
                </div>
                <div className="channel-stat-grid">
                  <div className="channel-stat">
                    <span>Receita</span>
                    <strong>{currentChannel.revenueLabel}</strong>
                  </div>
                  <div className="channel-stat">
                    <span>Pedidos</span>
                    <strong>{currentChannel.ordersLabel}</strong>
                  </div>
                  <div className="channel-stat">
                    <span>Ticket médio</span>
                    <strong>{currentChannel.averageTicketLabel}</strong>
                  </div>
                  <div className="channel-stat channel-stat-status">
                    <span>Status</span>
                    <strong>{currentChannel.deltaLabel}</strong>
                  </div>
                </div>
              </article>
            </div>
          )}

          {currentChannel.trendPoints.length > 0 ? (
            <TrendChart points={currentChannel.trendPoints} />
          ) : (
            <div className="channel-empty">
              Este canal ainda não retornou tendência histórica.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
