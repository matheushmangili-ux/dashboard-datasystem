import { demoUsers } from "@/lib/auth/demo-users";

export const demoTeams = [
  {
    id: "team-1",
    name: "Comercial Sul",
    lead: "Paulo Martins",
    activePeople: 12,
    completion: 86,
    focus: "Meta diária e ritmo por hora"
  },
  {
    id: "team-2",
    name: "Atendimento",
    lead: "Bruna Lima",
    activePeople: 18,
    completion: 93,
    focus: "Tempo médio e fila operacional"
  },
  {
    id: "team-3",
    name: "Matriz",
    lead: "Ana Ribeiro",
    activePeople: 9,
    completion: 102,
    focus: "Visão executiva e consolidado"
  }
];

export const demoPermissionChecklist = [
  {
    id: "permission-1",
    title: "Gestão visualiza indicadores financeiros",
    detail: "Receita, ticket médio, status de integração e visão consolidada."
  },
  {
    id: "permission-2",
    title: "Supervisão acompanha ranking da própria equipe",
    detail: "Ranking e alertas filtrados pelo time do perfil conectado."
  },
  {
    id: "permission-3",
    title: "Operação enxerga apenas o necessário",
    detail: "Cards essenciais e alertas do dia, sem exposição de dados sensíveis."
  }
];

export const demoRolloutSteps = [
  "Definir como os colaboradores vão entrar no sistema",
  "Receber acesso da API ou do banco do Data System",
  "Mapear metas, realizado, ranking e alertas",
  "Trocar o login demo por autenticação real",
  "Subir a versão piloto para uma equipe"
];

export function getDemoUserCountByRole() {
  return {
    managers: demoUsers.filter((user) => user.role === "manager").length,
    supervisors: demoUsers.filter((user) => user.role === "supervisor").length,
    operators: demoUsers.filter((user) => user.role === "operator").length
  };
}
