import * as React from "react";

type DriftItem = {
  id: string;
  resource: string;
  env: "dev" | "pilot" | "prod";
  severity: "low" | "medium" | "high";
  type: "config_drift" | "policy_violation" | "security_gap";
  detectedAt: string;
  summary: string;
  autoFixEligible: boolean;
  status: "open" | "queued" | "remediated";
};

const mockDrift: DriftItem[] = [
  {
    id: "g-1",
    resource: "k8s/ns:student-services / deployment:web",
    env: "prod",
    severity: "high",
    type: "policy_violation",
    detectedAt: "2025-12-19",
    summary: "Policy violation: missing NetworkPolicy in prod namespace",
    autoFixEligible: true,
    status: "open"
  },
  {
    id: "g-2",
    resource: "tf:landing-zone / iam-role:admin-temp",
    env: "pilot",
    severity: "high",
    type: "security_gap",
    detectedAt: "2025-12-18",
    summary: "Least privilege gap: overly broad IAM permissions detected",
    autoFixEligible: false,
    status: "open"
  },
  {
    id: "g-3",
    resource: "k8s/ns:portal / configmap:app-config",
    env: "prod",
    severity: "medium",
    type: "config_drift",
    detectedAt: "2025-12-17",
    summary: "Config drift: loggingLevel changed from INFO → DEBUG",
    autoFixEligible: true,
    status: "queued"
  },
  {
    id: "g-4",
    resource: "helm:edr-agent / values.yaml",
    env: "pilot",
    severity: "low",
    type: "config_drift",
    detectedAt: "2025-12-10",
    summary: "Drift: resource requests not aligned with baseline",
    autoFixEligible: true,
    status: "remediated"
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

function sevColor(sev: DriftItem["severity"]) {
  if (sev === "high") return "#dc2626";
  if (sev === "medium") return "#d97706";
  return "#6b7280";
}

function pill(text: string, color: string) {
  return (
    <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color }}>
      {text}
    </span>
  );
}

export default function GitOpsDriftRemediationPage() {
  const [env, setEnv] = React.useState<DriftItem["env"] | "all">("all");
  const [status, setStatus] = React.useState<DriftItem["status"] | "all">("open");

  const rows = mockDrift
    .filter((d) => (env === "all" ? true : d.env === env))
    .filter((d) => (status === "all" ? true : d.status === status));

  const open = mockDrift.filter((d) => d.status === "open").length;
  const eligible = mockDrift.filter((d) => d.autoFixEligible && d.status !== "remediated").length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="GitOps Drift & Remediation"
        subtitle="Unify drift detection + policy violations + safe remediation through GitOps PRs. Focus on prevention and repeatability."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Open drift items" value={String(open)} />
          <KPI label="Auto-fix eligible" value={String(eligible)} />
          <KPI label="Queued" value={String(mockDrift.filter((d) => d.status === "queued").length)} />
          <KPI label="Remediated" value={String(mockDrift.filter((d) => d.status === "remediated").length)} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
          <select value={env} onChange={(e) => setEnv(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All environments</option>
            <option value="dev">dev</option>
            <option value="pilot">pilot</option>
            <option value="prod">prod</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All statuses</option>
            <option value="open">open</option>
            <option value="queued">queued</option>
            <option value="remediated">remediated</option>
          </select>

          <button
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
            onClick={() => alert("Demo: create remediation PR(s) in GitOps repo for eligible items (coming next).")}
          >
            Create Remediation PRs (Demo)
          </button>
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Resource</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Env</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Type</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Severity</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Summary</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Auto-fix</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Detected</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{d.resource}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.env}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, color: "#6b7280" }}>{d.type}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{pill(d.severity.toUpperCase(), sevColor(d.severity))}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.summary}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.autoFixEligible ? "✅" : "—"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.status}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.detectedAt}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <button
                      style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 900 }}
                      onClick={() => alert("Demo: show drift diff + suggested fix + PR preview.")}
                    >
                      View Diff
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>How it advances your platform</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Turns monitoring into **safe remediation**, reducing recurring drift incidents.</li>
            <li>Creates standardized change controls (PRs, approvals, audit trails).</li>
            <li>Scales across institutions with the same patterns (GitOps + policy-as-code).</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
