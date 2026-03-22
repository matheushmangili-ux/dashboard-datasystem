import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function KpiCard({
  label,
  value,
  caption,
  delta,
  deltaLabel,
  loading
}: {
  label: string;
  value: string;
  caption: string;
  delta?: number;
  deltaLabel?: string;
  loading?: boolean;
}) {
  const isPositive = delta && delta > 0;
  const isNegative = delta && delta < 0;

  return (
    <div className={`p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${loading ? "opacity-50" : "opacity-100"}`}>
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground uppercase">
          {label}
        </h3>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-3xl font-bold font-heading tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground">{caption}</p>
        
        {(deltaLabel || (delta !== undefined && delta !== 0)) && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/50 text-xs">
            {isPositive && <ArrowUpRight className="w-4 h-4 text-success" />}
            {isNegative && <ArrowDownRight className="w-4 h-4 text-destructive" />}
            {!isPositive && !isNegative && <Minus className="w-4 h-4 text-muted-foreground" />}
            
            {delta !== undefined && (
              <span className={isPositive ? "text-success font-semibold" : isNegative ? "text-destructive font-semibold" : "text-muted-foreground font-semibold"}>
                {Math.abs(delta)}%
              </span>
            )}
            <span className="text-muted-foreground">{deltaLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
