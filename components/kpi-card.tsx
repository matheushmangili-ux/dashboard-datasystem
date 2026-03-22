import type { MetricCard } from "@/lib/types";

function getMetricTone(delta: number) {
  if (delta > 0) {
    return "metric-tone-positive";
  }

  if (delta === 0 || delta > -5) {
    return "metric-tone-neutral";
  }

  return "metric-tone-warning";
}

export function KpiCard({
  metric,
  loading
}: {
  metric: MetricCard;
  loading?: boolean;
}) {
  return (
    <article className={`kpi-card card animate-tech ${loading ? "is-loading" : ""}`}>
      <p className="kpi-label">{metric.label}</p>
      <p className="kpi-value">{metric.value}</p>
      <div className="kpi-footer">
        <span>{metric.caption}</span>
        <span className={getMetricTone(metric.delta)}>{metric.deltaLabel}</span>
      </div>
    </article>
  );
}
