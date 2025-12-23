import * as React from "react";

type TemplateCategory =
  | "IaC Baseline"
  | "CI/CD Pipeline"
  | "Policy Bundle"
  | "Secure Service Blueprint"
  | "Compliance Pack"
  | "Reference Architecture";

type Template = {
  id: string;
  name: string;
  category: TemplateCategory;
  provider: "Platform Core" | "Community" | "Partner Lab";
  maturity: "Draft" | "Reviewed" | "Approved";
  scope: "K-12" | "Higher Ed" | "Municipal" | "Public Safety" | "General";
  tags: string[];
  summary: string;
  includes: string[];
  lastUpdatedAt: string;
  downloadCount: number;
};

function Card({
  title,
  subtitle,
  right,
  children
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
          {subtitle && <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function pill(text: string, fg: string, bg: string) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color: fg, background: bg }}>
      {text}
    </span>
  );
}

function maturityPill(m: Template["maturity"]) {
  if (m === "Approved") return pill("APPROVED", "#16a34a", "#f0fdf4");
  if (m === "Reviewed") return pill("REVIEWED", "#2563eb", "#eff6ff");
  return pill("DRAFT", "#6b7280", "#f9fafb");
}

const seedTemplates: Template[] = [
  {
    id: "t1",
    name: "Public-Sector GitOps Cluster Baseline",
    category: "IaC Baseline",
    provider: "Platform Core",
    maturity: "Approved",
    scope: "General",
    tags: ["kubernetes", "gitops", "rbac", "logging"],
    summary: "Baseline cluster setup with RBAC, namespaces, logging forwarders, and guardrails-ready structure.",
    includes: ["Terraform module", "K8s manifests", "GitOps folder layout", "Baseline policies (starter)"],
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    downloadCount: 312
  },
  {
    id: "t2",
    name: "CI/CD Template: Build→Scan→Policy→Deploy (GitLab)",
    category: "CI/CD Pipeline",
    provider: "Platform Core",
    maturity: "Reviewed",
    scope: "Higher Ed",
    tags: ["gitlab", "sast", "sbom", "slsa"],
    summary: "Reusable pipeline template with scanning, SBOM generation, policy checks, and audit artifacts.",
    includes: ["gitlab-ci.yml template", "scan jobs", "sbom job", "policy gate job"],
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    downloadCount: 221
  },
  {
    id: "t3",
    name: "Policy Bundle: Required Logging + Allowed Ports",
    category: "Policy Bundle",
    provider: "Partner Lab",
    maturity: "Approved",
    scope: "General",
    tags: ["opa", "kyverno", "logging", "network"],
    summary: "Policy-as-code bundle enforcing logging forwarding and safe network exposure defaults.",
    includes: ["OPA/Rego policies", "Kyverno alternatives", "violation examples", "enforcement modes"],
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    downloadCount: 145
  },
  {
    id: "t4",
    name: "Secure Service Blueprint: Web App + Postgres",
    category: "Secure Service Blueprint",
    provider: "Community",
    maturity: "Draft",
    scope: "Municipal",
    tags: ["helm", "postgres", "secrets", "rbac"],
    summary: "Opinionated service blueprint with secrets handling, least privilege, and standard telemetry hooks.",
    includes: ["Helm chart", "RBAC roles", "secret patterns", "telemetry annotations"],
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    downloadCount: 43
  },
  {
    id: "t5",
    name: "Compliance Pack: NIST 800-171 Mini-Profile Evidence Checklist",
    category: "Compliance Pack",
    provider: "Platform Core",
    maturity: "Reviewed",
    scope: "General",
    tags: ["nist", "evidence", "audit"],
    summary: "Evidence checklist and mapping for a small subset of NIST 800-171 controls in pilots.",
    includes: ["control mappings", "evidence list", "export placeholders", "report skeleton"],
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    downloadCount: 97
  }
];

export default function TemplateExchangePage() {
  const [category, setCategory] = React.useState<TemplateCategory | "All">("All");
  const [scope, setScope] = React.useState<Template["scope"] | "All">("All");
  const [maturity, setMaturity] = React.useState<Template["maturity"] | "All">("All");
  const [q, setQ] = React.useState("");

  const [selectedId, setSelectedId] = React.useState(seedTemplates[0]?.id ?? "");

  const items = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return seedTemplates
      .filter((t) => (category === "All" ? true : t.category === category))
      .filter((t) => (scope === "All" ? true : t.scope === scope))
      .filter((t) => (maturity === "All" ? true : t.maturity === maturity))
      .filter((t) => {
        if (!query) return true;
        return (
          t.name.toLowerCase().includes(query) ||
          t.summary.toLowerCase().includes(query) ||
          t.tags.join(" ").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.downloadCount - a.downloadCount);
  }, [category, scope, maturity, q]);

  const selected = items.find((t) => t.id === selectedId) ?? items[0];

  React.useEffect(() => {
    if (items.length && !items.some((x) => x.id === selectedId)) setSelectedId(items[0].id);
  }, [items, selectedId]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Template Exchange"
        subtitle="Reusable building blocks: IaC baselines, CI/CD templates, policy bundles, service blueprints, and compliance packs."
        right={pill("Reusable templates", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All categories</option>
            <option value="IaC Baseline">IaC Baseline</option>
            <option value="CI/CD Pipeline">CI/CD Pipeline</option>
            <option value="Policy Bundle">Policy Bundle</option>
            <option value="Secure Service Blueprint">Secure Service Blueprint</option>
            <option value="Compliance Pack">Compliance Pack</option>
            <option value="Reference Architecture">Reference Architecture</option>
          </select>

          <select value={scope} onChange={(e) => setScope(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All scopes</option>
            <option value="General">General</option>
            <option value="Higher Ed">Higher Ed</option>
            <option value="K-12">K-12</option>
            <option value="Municipal">Municipal</option>
            <option value="Public Safety">Public Safety</option>
          </select>

          <select value={maturity} onChange={(e) => setMaturity(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All maturity</option>
            <option value="Draft">Draft</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search templates (SBOM, GitOps, logging)…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 320 }}
          />

          <button
            onClick={() => alert("Demo: submit a template for review/approval (coming next).")}
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Submit Template (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: 12, marginTop: 12 }}>
          {/* list */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Library</div>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {items.map((t) => {
                const active = t.id === selectedId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    style={{
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 12,
                      background: active ? "#111827" : "white",
                      color: active ? "white" : "#111827"
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ fontWeight: 900 }}>{t.name}</div>
                      <div style={{ marginLeft: "auto" }}>
                        {active ? pill(t.maturity.toUpperCase(), "white", "rgba(255,255,255,0.12)") : maturityPill(t.maturity)}
                      </div>
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      {t.category} • Scope: {t.scope} • Provider: {t.provider}
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Downloads: {t.downloadCount} • Updated: {new Date(t.lastUpdatedAt).toLocaleDateString()}
                    </div>
                    <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {t.tags.slice(0, 6).map((tag) =>
                        active ? pill(tag, "white", "rgba(255,255,255,0.12)") : pill(tag, "#111827", "#f9fafb")
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Demo value: this is how you prove “readily adoptable” — templates are portable across institutions.
            </div>
          </div>

          {/* detail */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            {!selected ? (
              <div style={{ color: "#6b7280" }}>Select a template.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{selected.name}</div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {pill(selected.category, "#111827", "white")}
                    {pill(`Scope: ${selected.scope}`, "#2563eb", "#eff6ff")}
                    {maturityPill(selected.maturity)}
                  </div>
                </div>

                <div style={{ marginTop: 10, color: "#6b7280" }}>{selected.summary}</div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Includes</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {selected.includes.map((x) => (
                      <div key={x} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 10, background: "white", fontWeight: 900 }}>
                        {x}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Actions</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    <button
                      onClick={() => alert("Demo: apply to environment and generate diff (coming next).")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Apply to Environment (Demo)
                    </button>
                    <button
                      onClick={() => alert("Demo: export template bundle (coming next).")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Download Bundle (Demo)
                    </button>
                    <button
                      onClick={() => alert("Demo: open review workflow (coming next).")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Request Review / Approval (Demo)
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                  Updated: {new Date(selected.lastUpdatedAt).toLocaleString()} • Provider: {selected.provider}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
