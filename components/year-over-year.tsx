"use client";

import type { YearOverYearItem } from "@/lib/types";

function TrendArrow({ trend }: { trend: YearOverYearItem["trend"] }) {
  if (trend === "up") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 3v10M8 3l4 4M8 3L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (trend === "down") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M8 13l4-4M8 13l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function YearOverYearSection({ items }: { items: YearOverYearItem[] }) {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  return (
    <section className="card yoy-section">
      <div className="yoy-header">
        <div>
          <p className="section-eyebrow">Comparativo anual</p>
          <h2 className="section-title">
            {currentYear} vs {previousYear}
          </h2>
          <p className="section-copy">
            Evolução dos principais indicadores em relação ao ano anterior.
          </p>
        </div>
      </div>

      <div className="yoy-grid">
        {items.map((item) => (
          <div className="yoy-card" key={item.id}>
            <p className="yoy-label">{item.label}</p>
            <div className="yoy-values">
              <div className="yoy-current">
                <span className="yoy-year">{currentYear}</span>
                <strong className="yoy-value">{item.currentValue}</strong>
              </div>
              <div className="yoy-previous">
                <span className="yoy-year">{previousYear}</span>
                <span className="yoy-value muted">{item.previousValue}</span>
              </div>
            </div>
            <div className={`yoy-delta ${item.trend}`}>
              <TrendArrow trend={item.trend} />
              <span>
                {item.deltaPercent >= 0 ? "+" : ""}
                {item.deltaPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
