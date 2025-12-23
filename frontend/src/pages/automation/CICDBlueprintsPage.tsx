import * as React from "react";

type PipelineTemplate = {
  id: string;
  name: string;
  target: "GitHub Actions" | "GitLab CI" | "Jenkins";
  useCase: "Web App" | "API Service" | "Infra/IaC" | "Kubernetes Deploy";
  stages: string[];
  guardrails: string[];
  lastUpdated: string;
};

const mockPipelines: PipelineTemplate[] = [
  {
    id: "ci-1",
    name: "API Service Secure Pipeline",
    target: "GitLab CI",
    useCase: "API Service",
    stages: ["Lint", "Unit Test", "SAST", "Dependency Scan", "Build Image", "Sign", "Deploy (staged)"],
    guardrails: ["Block critical vulns", "Require signed artifacts", "Policy checks before deploy"],
    lastUpdated: "2025-12-19"
  },
  {
    id: "ci-2",
    name: "Terraform + Policy Gate",
    target: "GitHub Actions",
    useCase: "Infra/IaC",
    stages: ["Fmt/Validate", "Plan", "OPA/Sentinel Policy", "Approval Gate", "Apply"],
    guardrails: ["Tagging required", "Logging required", "No public buckets", "Least privilege IAM"],
    lastUpdated: "2025-12-14"
  },
  {
    id: "ci-3",
    name: "K8s GitOps Release (Helm)",
    target: "GitHub Actions",
    useCase: "Kubernetes Deploy",
    stages: ["Build", "Scan", "SBOM", "Sign", "Update GitOps Repo PR", "Promote"],
    guardrails: ["SBOM required", "Kyverno policy pass", "Protected environments"],
    lastUpdated: "2025-12-08"
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

export default function CICDBlueprintsPage() {
  const [target, setTarget] = React.useState<PipelineTemplate["target"] | "all">("all");
  const [useCase, setUseCase] = React.useState<PipelineTemplate["useCase"] | "all">("all");

  const targets = React.useMemo(() => Array.from(new Set(mockPipelines.map((p) => p.target))), []);
  const useCases = React.useMemo(() => Array.from(new Set(mockPipelines.map((p) => p.useCase))), []);

  const rows = mockPipelines
    .filter((p) => (target === "all" ? true : p.target === target))
    .filter((p) => (useCase === "all" ? true : p.useCase === useCase));

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="CI/CD Blueprints"
        subtitle="Reusable pipeline templates that bake in security and compliance guardrails (scans, SBOM, signing, policy gates, approvals)."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Templates" value={String(mockPipelines.length)} />
          <KPI label="Targets" value={String(targets.length)} />
          <KPI label="Use cases" value={String(useCases.length)} />
          <KPI label="Guardrails encoded" value={String(mockPipelines.reduce((a, p) => a + p.guardrails.length, 0))} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <select value={target} onChange={(e) => setTarget(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All CI targets</option>
            {targets.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select value={useCase} onChange={(e) => setUseCase(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All use cases</option>
            {useCases.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <button
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
            onClick={() => alert("Demo: export YAML + README + adoption steps for the selected template (coming next).")}
          >
            Export Pipeline YAML (Demo)
          </button>
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Template</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Target</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Use case</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Stages</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Guardrails</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Updated</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{p.name}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.target}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.useCase}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.stages.slice(0, 5).map((s) => (
                        <span key={s} style={{ border: "1px solid #e5e7eb", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 800 }}>
                          {s}
                        </span>
                      ))}
                      {p.stages.length > 5 && (
                        <span style={{ border: "1px solid #e5e7eb", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 800 }}>
                          +{p.stages.length - 5}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {p.guardrails.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.lastUpdated}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <button
                      style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 900 }}
                      onClick={() => alert("Demo: view template details + YAML preview + adoption steps (coming next).")}
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
            <li>Institutions can adopt pipelines quickly and consistently (no “one-off” setups).</li>
            <li>Guardrails reduce incidents from misconfigurations and insecure releases.</li>
            <li>Standardized evidence artifacts support audits and EO/NIST alignment.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
