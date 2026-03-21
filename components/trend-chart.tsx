import type { TrendPoint } from "@/lib/types";

export function TrendChart({ points }: { points: TrendPoint[] }) {
  const maxValue = Math.max(
    ...points.flatMap((point) => [point.value, point.target]),
    1
  );

  return (
    <div className="chart" role="img" aria-label="Gráfico de desempenho do dia">
      {points.map((point) => {
        const valueHeight = `${(point.value / maxValue) * 100}%`;
        const targetHeight = `${(point.target / maxValue) * 100}%`;

        return (
          <div className="chart-column" key={point.label}>
            <div className="chart-bar-wrap">
              <div
                className="chart-bar-target"
                style={{ height: targetHeight }}
                aria-hidden="true"
              />
              <div
                className="chart-bar-value"
                style={{ height: valueHeight }}
                aria-hidden="true"
              />
            </div>
            <span className="chart-number">{point.displayValue}</span>
            <span className="chart-label">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}
