import { getRoleLabel, getPermissions } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";
import {
  demoPermissionChecklist,
  demoRolloutSteps,
  demoTeams,
  getDemoUserCountByRole
} from "@/lib/admin/demo-admin-data";
import type { IntegrationReadiness } from "@/lib/erp/contracts";

export function AdminWorkspace({
  currentUser,
  readiness
}: {
  currentUser: AuthUser;
  readiness: IntegrationReadiness;
}) {
  const counts = getDemoUserCountByRole();
  const permissions = getPermissions(currentUser.role);

  return (
    <section className="admin-layout">
      <article className="card admin-panel admin-overview">
        <div className="panel-header">
          <div>
            <p className="section-eyebrow">Administração</p>
            <h2 className="section-title">Operação pronta para crescer</h2>
          </div>
          <span className="role-badge">{getRoleLabel(currentUser.role)}</span>
        </div>

        <p className="section-copy">
          Esta área organiza usuários, equipes, permissões e prontidão da
          integração antes mesmo do acesso oficial ao ERP.
        </p>

        <div className="admin-stat-grid">
          <div className="admin-stat">
            <span>Perfis de gestão</span>
            <strong>{counts.managers}</strong>
          </div>
          <div className="admin-stat">
            <span>Perfis de supervisão</span>
            <strong>{counts.supervisors}</strong>
          </div>
          <div className="admin-stat">
            <span>Perfis operacionais</span>
            <strong>{counts.operators}</strong>
          </div>
          <div className="admin-stat">
            <span>Modo de integração</span>
            <strong>{readiness.activeMode}</strong>
          </div>
        </div>
      </article>

      <article className="card admin-panel">
        <div className="panel-header">
          <div>
            <p className="section-eyebrow">Equipes</p>
            <h2 className="section-title">Estrutura piloto</h2>
          </div>
        </div>

        <div className="team-grid">
          {demoTeams.map((team) => (
            <div className="team-card" key={team.id}>
              <div className="team-top">
                <div>
                  <strong>{team.name}</strong>
                  <p>{team.lead}</p>
                </div>
                <span className="team-rate">{team.completion}%</span>
              </div>
              <p className="team-focus">{team.focus}</p>
              <div className="team-meta">
                <span>{team.activePeople} pessoas ativas</span>
                <span>{team.completion >= 100 ? "Acima da meta" : "Em evolução"}</span>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="card admin-panel">
        <div className="panel-header">
          <div>
            <p className="section-eyebrow">Permissões</p>
            <h2 className="section-title">Regra por papel</h2>
          </div>
        </div>

        <div className="permission-list">
          {demoPermissionChecklist.map((item) => (
            <div className="permission-item" key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="permission-summary">
          <span>
            Financeiro: {permissions.canViewFinancials ? "liberado" : "restrito"}
          </span>
          <span>Ranking: {permissions.canViewRanking ? "liberado" : "restrito"}</span>
          <span>Alertas: {permissions.canViewAlerts ? "liberado" : "restrito"}</span>
        </div>
      </article>

      <article className="card admin-panel">
        <div className="panel-header">
          <div>
            <p className="section-eyebrow">Integração</p>
            <h2 className="section-title">Prontidão técnica</h2>
          </div>
        </div>

        <p className="section-copy">{readiness.summary}</p>

        <div className="connector-list">
          {readiness.connectors.map((connector) => (
            <div className="connector-item" key={connector.name}>
              <div className="connector-heading">
                <strong>{connector.name}</strong>
                <span className={`connector-health ${connector.health}`}>
                  {connector.health}
                </span>
              </div>
              <p>{connector.detail}</p>
              <div className="connector-requirements">
                {connector.requirements.map((requirement) => (
                  <span className="connector-chip" key={requirement}>
                    {requirement}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="card admin-panel">
        <div className="panel-header">
          <div>
            <p className="section-eyebrow">Implantação</p>
            <h2 className="section-title">Checklist de rollout</h2>
          </div>
        </div>

        <div className="rollout-list">
          {demoRolloutSteps.map((step, index) => (
            <div className="rollout-item" key={step}>
              <span className="rollout-index">{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
