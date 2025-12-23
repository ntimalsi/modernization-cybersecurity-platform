import * as React from "react";

type Framework = "NIST 800-171" | "EO 14028 (subset)" | "NIST CSF 2.0 (subset)";

type Signal = {
  id: string;
  name: string;
  source: "Asset Inventory" | "Zero Trust Checks" | "Drift" | "CI/CD" | "Policy-as-Code" | "Telemetry";
  description: string;
  sampleEvidence: string[];
};

type Control = {
  id: string;
  framework: Framework;
  controlId: string; // e.g., 3.5.3 or EO-14028-SBOM
  title: string;
  intent: string;
  owner: "CISO" | "CIO" | "Security Eng" | "Infra Eng" | "AppSec";
  maturityTarget: "Basic" | "Standard" | "Advanced";
};

type Mapping = {
  id: string;
  controlId: string;
  signalIds: string[];
  evidenceArtifact: string;
  enforcementMode: "Observe" | "Warn" | "Block";
  notes?: string;
  lastUpdatedAt: string;
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
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        fontWeight: 900,
        fontSize: 12,
        color: fg,
        background: bg
      }}
    >
      {text}
    </span>
  );
}

const signals: Signal[] = [
  {
    id: "sig_mfa",
    name: "MFA Coverage (Privileged)",
    source: "Zero Trust Checks",
    description: "Percent of privileged accounts protected by MFA; includes break-glass exceptions.",
    sampleEvidence: ["ZT check results export", "IdP policy screenshot", "Privileged group membership snapshot"]
  },
  {
    id: "sig_logs",
    name: "Centralized Log Forwarding",
    source: "Telemetry",
    description: "Coverage of SIEM forwarding for Tier-1 assets; routing & retention policies.",
    sampleEvidence: ["Forwarder config export", "SIEM ingest dashboard screenshot", "Retention policy doc link"]
  },
  {
    id: "sig_drift",
    name: "Config Drift Events",
    source: "Drift",
    description: "Detected drift events + remediation actions; baseline vs current diffs.",
    sampleEvidence: ["Drift timeline export", "Change approval record", "Remediation PR link"]
  },
  {
    id: "sig_sbom",
    name: "SBOM + Provenance",
    source: "CI/CD",
    description: "SBOM generation and build provenance attestation for deployed services.",
    sampleEvidence: ["CycloneDX SBOM artifact", "SLSA provenance attestation", "Vuln scan report"]
  },
  {
    id: "sig_policy",
    name: "Policy-as-Code Enforcement",
    source: "Policy-as-Code",
    description: "Required controls enforced at deploy-time: logging, ports, encryption, least privilege.",
    sampleEvidence: ["OPA/Kyverno policy repo", "Violation logs", "Enforcement mode setting"]
  }
];

const controls: Control[] = [
  {
    id: "c171_353",
    framework: "NIST 800-171",
    controlId: "3.5.3",
    title: "Use multifactor authentication for privileged accounts",
    intent: "Prevent unauthorized access to systems by requiring MFA for elevated roles.",
    owner: "CISO",
    maturityTarget: "Standard"
  },
  {
    id: "c171_312",
    framework: "NIST 800-171",
    controlId: "3.12.4",
    title: "Generate audit logs for defined events",
    intent: "Ensure audit logging exists for security-relevant events and supports investigation.",
    owner: "Security Eng",
    maturityTarget: "Standard"
  },
  {
    id: "eo_sbom",
    framework: "EO 14028 (subset)",
    controlId: "EO-SBOM",
    title: "Software Supply Chain Transparency (SBOM)",
    intent: "Improve visibility into software components and reduce supply-chain risk.",
    owner: "AppSec",
    maturityTarget: "Advanced"
  },
  {
    id: "csf_idam",
    framework: "NIST CSF 2.0 (subset)",
    controlId: "ID.AM / PR.AA",
    title: "Asset mgmt + access control posture",
    intent: "Maintain asset inventory and enforce identity-centric access controls.",
    owner: "CIO",
    maturityTarget: "Standard"
  }
];

const initialMappings: Mapping[] = [
  {
    id: "m1",
    controlId: "c171_353",
    signalIds: ["sig_mfa"],
    evidenceArtifact: "ZT-MFA-Coverage.json + IdP policy snapshot",
    enforcementMode: "Warn",
    notes: "Warn-only in pilots; move to Block for admin workflows after validation.",
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: "m2",
    controlId: "c171_312",
    signalIds: ["sig_logs", "sig_drift"],
    evidenceArtifact: "SIEM-Forwarding-Report.pdf + DriftEvents.csv",
    enforcementMode: "Observe",
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
  },
  {
    id: "m3",
    controlId: "eo_sbom",
    signalIds: ["sig_sbom"],
    evidenceArtifact: "SBOM.cdx.json + Provenance.intoto.jsonl",
    enforcementMode: "Block",
    notes: "Block release if SBOM is missing for in-scope services.",
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  }
];

function findControl(id: string) {
  return controls.find((c) => c.id === id);
}
function findSignal(id: string) {
  return signals.find((s) => s.id === id);
}

export default function ControlMappingStudioPage() {
  const [framework, setFramework] = React.useState<Framework | "All">("All");
  const [q, setQ] = React.useState("");
  const [mappings, setMappings] = React.useState<Mapping[]>(initialMappings);
  const [selectedMappingId, setSelectedMappingId] = React.useState(mappings[0]?.id ?? "");
  const [editing, setEditing] = React.useState(false);

  const filteredControls = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return controls
      .filter((c) => (framework === "All" ? true : c.framework === framework))
      .filter((c) => {
        if (!query) return true;
        return (
          c.controlId.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query) ||
          c.framework.toLowerCase().includes(query)
        );
      });
  }, [framework, q]);

  const selectedMapping = mappings.find((m) => m.id === selectedMappingId) ?? mappings[0];

  React.useEffect(() => {
    if (mappings.length && !mappings.some((m) => m.id === selectedMappingId)) {
      setSelectedMappingId(mappings[0].id);
    }
  }, [mappings, selectedMappingId]);

  const mappedControlIds = new Set(mappings.map((m) => m.controlId));

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Control Mapping Studio"
        subtitle="Map platform signals (drift, ZT checks, CI/CD, telemetry) to NIST/EO controls and define evidence + enforcement."
        right={pill("Reusable & Adoptable", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as any)}
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
          >
            <option value="All">All frameworks</option>
            <option value="NIST 800-171">NIST 800-171</option>
            <option value="EO 14028 (subset)">EO 14028 (subset)</option>
            <option value="NIST CSF 2.0 (subset)">NIST CSF 2.0 (subset)</option>
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search controls (3.5.3, SBOM, audit logs)…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 420 }}
          />

          <button
            onClick={() => alert("Demo: import a control catalog template (coming next).")}
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Import Catalog (Demo)
          </button>

          <button
            onClick={() => setEditing((v) => !v)}
            style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
          >
            {editing ? "Close Editor" : "Open Mapping Editor"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: editing ? "1fr 0.9fr" : "1fr", gap: 12, marginTop: 12 }}>
          {/* Controls table */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, overflowX: "auto" }}>
            <div style={{ fontWeight: 900 }}>Controls</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Framework</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Control</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Title</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredControls.map((c) => {
                  const isMapped = mappedControlIds.has(c.id);
                  return (
                    <tr key={c.id}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{c.framework}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{c.controlId}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        <div style={{ fontWeight: 900 }}>{c.title}</div>
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{c.intent}</div>
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{c.owner}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        {isMapped ? pill("Mapped", "#16a34a", "#f0fdf4") : pill("Unmapped", "#6b7280", "#f9fafb")}
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        <button
                          onClick={() => {
                            // jump/select mapping if exists; else create a new mapping draft
                            const existing = mappings.find((m) => m.controlId === c.id);
                            if (existing) {
                              setSelectedMappingId(existing.id);
                              setEditing(true);
                              return;
                            }
                            const newMap: Mapping = {
                              id: `m_${Math.random().toString(16).slice(2)}`,
                              controlId: c.id,
                              signalIds: [],
                              evidenceArtifact: "",
                              enforcementMode: "Observe",
                              lastUpdatedAt: new Date().toISOString()
                            };
                            setMappings((prev) => [newMap, ...prev]);
                            setSelectedMappingId(newMap.id);
                            setEditing(true);
                          }}
                          style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                        >
                          {isMapped ? "Edit Mapping" : "Map"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Demo value: you’re not doing tailored consulting — you’re providing a repeatable control→signal→evidence methodology.
            </div>
          </div>

          {/* Mapping editor */}
          {editing && selectedMapping && (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 900 }}>Mapping Editor</div>
                <div style={{ marginLeft: "auto" }}>
                  <button
                    onClick={() => alert("Demo: export mapping JSON/YAML (coming next).")}
                    style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Export (Demo)
                  </button>
                </div>
              </div>

              {(() => {
                const c = findControl(selectedMapping.controlId);
                return (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: 900 }}>{c ? `${c.framework} — ${c.controlId}` : "Unknown control"}</div>
                    <div style={{ color: "#6b7280", marginTop: 4 }}>{c?.title}</div>
                  </div>
                );
              })()}

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Signals</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {signals.map((s) => {
                    const checked = selectedMapping.signalIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        style={{ display: "flex", gap: 10, padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const on = e.target.checked;
                            setMappings((prev) =>
                              prev.map((m) =>
                                m.id !== selectedMapping.id
                                  ? m
                                  : {
                                      ...m,
                                      signalIds: on ? Array.from(new Set([...m.signalIds, s.id])) : m.signalIds.filter((x) => x !== s.id),
                                      lastUpdatedAt: new Date().toISOString()
                                    }
                              )
                            );
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 900 }}>{s.name}</div>
                          <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                            Source: {s.source} • {s.description}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
                            Sample evidence: {s.sampleEvidence.join(" • ")}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Evidence artifact description</div>
                <input
                  value={selectedMapping.evidenceArtifact}
                  onChange={(e) => {
                    const v = e.target.value;
                    setMappings((prev) => prev.map((m) => (m.id !== selectedMapping.id ? m : { ...m, evidenceArtifact: v, lastUpdatedAt: new Date().toISOString() })));
                  }}
                  placeholder="e.g., SBOM + provenance + scan report + approval record"
                  style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Enforcement mode</div>
                <select
                  value={selectedMapping.enforcementMode}
                  onChange={(e) => {
                    const v = e.target.value as Mapping["enforcementMode"];
                    setMappings((prev) => prev.map((m) => (m.id !== selectedMapping.id ? m : { ...m, enforcementMode: v, lastUpdatedAt: new Date().toISOString() })));
                  }}
                  style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                >
                  <option value="Observe">Observe (collect evidence only)</option>
                  <option value="Warn">Warn (report violations)</option>
                  <option value="Block">Block (prevent noncompliant deploys)</option>
                </select>
                <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>
                  Demo storyline: start Observe → move to Warn → graduate to Block for high-risk controls.
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Notes</div>
                <textarea
                  value={selectedMapping.notes ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setMappings((prev) => prev.map((m) => (m.id !== selectedMapping.id ? m : { ...m, notes: v, lastUpdatedAt: new Date().toISOString() })));
                  }}
                  rows={3}
                  placeholder="Pilot exceptions, rationale, maturity plan..."
                  style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                />
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => alert("Demo: save mapping; later persist per institution.")}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  Save Mapping (Demo)
                </button>
                <button
                  onClick={() => {
                    if (!confirm("Delete this mapping? (demo)")) return;
                    setMappings((prev) => prev.filter((m) => m.id !== selectedMapping.id));
                  }}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  Delete Mapping
                </button>
              </div>

              <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                Last updated: {new Date(selectedMapping.lastUpdatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
