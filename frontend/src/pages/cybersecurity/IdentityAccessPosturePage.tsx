import * as React from "react";

type AccountRow = {
  id: string;
  system: string;
  owner: string;
  mfaCoveragePct: number;
  ssoEnabled: boolean;
  privilegedAccounts: number;
  stalePrivilegedAccounts: number;
  serviceAccounts: number;
  lastReviewed: string;
};

const mockIdentity: AccountRow[] = [
  {
    id: "iam-1",
    system: "SSO / IdP",
    owner: "IAM",
    mfaCoveragePct: 92,
    ssoEnabled: true,
    privilegedAccounts: 48,
    stalePrivilegedAccounts: 6,
    serviceAccounts: 22,
    lastReviewed: "2025-12-10"
  },
  {
    id: "iam-2",
    system: "Cloud IAM",
    owner: "Platform Team",
    mfaCoveragePct: 78,
    ssoEnabled: true,
    privilegedAccounts: 36,
    stalePrivilegedAccounts: 8,
    serviceAccounts: 41,
    lastReviewed: "2025-11-22"
  },
  {
    id: "iam-3",
    system: "Legacy Admin Console",
    owner: "Facilities IT",
    mfaCoveragePct: 25,
    ssoEnabled: false,
    privilegedAccounts: 12,
    stalePrivilegedAccounts: 5,
    serviceAccounts: 2,
    lastReviewed: "2025-10-01"
  }
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

function riskLabel(score: number) {
  if (score >= 80) return { label: "Low", color: "#16a34a" };
  if (score >= 55) return { label: "Medium", color: "#d97706" };
  return { label: "High", color: "#dc2626" };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function IdentityAccessPosturePage() {
  const [owner, setOwner] = React.useState("all");

  const owners = React.useMemo(() => Array.from(new Set(mockIdentity.map((r) => r.owner))), []);
  const rows = mockIdentity.filter((r) => (owner === "all" ? true : r.owner === owner));

  // Simple "Identity Risk Score" demo heuristic (0–100 = better)
  const score = React.useMemo(() => {
    if (!rows.length) return 0;
    const avgMfa = rows.reduce((a, r) => a + r.mfaCoveragePct, 0) / rows.length;
    const stalePriv = rows.reduce((a, r) => a + r.stalePrivilegedAccounts, 0);
    const priv = rows.reduce((a, r) => a + r.privilegedAccounts, 0);
    const ssoPenalty = rows.filter((r) => !r.ssoEnabled).length * 10;

    const staleRate = priv ? (stalePriv / priv) * 100 : 0;
    const raw = avgMfa - staleRate - ssoPenalty;
    return Math.round(clamp(raw, 0, 100));
  }, [rows]);

  const r = riskLabel(score);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Identity & Access Posture"
        subtitle="Zero Trust is identity-centric. Track MFA/SSO coverage, privileged accounts, stale accounts, and service accounts to quantify identity risk."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
          >
            <option value="all">All owners</option>
            {owners.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                display: "inline-flex",
                padding: "2px 10px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                fontWeight: 900,
                fontSize: 12,
                color: r.color,
                background: "white"
              }}
            >
              Identity Risk: {r.label}
            </span>
            <span style={{ fontWeight: 900 }}>Score: {score}/100</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14 }}>
          <KPI label="Avg MFA coverage" value={`${rows.length ? Math.round(rows.reduce((a, x) => a + x.mfaCoveragePct, 0) / rows.length) : 0}%`} />
          <KPI label="SSO enabled systems" value={`${rows.filter((x) => x.ssoEnabled).length}/${rows.length}`} />
          <KPI label="Privileged accounts" value={String(rows.reduce((a, x) => a + x.privilegedAccounts, 0))} />
          <KPI label="Stale privileged accounts" value={String(rows.reduce((a, x) => a + x.stalePrivilegedAccounts, 0))} />
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>System</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>MFA</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>SSO</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Privileged</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Stale Privileged</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Service Accts</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Last Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{x.system}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.owner}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.mfaCoveragePct}%</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.ssoEnabled ? "✅" : "❌"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.privilegedAccounts}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.stalePrivilegedAccounts}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.serviceAccounts}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.lastReviewed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Recommended Actions (demo)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Raise MFA coverage to 95%+ for privileged access, especially for legacy admin consoles.</li>
            <li>Implement periodic reviews: stale privileged accounts &gt; 0 should trigger workflow.</li>
            <li>Standardize service account lifecycle: ownership tagging, rotation schedule, and least privilege.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
