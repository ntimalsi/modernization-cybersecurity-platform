import * as React from "react";

type Service = {
  id: string;
  name: string;
  owner: string;
  tier: "tier0" | "tier1" | "tier2";
  backupsTested: boolean;
  drPlan: boolean;
  redundancy: "none" | "partial" | "full";
  rtoHours: number; // target recovery time objective
  lastTabletop: string;
};

const mockServices: Service[] = [
  { id: "s-1", name: "E911 Call Routing", owner: "Public Safety IT", tier: "tier0", backupsTested: true, drPlan: true, redundancy: "full", rtoHours: 1, lastTabletop: "2025-11-15" },
  { id: "s-2", name: "Student Information System", owner: "App Team", tier: "tier1", backupsTested: true, drPlan: false, redundancy: "partial", rtoHours: 8, lastTabletop: "2025-10-01" },
  { id: "s-3", name: "Payroll Processing", owner: "Finance IT", tier: "tier1", backupsTested: false, drPlan: false, redundancy: "none", rtoHours: 24, lastTabletop: "2025-06-12" },
  { id: "s-4", name: "Public Web Portal", owner: "Platform Team", tier: "tier2", backupsTested: true, drPlan: true, redundancy: "partial", rtoHours: 12, lastTabletop: "2025-09-20" }
];

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle && <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>}
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 800 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function readinessScore(s: Service) {
  let score = 0;
  score += s.backupsTested ? 30 : 0;
  score += s.drPlan ? 25 : 0;
  score += s.redundancy === "full" ? 25 : s.redundancy === "partial" ? 12 : 0;

  // RTO penalty: faster is better
  if (s.rtoHours <= 2) score += 20;
  else if (s.rtoHours <= 8) score += 10;
  else score += 3;

  return Math.round(Math.max(0, Math.min(100, score)));
}

function pill(text: string, color: string) {
  return (
    <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color }}>
      {text}
    </span>
  );
}

export default function ResilienceContinuityPage() {
  const [owner, setOwner] = React.useState("all");
  const [tier, setTier] = React.useState<Service["tier"] | "all">("all");

  const owners = React.useMemo(() => Array.from(new Set(mockServices.map((x) => x.owner))), []);
  const rows = mockServices.filter((x) => (owner === "all" ? true : x.owner === owner)).filter((x) => (tier === "all" ? true : x.tier === tier));

  const avgScore = rows.length ? Math.round(rows.reduce((a, x) => a + readinessScore(x), 0) / rows.length) : 0;
  const tier0 = rows.filter((x) => x.tier === "tier0").length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Resilience & Continuity"
        subtitle="Continuity-of-operations readiness for critical services: backups tested, DR plans, redundancy, and recovery objectives. This is a national-importance capability for education and public safety."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Services tracked" value={String(rows.length)} />
          <KPI label="Avg readiness score" value={`${avgScore}/100`} />
          <KPI label="Tier-0 services" value={String(tier0)} />
          <KPI label="Not DR-ready" value={String(rows.filter((x) => !x.drPlan || !x.backupsTested).length)} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <select value={owner} onChange={(e) => setOwner(e.target.value)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All owners</option>
            {owners.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <select value={tier} onChange={(e) => setTier(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All tiers</option>
            <option value="tier0">Tier 0 (mission-critical)</option>
            <option value="tier1">Tier 1</option>
            <option value="tier2">Tier 2</option>
          </select>

          <button
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
            onClick={() => alert("Demo: generate continuity backlog + tabletop schedule + funding plan (coming next).")}
          >
            Generate Continuity Plan (Demo)
          </button>
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Service</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Tier</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Backups Tested</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>DR Plan</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Redundancy</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>RTO</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Readiness</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Last Tabletop</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const score = readinessScore(s);
                const statusPill = score >= 80 ? pill("Good", "#16a34a") : score >= 55 ? pill("Needs work", "#d97706") : pill("High risk", "#dc2626");
                return (
                  <tr key={s.id}>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{s.name}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.owner}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.tier}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.backupsTested ? "✅" : "❌"}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.drPlan ? "✅" : "❌"}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.redundancy}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.rtoHours}h</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontWeight: 900 }}>{score}/100</span>
                        {statusPill}
                      </div>
                    </td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.lastTabletop}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Recommended Actions (demo)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Require DR plans and backup testing for Tier-0 and Tier-1 services.</li>
            <li>Track redundancy as a modernization metric (not just a security metric).</li>
            <li>Use dependency mapping to validate recovery order and reduce outage risk.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
