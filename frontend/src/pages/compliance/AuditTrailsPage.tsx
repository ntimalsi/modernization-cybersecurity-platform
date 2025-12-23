import * as React from "react";

type AuditEventType =
  | "Policy Violation"
  | "Drift Detected"
  | "Access Change"
  | "Evidence Attached"
  | "Pipeline Blocked"
  | "Exception Approved"
  | "Control Mapping Changed";

type AuditEvent = {
  id: string;
  at: string;
  type: AuditEventType;
  actor: string;
  resource: string;
  severity: "High" | "Medium" | "Low";
  summary: string;
  details: string[];
  linkedArtifacts?: string[];
};

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle && <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>}
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

function levelColor(level: "High" | "Medium" | "Low") {
  if (level === "High") return { fg: "#dc2626", bg: "#fef2f2" };
  if (level === "Medium") return { fg: "#b45309", bg: "#fff7ed" };
  return { fg: "#6b7280", bg: "#f9fafb" };
}

const seed: AuditEvent[] = [
  {
    id: "a1",
    at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    type: "Policy Violation",
    actor: "policy-engine",
    resource: "k8s/ns=payments",
    severity: "High",
    summary: "Blocked deploy: missing required logging annotation for Tier-1 namespace",
    details: ["Policy: required-logging", "Mode: BLOCK", "Missing: logs.forwarding=true", "Suggested fix: apply baseline bundle"],
    linkedArtifacts: ["policy/required-logging.yaml", "pipeline/run-1842.log"]
  },
  {
    id: "a2",
    at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    type: "Drift Detected",
    actor: "drift-service",
    resource: "asset=Core Network Firewall",
    severity: "High",
    summary: "Firewall rule allow-list changed outside approved window (demo)",
    details: ["Changed keys: allowlist, adminPorts", "Baseline vs current diff stored", "Created SOC ticket draft (demo)"],
    linkedArtifacts: ["drift/firewall-diff.json"]
  },
  {
    id: "a3",
    at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: "Evidence Attached",
    actor: "Security Eng",
    resource: "evidence-pack=Q4 Tier-1",
    severity: "Low",
    summary: "Attached MFA coverage export",
    details: ["Control: NIST 800-171 3.5.3", "Artifact: ZT-MFA-Coverage.json"],
    linkedArtifacts: ["evidence/ZT-MFA-Coverage.json"]
  },
  {
    id: "a4",
    at: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
    type: "Exception Approved",
    actor: "CISO",
    resource: "policy=sbom-required",
    severity: "Medium",
    summary: "Approved temporary exception for legacy vendor app",
    details: ["Expires: 30 days", "Rationale: vendor build pipeline cannot produce SBOM yet", "Compensating control: enhanced scanning + restricted access"],
    linkedArtifacts: ["exceptions/sbom-legacy-vendor.md"]
  },
  {
    id: "a5",
    at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    type: "Control Mapping Changed",
    actor: "Compliance Lead",
    resource: "control=EO-SBOM",
    severity: "Low",
    summary: "Updated evidence artifact list for SBOM control",
    details: ["Added provenance attestation", "Set enforcement mode: WARN → BLOCK for in-scope services"],
    linkedArtifacts: ["mappings/eo-sbom.json"]
  }
];

export default function AuditTrailsPage() {
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<"all" | AuditEventType>("all");
  const [sev, setSev] = React.useState<"all" | "High" | "Medium" | "Low">("all");
  const [selectedId, setSelectedId] = React.useState(seed[0]?.id ?? "");

  const rows = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return seed
      .filter((e) => (type === "all" ? true : e.type === type))
      .filter((e) => (sev === "all" ? true : e.severity === sev))
      .filter((e) => {
        if (!query) return true;
        return (
          e.summary.toLowerCase().includes(query) ||
          e.resource.toLowerCase().includes(query) ||
          e.type.toLowerCase().includes(query) ||
          e.actor.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => +new Date(b.at) - +new Date(a.at));
  }, [q, type, sev]);

  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];

  React.useEffect(() => {
    if (rows.length && !rows.some((r) => r.id === selectedId)) setSelectedId(rows[0].id);
  }, [rows, selectedId]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Audit Trails"
        subtitle="Immutable-style event timeline for compliance and investigations (policies, drift, access, pipeline gates, evidence)."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search audit events…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 420 }}
          />
          <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All types</option>
            <option value="Policy Violation">Policy Violation</option>
            <option value="Drift Detected">Drift Detected</option>
            <option value="Access Change">Access Change</option>
            <option value="Evidence Attached">Evidence Attached</option>
            <option value="Pipeline Blocked">Pipeline Blocked</option>
            <option value="Exception Approved">Exception Approved</option>
            <option value="Control Mapping Changed">Control Mapping Changed</option>
          </select>
          <select value={sev} onChange={(e) => setSev(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={() => alert("Demo: export audit log CSV/PDF (coming next).")}
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Export Audit Log (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12, marginTop: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, overflowX: "auto" }}>
            <div style={{ fontWeight: 900 }}>Event Stream</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Time</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Type</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Resource</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Actor</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Severity</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => {
                  const active = e.id === selectedId;
                  const c = levelColor(e.severity);
                  return (
                    <tr key={e.id} style={{ background: active ? "#111827" : "transparent", color: active ? "white" : "#111827" }}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{new Date(e.at).toLocaleString()}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{e.type}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{e.resource}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{e.actor}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        {pill(e.severity.toUpperCase(), active ? "white" : c.fg, active ? "rgba(255,255,255,0.12)" : c.bg)}
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        <button
                          onClick={() => setSelectedId(e.id)}
                          style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: active ? "white" : "#111827", color: active ? "#111827" : "white", fontWeight: 900, cursor: "pointer" }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Demo value: auditability + repeatable evidence reduces compliance cost and improves incident investigations.
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            <div style={{ fontWeight: 900 }}>Event Details</div>
            {!selected ? (
              <div style={{ color: "#6b7280", marginTop: 10 }}>Select an event.</div>
            ) : (
              <>
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 900 }}>{selected.summary}</div>
                  <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>
                    {new Date(selected.at).toLocaleString()} • {selected.type} • {selected.resource}
                  </div>
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {pill(`Actor: ${selected.actor}`, "#111827", "white")}
                  {(() => {
                    const c = levelColor(selected.severity);
                    return pill(selected.severity, c.fg, c.bg);
                  })()}
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 900 }}>Details</div>
                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {selected.details.map((d, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 900 }}>Linked artifacts</div>
                  {selected.linkedArtifacts?.length ? (
                    <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                      {selected.linkedArtifacts.map((a) => (
                        <div key={a} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 10, background: "white", fontWeight: 900 }}>
                          {a}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ marginTop: 8, color: "#6b7280" }}>No artifacts linked.</div>
                  )}
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  <button
                    onClick={() => alert("Demo: create investigation case and link related drift/policies (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Open Investigation Case (Demo)
                  </button>
                  <button
                    onClick={() => alert("Demo: attach this event to an Evidence Pack (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Attach to Evidence Pack (Demo)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
