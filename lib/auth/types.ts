export type UserRole = "manager" | "supervisor" | "operator";

export interface AuthUser {
  id: string;
  name: string;
  title: string;
  role: UserRole;
  team: string;
  pin: string;
}

export interface AccessPermissions {
  canViewFinancials: boolean;
  canViewRanking: boolean;
  canViewAlerts: boolean;
  canViewConnectorStatus: boolean;
  scope: "company" | "team";
}

