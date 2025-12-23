import * as React from "react";

type Blueprint = {
  id: string;
  name: string;
  scope: "Landing Zone" | "Kubernetes" | "Network" | "Identity" | "Observability";
  environment: "Dev" | "Pilot" | "Prod";
  maturity: "draft" | "recommended" | "hardened";
  lastUpdated: string;
  includes: string[];
  notes: string;
};

const mockBlueprints: Blueprint[] = [
  {
    id: "iac-1",
    name: "Public-Sector Terraform Landing Zone",
    scope: "Landing Zone",
    environment: "Pilot",
    maturity: "recommended",
    lastUpdated: "2025-12-18",
    includes: ["Network baseline", "IAM baseline", "Audit logging", "Tagging standard"],
    notes: "Vendor-neutral baseline for cloud accounts/subscriptions/projects."
  },
  {
    id: "iac-2",
    name: "Kubernetes Cluster Baseline (RBAC + NetworkPolicies)",
    scope: "Kubernetes",
    environment: "Prod",
    maturity: "hardened",
    lastUpdated: "2025-12-10",
    includes: ["RBAC least privilege", "NetworkPolicies", "Pod Security baseline", "Admission policies"],
    notes: "Secure-by-default cluster foundation for GitOps deployments."
  },
  {
    id: "iac-3",
    name: "Campus Network Segmentation Reference (Zones/Tiers)",
    scope: "Network",
    environment: "Pilot",
    maturity: "draft",
    lastUpdated: "2025-11-22",
    includes: ["Tiering model", "E911 zones", "Mgmt plane separation", "Logging taps"],
    notes: "Template for segmentation planning (not device-specific)."
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

export default function IaCBlueprintsPage() {
  const [scope, setScope] = React.useState<Blueprint["scope"] | "all">("all");
  const [maturity, setMaturity] = React.useState<Blueprint["maturity"] | "all">("all");

  const scopes = React.useMemo(() => Array.from(new Set(mockBlueprints.map((b) => b.scope))), []);
  const rows = mockBlueprints.filter((b) => (scope === "all" ? true : b.scope === scope)).filter((b) => (maturity === "all" ? true : b.maturity === maturity));

  const hardened = mockBlueprints.filter((b) => b.maturity === "hardened").length;
  const recommended = mockBlueprints.filter((b) => b.maturity === "recommended").length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="IaC Blueprints"
        subtitle="Reusable Infrastructure-as-Code reference templates that institutions can adopt as a starting point (landing zones, clusters, network tiers, identity)."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Blueprints" value={String(mockBlueprints.length)} />
          <KPI label="Recommended" value={String(recommended)} />
          <KPI label="Hardened" value={String(hardened)} />
          <KPI label="Scopes" value={String(scopes.length)} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
          <select value={scope} onChange={(e) => setScope(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All scopes</option>
            {scopes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select value={maturity} onChange={(e) => setMaturity(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All maturity</option>
            <option value="draft">Draft</option>
            <option value="recommended">Recommended</option>
            <option value="hardened">Hardened</option>
          </select>

          <button
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
            onClick={() => alert("Demo: export Terraform modules + README + variable presets (coming next).")}
          >
            Export Blueprint (Demo)
          </button>
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Blueprint</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Scope</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Env</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Maturity</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Includes</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Last Updated</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <div style={{ fontWeight: 900 }}>{b.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{b.notes}</div>
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{b.scope}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{b.environment}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    {b.maturity === "hardened"
                      ? pill("HARDENED", "#16a34a")
                      : b.maturity === "recommended"
                      ? pill("RECOMMENDED", "#2563eb")
                      : pill("DRAFT", "#d97706")}
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {b.includes.slice(0, 3).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                      {b.includes.length > 3 && <li>+ {b.includes.length - 3} more</li>}
                    </ul>
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{b.lastUpdated}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <button
                      style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 900 }}
                      onClick={() => alert("Demo: open blueprint details + variables + policy requirements.")}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Why this matters</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Blueprints are **readily adoptable**: repeatable patterns, not custom consulting.</li>
            <li>They encode modernization + security defaults: tags, logging, least privilege, segmentation.</li>
            <li>They reduce time-to-pilot and standardize deployments across institutions.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
