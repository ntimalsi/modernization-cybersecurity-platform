import * as React from "react";

type Policy = {
  id: string;
  name: string;
  engine: "OPA/Rego" | "Kyverno" | "Sentinel" | "Custom";
  category: "Identity" | "Network" | "Logging" | "Data Protection" | "Supply Chain";
  mode: "monitor" | "enforce";
  severity: "low" | "medium" | "high";
  violations7d: number;
  lastUpdated: string;
  description: string;
};

const mockPolicies: Policy[] = [
  {
    id: "pol-1",
    name: "Require MFA for Privileged Roles",
    engine: "OPA/Rego",
    category: "Identity",
    mode: "enforce",
    severity: "high",
    violations7d: 2,
    lastUpdated: "2025-12-16",
    description: "Blocks deployments/changes that introduce privileged accounts without MFA coverage."
  },
  {
    id: "pol-2",
    name: "No Public Admin Ports",
    engine: "Kyverno",
    category: "Network",
    mode: "enforce",
    severity: "high",
    violations7d: 5,
    lastUpdated: "2025-12-12",
    description: "Prevents exposure of admin endpoints beyond allowed segments."
  },
  {
    id: "pol-3",
    name: "Logging Forwarding Required",
    engine: "Sentinel",
    category: "Logging",
    mode: "monitor",
    severity: "medium",
    violations7d: 11,
    lastUpdated: "2025-12-01",
    description: "Flags workloads without SIEM/log forwarding tags and config."
  },
  {
    id: "pol-4",
    name: "SBOM Required for Release",
    engine: "OPA/Rego",
    category: "Supply Chain",
    mode: "monitor",
    severity: "medium",
    violations7d: 4,
    lastUpdated: "2025-11-29",
    description: "Ensures SBOM artifacts exist for releases and are retained."
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

function pill(text: string, color: string) {
  return (
    <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color }}>
      {text}
    </span>
  );
}

function severityColor(sev: Policy["severity"]) {
  if (sev === "high") return "#dc2626";
  if (sev === "medium") return "#d97706";
  return "#6b7280";
}

export default function PolicyAsCodePage() {
  const [mode, setMode] = React.useState<Policy["mode"] | "all">("all");
  const [category, setCategory] = React.useState<Policy["category"] | "all">("all");

  const categories = React.useMemo(() => Array.from(new Set(mockPolicies.map((p) => p.category))), []);
  const rows = mockPolicies.filter((p) => (mode === "all" ? true : p.mode === mode)).filter((p) => (category === "all" ? true : p.category === category));

  const enforceCount = mockPolicies.filter((p) => p.mode === "enforce").length;
  const violations = mockPolicies.reduce((a, p) => a + p.violations7d, 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Policy-as-Code"
        subtitle="Turn compliance into prevention: encode guardrails as policies (monitor/enforce), track violations, and connect to CI/CD and GitOps workflows."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Policies" value={String(mockPolicies.length)} />
          <KPI label="Enforcement enabled" value={String(enforceCount)} />
          <KPI label="Violations (7d)" value={String(violations)} />
          <KPI label="Engines" value={String(new Set(mockPolicies.map((p) => p.engine)).size)} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={mode} onChange={(e) => setMode(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">Monitor + Enforce</option>
            <option value="monitor">Monitor</option>
            <option value="enforce">Enforce</option>
          </select>

          <button
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
            onClick={() => alert("Demo: add a policy from templates, select engine, set monitor/enforce (coming next).")}
          >
            Add Policy (Demo)
          </button>
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Policy</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Category</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Engine</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Mode</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Severity</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Violations (7d)</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Updated</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <div style={{ fontWeight: 900 }}>{p.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{p.description}</div>
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.category}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.engine}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    {p.mode === "enforce" ? pill("ENFORCE", "#16a34a") : pill("MONITOR", "#2563eb")}
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{pill(p.severity.toUpperCase(), severityColor(p.severity))}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.violations7d}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.lastUpdated}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <button
                      style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 900 }}
                      onClick={() => alert("Demo: policy details + test input + violation examples + toggle mode.")}
                    >
                      Test / View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Platform advantage</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Moves controls from “documentation” to **enforced guardrails**.</li>
            <li>Reduces repeated findings by preventing insecure changes in the first place.</li>
            <li>Creates audit-ready trails (violations, approvals, exceptions).</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
