"use client";

import { useMemo, useState } from "react";

import type {
  ChannelLeaderboard,
  ProductRankingEntry,
  SalesChannelSnapshot
} from "@/lib/types";

function ProductList({
  items
}: {
  items: ProductRankingEntry[];
}) {
  return (
    <div className="product-list">
      {items.map((item, index) => (
        <article className="product-row" key={item.id}>
          <div className="product-index">{index + 1}</div>
          <div className="product-copy">
            <p className="product-name">{item.name}</p>
            <p className="product-channel">{item.channelLabel}</p>
          </div>
          <div className="product-metric">
            <p className="product-units">{item.unitsSold} un</p>
            <p className="product-revenue">{item.revenueLabel}</p>
            <p className="product-status">{item.statusLabel}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PerformanceHub({
  channelLeaderboards,
  topProducts,
  lowProducts,
  channels
}: {
  channelLeaderboards: ChannelLeaderboard[];
  topProducts: ProductRankingEntry[];
  lowProducts: ProductRankingEntry[];
  channels: SalesChannelSnapshot[];
}) {
  const [activeLeaderboardId, setActiveLeaderboardId] = useState(
    channelLeaderboards[0]?.channelId ?? "physical"
  );
  const [activeProductTab, setActiveProductTab] = useState<"top" | "low">("top");

  const activeLeaderboard = useMemo(
    () =>
      channelLeaderboards.find((item) => item.channelId === activeLeaderboardId) ??
      channelLeaderboards[0],
    [activeLeaderboardId, channelLeaderboards]
  );

  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === activeLeaderboardId) ?? channels[0],
    [activeLeaderboardId, channels]
  );

  return (
    <section className="performance-section">
      <div className="performance-headline">
        <div>
          <p className="section-eyebrow">Performance</p>
          <h2 className="section-title">Colaboradores e produtos em foco</h2>
        </div>
        <p className="section-copy premium-copy">
          Os rankings agora ficam agrupados em um painel mais limpo, com alternância
          rápida entre loja física, e-commerce e giro de produtos.
        </p>
      </div>

      <div className="performance-grid">
        <article className="card performance-card">
          <div className="performance-card-header">
            <div>
              <p className="section-eyebrow">Colaboradores</p>
              <h3 className="performance-title">
                {activeLeaderboard?.title ?? "Top colaboradores"}
              </h3>
            </div>
            <div className="tab-row">
              {channelLeaderboards.map((item) => (
                <button
                  className={`tab-button ${item.channelId === activeLeaderboardId ? "active" : ""}`}
                  key={item.channelId}
                  onClick={() => setActiveLeaderboardId(item.channelId)}
                  type="button"
                >
                  {item.channelId === "physical" ? "Loja física" : "E-commerce"}
                </button>
              ))}
            </div>
          </div>

          <div className="performance-channel-strip">
            <span className={`connector-health ${activeChannel?.health ?? "fallback"}`}>
              {activeChannel?.health ?? "fallback"}
            </span>
            <span className="connector-chip">
              {activeChannel?.sourceLabel ?? "Sem origem"}
            </span>
          </div>

          <div className="leaders-list compact">
            {activeLeaderboard?.leaders.map((leader) => (
              <div className="leader-row compact" key={leader.id}>
                <div className="leader-rank">{leader.rank}</div>
                <div>
                  <p className="leader-name">{leader.name}</p>
                  <p className="leader-team">{leader.team}</p>
                </div>
                <div>
                  <p className="leader-value">{leader.displayValue}</p>
                  <p className="leader-status">{leader.status}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card performance-card">
          <div className="performance-card-header">
            <div>
              <p className="section-eyebrow">Produtos</p>
              <h3 className="performance-title">
                {activeProductTab === "top"
                  ? "Top 5 mais vendidos"
                  : "Top 5 menos vendidos"}
              </h3>
            </div>
            <div className="tab-row">
              <button
                className={`tab-button ${activeProductTab === "top" ? "active" : ""}`}
                onClick={() => setActiveProductTab("top")}
                type="button"
              >
                Mais vendidos
              </button>
              <button
                className={`tab-button ${activeProductTab === "low" ? "active" : ""}`}
                onClick={() => setActiveProductTab("low")}
                type="button"
              >
                Menos vendidos
              </button>
            </div>
          </div>

          <ProductList items={activeProductTab === "top" ? topProducts : lowProducts} />
        </article>
      </div>
    </section>
  );
}
