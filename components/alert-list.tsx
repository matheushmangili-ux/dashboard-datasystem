import type { AlertItem } from "@/lib/types";

export function AlertList({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="alerts-list">
      {alerts.map((alert) => (
        <article className="alert-row" key={alert.id}>
          <span className={`alert-marker ${alert.severity}`} aria-hidden="true" />
          <div>
            <p className="alert-title">{alert.title}</p>
            <p className="alert-message">{alert.message}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
