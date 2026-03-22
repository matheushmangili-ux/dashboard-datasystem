import type { AccessPermissions, AuthUser, UserRole } from "@/lib/auth/types";

export const demoCredentials: Record<string, string> = {
  "admin": "admin",
  "ana.silva": "1234",
  "roberto.dias": "5678",
};

export const demoUsers: AuthUser[] = [
  {
    id: "uid-admin",
    name: "Administrador Global",
    role: "manager",
    title: "Diretor Geral",
    team: "Matriz",
    pin: "admin"
  },
  {
    id: "user-1",
    name: "Ana Ribeiro",
    title: "Gerente de operações",
    role: "manager",
    team: "Matriz",
    pin: "1234"
  },
  {
    id: "user-2",
    name: "Paulo Martins",
    title: "Supervisor comercial",
    role: "supervisor",
    team: "Comercial Sul",
    pin: "2345"
  },
  {
    id: "user-3",
    name: "Bruna Lima",
    title: "Operadora de atendimento",
    role: "operator",
    team: "Atendimento",
    pin: "3456"
  }
];

export function getRoleLabel(role: UserRole) {
  if (role === "manager") {
    return "Gestão";
  }

  if (role === "supervisor") {
    return "Supervisão";
  }

  return "Operação";
}

export function getPermissions(role: UserRole): AccessPermissions {
  if (role === "manager") {
    return {
      canViewFinancials: true,
      canViewRanking: true,
      canViewAlerts: true,
      canViewConnectorStatus: true,
      scope: "company"
    };
  }

  if (role === "supervisor") {
    return {
      canViewFinancials: true,
      canViewRanking: true,
      canViewAlerts: true,
      canViewConnectorStatus: true,
      scope: "team"
    };
  }

  return {
    canViewFinancials: false,
    canViewRanking: false,
    canViewAlerts: true,
    canViewConnectorStatus: false,
    scope: "team"
  };
}
