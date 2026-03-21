import type { LeaderboardEntry } from "@/lib/types";

export function Leaderboard({ leaders }: { leaders: LeaderboardEntry[] }) {
  return (
    <div className="leaders-list">
      {leaders.map((leader) => (
        <article className="leader-row" key={leader.id}>
          <div className="leader-rank">{leader.rank}</div>
          <div>
            <p className="leader-name">{leader.name}</p>
            <p className="leader-team">{leader.team}</p>
          </div>
          <div>
            <p className="leader-value">{leader.displayValue}</p>
            <p className="leader-status">{leader.status}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

