export type SourceHealth = "connected" | "fallback" | "missing-config";
export type ErpMode = "mock" | "api" | "database" | "hybrid";
export type SalesChannelId = "physical" | "ecommerce";

export interface DashboardSource {
  mode: ErpMode;
  label: string;
  health: SourceHealth;
  detail: string;
}

export interface DashboardSummary {
  companyName: string;
  periodLabel: string;
  activeEmployees: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  caption: string;
  delta: number;
  deltaLabel: string;
}

export interface TrendPoint {
  label: string;
  value: number;
  target: number;
  displayValue: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  team: string;
  displayValue: string;
  status: string;
}

export interface ChannelLeaderboard {
  channelId: SalesChannelId;
  title: string;
  leaders: LeaderboardEntry[];
}

export interface ProductRankingEntry {
  id: string;
  name: string;
  channelLabel: string;
  unitsSold: number;
  revenueLabel: string;
  statusLabel: string;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
}

export interface SalesChannelSnapshot {
  id: SalesChannelId;
  label: string;
  description: string;
  sourceLabel: string;
  health: SourceHealth;
  revenueLabel: string;
  ordersLabel: string;
  averageTicketLabel: string;
  deltaLabel: string;
  trendPoints: TrendPoint[];
}

export interface DashboardSnapshot {
  generatedAt: string;
  source: DashboardSource;
  summary: DashboardSummary;
  metrics: MetricCard[];
  salesChannels: SalesChannelSnapshot[];
  trendPoints: TrendPoint[];
  leaders: LeaderboardEntry[];
  channelLeaderboards: ChannelLeaderboard[];
  topProducts: ProductRankingEntry[];
  lowProducts: ProductRankingEntry[];
  alerts: AlertItem[];
}
