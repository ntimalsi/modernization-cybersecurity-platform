import * as React from "react";

type PackStatus = "Draft" | "In Review" | "Ready" | "Exported";

type EvidenceItem = {
  id: string;
  title: string;
  controlRef: string; // NIST/EO reference
  artifactType: "Report" | "Screenshot" | "Export" | "Policy" | "Pipeline Artifact" | "Approval Record";
  source: "Telemetry" | "Zero Trust" | "Drift" | "CI/CD" | "Policy-as-Code" | "Manual Upload";
  required: boolean;
  attached: boolean;
  notes?: string;
};

type EvidencePack = {
  id: string;
  name: string;
  scope: "Institution-wide" | "Tier-1 Apps" | "Public Safety/E911" | "K-12 Minimal";
  period: string; // e.g., Q4 2025
  status: PackStatus;
  items: EvidenceItem[];
  createdAt: string;
  owner: string;
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

function statusColors(s: PackStatus) {
  if (s === "Ready") return { fg: "#16a34a", bg: "#f0fdf4" };
  if (s === "In Review") return { fg: "#2563eb", bg: "#eff6ff" };
  if (s === "Exported") return { fg: "#111827", bg: "#f3f4f6" };
  return { fg: "#6b7280", bg: "#f9fafb" };
}

const seedPacks: EvidencePack[] = [
  {
    id: "p1",
    name: "Q4 Evidence Pack — Tier-1 Services",
    scope: "Tier-1 Apps",
    period: "Q4 2025",
    status: "In Review",
    owner: "Security Eng",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    items: [
      { id: "e1", title: "MFA coverage export (privileged)", controlRef: "NIST 800-171 3.5.3", artifactType: "Export", source: "Zero Trust", required: true, attached: true },
      { id: "e2", title: "SIEM forwarding coverage report", controlRef: "NIST 800-171 3.12.4", artifactType: "Report", source: "Telemetry", required: true, attached: false, notes: "Need latest ingest screenshot." },
      { id: "e3", title: "Drift events + remediation record", controlRef: "NIST 800-171 3.4.x", artifactType: "Export", source: "Drift", required: true, attached: true },
      { id: "e4", title: "Policy-as-code repository snapshot", controlRef: "Control enforcement", artifactType: "Policy", source: "Policy-as-Code", required: false, attached: true },
      { id: "e5", title: "SBOM + provenance artifacts", controlRef: "EO 14028 (SBOM)", artifactType: "Pipeline Artifact", source: "CI/CD", required: true, attached: false }
    ]
  },
  {
    id: "p2",
    name: "Public Safety / E911 — Audit Package",
    scope: "Public Safety/E911",
    period: "2025-10 to 2025-12",
    status: "Draft",
    owner: "CISO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    items: [
      { id: "e6", title: "E911 availability evidence & DR test", controlRef: "Continuity", artifactType: "Report", source: "Manual Upload", required: true, attached: false },
      { id: "e7", title: "Privileged access approvals", controlRef: "Access governance", artifactType: "Approval Record", source: "Manual Upload", required: true, attached: false }
    ]
  }
];

export default function EvidencePackBuilderPage() {
  const [packs, setPacks] = React.useState<EvidencePack[]>(seedPacks);
  const [selectedId, setSelectedId] = React.useState<string>(seedPacks[0]?.id ?? "");
  const [filter, setFilter] = React.useState<"all" | "missing" | "required">("all");

  const selected = packs.find((p) => p.id === selectedId) ?? packs[0];

  React.useEffect(() => {
    if (packs.length && !packs.some((p) => p.id === selectedId)) setSelectedId(packs[0].id);
  }, [packs, selectedId]);

  function packProgress(p: EvidencePack) {
    const req = p.items.filter((i) => i.required);
    const done = req.filter((i) => i.attached).length;
    return { done, total: req.length || 1, pct: Math.round((done / (req.length || 1)) * 100) };
  }

  const visibleItems = React.useMemo(() => {
    if (!selected) return [];
    if (filter === "all") return selected.items;
    if (filter === "missing") return selected.items.filter((i) => !i.attached);
    return selected.items.filter((i) => i.required);
  }, [selected, filter]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Evidence Pack Builder"
        subtitle="Turn controls into audit-ready artifacts: exports, screenshots, policies, pipeline evidence, approvals."
        right={pill("Audit-ready artifacts", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 12 }}>
          {/* Packs list */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontWeight: 900 }}>Evidence Packs</div>
              <button
                onClick={() => {
                  const newPack: EvidencePack = {
                    id: `p_${Math.random().toString(16).slice(2)}`,
                    name: "New Evidence Pack (Demo)",
                    scope: "Institution-wide",
                    period: "Q1 2026",
                    status: "Draft",
                    owner: "Security Eng",
                    createdAt: new Date().toISOString(),
                    items: []
                  };
                  setPacks((prev) => [newPack, ...prev]);
                  setSelectedId(newPack.id);
                }}
                style={{ marginLeft: "auto", padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
              >
                New Pack
              </button>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {packs.map((p) => {
                const active = p.id === selectedId;
                const s = statusColors(p.status);
                const prog = packProgress(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
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
                      <div style={{ fontWeight: 900 }}>{p.name}</div>
                      <div style={{ marginLeft: "auto" }}>{pill(p.status, active ? "white" : s.fg, active ? "rgba(255,255,255,0.12)" : s.bg)}</div>
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Scope: {p.scope} • Period: {p.period} • Owner: {p.owner}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ height: 8, background: active ? "rgba(255,255,255,0.18)" : "#f3f4f6", borderRadius: 999 }}>
                        <div style={{ height: 8, width: `${prog.pct}%`, background: active ? "white" : "#111827", borderRadius: 999 }} />
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, color: active ? "#d1d5db" : "#6b7280" }}>
                        Required complete: {prog.done}/{prog.total} ({prog.pct}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pack detail */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            {!selected ? (
              <div style={{ color: "#6b7280" }}>Select an evidence pack.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{selected.name}</div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                    >
                      <option value="all">All items</option>
                      <option value="missing">Missing items</option>
                      <option value="required">Required items</option>
                    </select>

                    <button
                      onClick={() => alert("Demo: export ZIP / PDF package (coming next).")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Export Pack (Demo)
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>
                  Created: {new Date(selected.createdAt).toLocaleString()} • Status: {selected.status}
                </div>

                <div style={{ marginTop: 12, overflowX: "auto", background: "white", borderRadius: 16, border: "1px solid #e5e7eb" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Item</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Control</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Type</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Source</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Required</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Attached</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleItems.map((i) => (
                        <tr key={i.id}>
                          <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                            <div style={{ fontWeight: 900 }}>{i.title}</div>
                            {i.notes && <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{i.notes}</div>}
                          </td>
                          <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{i.controlRef}</td>
                          <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{i.artifactType}</td>
                          <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{i.source}</td>
                          <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                            {i.required ? pill("Required", "#b45309", "#fff7ed") : pill("Optional", "#6b7280", "#f9fafb")}
                          </td>
                          <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                            {i.attached ? pill("Yes", "#16a34a", "#f0fdf4") : pill("No", "#dc2626", "#fef2f2")}
                          </td>
                          <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                            <button
                              onClick={() => {
                                // MVP: flip attached boolean to simulate upload
                                setPacks((prev) =>
                                  prev.map((p) =>
                                    p.id !== selected.id
                                      ? p
                                      : {
                                          ...p,
                                          items: p.items.map((x) => (x.id !== i.id ? x : { ...x, attached: !x.attached }))
                                        }
                                  )
                                );
                              }}
                              style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                            >
                              {i.attached ? "Detach" : "Attach (Demo)"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => alert("Demo: populate from Control Mapping Studio (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Add Items from Mappings (Demo)
                  </button>
                  <button
                    onClick={() => alert("Demo: submit for review / approvals workflow (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Submit for Review (Demo)
                  </button>
                </div>

                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                  Demo value: public institutions struggle with audits; you’re packaging evidence as repeatable artifacts instead of manual scrambling.
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
