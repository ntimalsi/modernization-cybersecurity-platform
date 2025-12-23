import * as React from "react";

type Anomaly = {
  id: string;
  createdAt: string;
  asset: string;
  category: "Network" | "Identity" | "Cloud/IAM" | "Kubernetes" | "Endpoint" | "Logging";
  signal: string;
  severity: "High" | "Medium" | "Low";
  whyFlagged: string[];
  recommendedAction: string;
  confidence: number; // 0-100 (demo)
  status: "Open" | "Investigating" | "Resolved" | "Ignored";
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

function sevColors(sev: "High" | "Medium" | "Low") {
  if (sev === "High") return { fg: "#dc2626", bg: "#fef2f2" };
  if (sev === "Medium") return { fg: "#b45309", bg: "#fff7ed" };
  return { fg: "#6b7280", bg: "#f9fafb" };
}

const mock: Anomaly[] = [
  {
    id: "m1",
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    asset: "Core Network Firewall",
    category: "Network",
    signal: "Unexpected admin port exposure on management interface",
    severity: "High",
    confidence: 86,
    whyFlagged: [
      "Baseline shows mgmt ports restricted to internal subnet",
      "Current config includes a wider CIDR allow-list",
      "Change not linked to an approved change window (demo)"
    ],
    recommendedAction: "Revert allow-list to baseline; enforce policy-as-code guardrail for mgmt ports.",
    status: "Open"
  },
  {
    id: "m2",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    asset: "E911 Location Service",
    category: "Identity",
    signal: "Privileged role assigned without MFA enforcement",
    severity: "High",
    confidence: 79,
    whyFlagged: ["Privileged access role change detected", "MFA coverage check failed for new role member", "Role is used by critical service (higher weight)"],
    recommendedAction: "Require MFA for privileged group; add approval gate for privileged role changes.",
    status: "Investigating"
  },
  {
    id: "m3",
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    asset: "Research Kubernetes Cluster",
    category: "Kubernetes",
    signal: "New namespace created without baseline policies",
    severity: "Medium",
    confidence: 72,
    whyFlagged: ["Namespace missing required NetworkPolicy", "Missing resource limits baseline", "No log-forwarding annotation present"],
    recommendedAction: "Apply namespace baseline bundle; enforce admission policy for required controls.",
    status: "Open"
  },
  {
    id: "m4",
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    asset: "Student Records DB",
    category: "Logging",
    signal: "Telemetry forwarding disabled (gap increase)",
    severity: "Medium",
    confidence: 68,
    whyFlagged: ["SIEM forwarding tag removed", "No new log sink configured", "Asset criticality elevates priority"],
    recommendedAction: "Restore SIEM forwarding; add policy requiring logs for tier-1 assets.",
    status: "Open"
  },
  {
    id: "m5",
    createdAt: new Date(Date.now() - 1000 * 60 * 1300).toISOString(),
    asset: "Facilities IoT Segment",
    category: "Network",
    signal: "Segmentation drift: IoT VLAN route expanded beyond baseline",
    severity: "Low",
    confidence: 61,
    whyFlagged: ["Baseline routes limited to required services", "New route permits broader lateral movement (demo)"],
    recommendedAction: "Review routes; tighten segmentation; monitor for additional drift.",
    status: "Ignored"
  }
];

export default function MisconfigurationAnomaliesPage() {
  const [q, setQ] = React.useState("");
  const [sev, setSev] = React.useState<"all" | "High" | "Medium" | "Low">("all");
  const [selectedId, setSelectedId] = React.useState(mock[0]?.id ?? "");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return mock
      .filter((a) => (sev === "all" ? true : a.severity === sev))
      .filter((a) => {
        if (!query) return true;
        return (
          a.asset.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          a.signal.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [q, sev]);

  const selected = filtered.find((x) => x.id === selectedId) ?? filtered[0];

  React.useEffect(() => {
    if (filtered.length && !filtered.some((x) => x.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Misconfiguration Anomalies"
        subtitle="AI-assisted signals that flag risky configuration and access changes (with ‘why flagged’ explanations)."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search anomalies (asset, signal, category)…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 420 }}
          />
          <select value={sev} onChange={(e) => setSev(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={() => alert("Demo: export anomalies as SOC ticket bundle (coming next).")}
            style={{
              marginLeft: "auto",
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#111827",
              color: "white",
              fontWeight: 900,
              cursor: "pointer"
            }}
          >
            Create SOC Tickets (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12, marginTop: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, overflowX: "auto" }}>
            <div style={{ fontWeight: 900 }}>Anomaly Feed</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Time</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Asset</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Signal</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Severity</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const c = sevColors(a.severity);
                  const active = a.id === selectedId;
                  return (
                    <tr key={a.id} style={{ background: active ? "#111827" : "transparent", color: active ? "white" : "#111827" }}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{new Date(a.createdAt).toLocaleString()}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        <div style={{ fontWeight: 900 }}>{a.asset}</div>
                        <div style={{ fontSize: 12, color: active ? "#d1d5db" : "#6b7280" }}>{a.category}</div>
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.signal}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        {pill(a.severity.toUpperCase(), active ? "white" : c.fg, active ? "rgba(255,255,255,0.12)" : c.bg)}
                        <div style={{ fontSize: 12, color: active ? "#d1d5db" : "#6b7280", marginTop: 4 }}>Conf: {a.confidence}%</div>
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.status}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        <button
                          onClick={() => setSelectedId(a.id)}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            background: active ? "white" : "#111827",
                            color: active ? "#111827" : "white",
                            fontWeight: 900,
                            cursor: "pointer"
                          }}
                        >
                          Explain
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Demo note: this is “config + infra intelligence” not generic threat feeds — ties directly to your platform’s unique methodology.
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            <div style={{ fontWeight: 900 }}>Why Flagged (Explainability)</div>
            {!selected ? (
              <div style={{ color: "#6b7280", marginTop: 10 }}>Select an anomaly.</div>
            ) : (
              <>
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 900 }}>{selected.asset}</div>
                  <div style={{ color: "#6b7280", marginTop: 4 }}>{selected.signal}</div>
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {pill(selected.category, "#111827", "white")}
                  {pill(`Confidence ${selected.confidence}%`, "#2563eb", "#eff6ff")}
                  {pill(`Status: ${selected.status}`, "#6b7280", "#f9fafb")}
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 900 }}>Signals</div>
                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {selected.whyFlagged.map((w, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 900 }}>Recommended action</div>
                  <div style={{ marginTop: 6, color: "#111827" }}>{selected.recommendedAction}</div>
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  <button
                    onClick={() => alert("Demo: open related drift events + policy violations for this asset (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    View Related Drift / Policies (Demo)
                  </button>
                  <button
                    onClick={() => alert("Demo: generate a remediation PR (GitOps) for this anomaly (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Generate Remediation PR (Demo)
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
