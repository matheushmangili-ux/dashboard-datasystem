import { demoUsers } from "@/lib/auth/demo-users";

export const demoTeams = [
  {
    id: "team-1",
    name: "Comercial Sul",
    lead: "Paulo Martins",
    activePeople: 12,
    completion: 86,
    focus: "Meta diaria e ritmo por hora"
  },
  {
    id: "team-2",
    name: "Atendimento",
    lead: "Bruna Lima",
    activePeople: 18,
    completion: 93,
    focus: "Tempo medio e fila operacional"
  },
  {
    id: "team-3",
    name: "Matriz",
    lead: "Ana Ribeiro",
    activePeople: 9,
    completion: 102,
    focus: "Visao executiva e consolidado"
  }
];

export const demoPermissionChecklist = [
  {
    id: "permission-1",
    title: "Gestao visualiza indicadores financeiros",
    detail: "Receita, ticket medio, status de integracao e visao consolidada."
  },
  {
    id: "permission-2",
    title: "Supervisao acompanha ranking da propria equipe",
    detail: "Ranking e alertas filtrados pelo time do perfil conectado."
  },
  {
    id: "permission-3",
    title: "Operacao enxerga apenas o necessario",
    detail: "Cards essenciais e alertas do dia, sem exposicao de dados sensiveis."
  }
];

export const demoRolloutSteps = [
  "Definir como os colaboradores vao entrar no sistema",
  "Receber acesso da API ou do banco do Data System",
  "Mapear metas, realizado, ranking e alertas",
  "Trocar o login demo por autenticacao real",
  "Subir a versao piloto para uma equipe"
];

export function getDemoUserCountByRole() {
  return {
    managers: demoUsers.filter((user) => user.role === "manager").length,
    supervisors: demoUsers.filter((user) => user.role === "supervisor").length,
    operators: demoUsers.filter((user) => user.role === "operator").length
  };
}
