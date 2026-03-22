"use client";

import { useId } from "react";

interface GoalGaugeProps {
  percent: number;
  label: string;
  value: string;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(value, 100));
}

export function GoalGauge({ percent, label, value }: GoalGaugeProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const safePercent = clampPercent(percent);
  const offset = circumference - (safePercent / 100) * circumference;
  const gradientId = useId().replace(/:/g, "");

  return (
    <article className="card-tech goal-gauge-card">
      <div
        className="goal-ring-container"
        role="img"
        aria-label={`${label}: ${Math.round(percent)}% atingido`}
      >
        <svg width="120" height="120" className="goal-ring-svg" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={radius} className="goal-ring-track" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="goal-ring-progress"
            style={{
              stroke: `url(#${gradientId})`,
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }}
          />
        </svg>

        <div className="goal-ring-copy">
          <span className="goal-ring-percent">{Math.round(percent)}%</span>
          <span className="goal-ring-caption">Atingido</span>
        </div>
      </div>

      <div className="goal-gauge-meta">
        <p className="goal-gauge-label">{label}</p>
        <p className="goal-gauge-value">{value}</p>
      </div>
    </article>
  );
}
