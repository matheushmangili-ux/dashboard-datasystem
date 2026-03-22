"use client";

import { useEffect, useMemo, useState } from "react";

const DASHBOARD_TIMEZONE = "America/Sao_Paulo";

function formatDateTime(date: Date) {
  const weekdayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    timeZone: DASHBOARD_TIMEZONE
  }).format(date);

  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: DASHBOARD_TIMEZONE
  }).format(date);

  const timeLabel = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: DASHBOARD_TIMEZONE
  }).format(date);

  return {
    dateLabel: `${weekdayLabel}, ${dateLabel}`,
    timeLabel
  };
}

export function DashboardClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const { dateLabel, timeLabel } = useMemo(() => formatDateTime(now), [now]);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <p className="text-2xl font-bold font-mono tracking-tight text-foreground">{timeLabel}</p>
      <p className="text-xs text-muted-foreground font-medium capitalize">{dateLabel}</p>
    </div>
  );
}
