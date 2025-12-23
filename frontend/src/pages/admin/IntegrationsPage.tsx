import * as React from "react";

type IntegrationType = "Cloud" | "Identity" | "SIEM/Logging" | "Vuln Scanner" | "CI/CD" | "Ticketing" | "Email/SMS";

type Integration = {
  id: string;
  name: string;
  type: IntegrationType;
  vendor: string;
  status: "Connected" | "Not Connected" | "Error" | "Paused";
  lastSyncAt?: string;
  scopes: string[];
  dataProduced: string[]; // signals your platform derives
  notes?: string;
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

function statusPill(s: Integration["status"]) {
  if (s === "Connected") return pill("CONNECTED", "#16a34a", "#f0fdf4");
  if (s === "Paused") return pill("PAUSED", "#b45309", "#fff7ed");
  if (s === "Error") return pill("ERROR", "#dc2626", "#fef2f2");
  return pill("NOT CONNECTED", "#6b7280", "#f9fafb");
}

const seedIntegrations: Integration[] = [
  {
    id: "i1",
    name: "AWS Account Connector",
    type: "Cloud",
    vendor: "AWS",
    status: "Not Connected",
    scopes: ["Read-only inventory", "Config metadata"],
    dataProduced: ["Cloud asset inventory", "Lifecycle signals", "Exposure hints"],
    notes: "Use least-privilege role + read-only policies."
  },
  {
    id: "i2",
    name: "Azure Subscription Connector",
    type: "Cloud",
    vendor: "Azure",
    status: "Paused",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    scopes: ["Read-only inventory"],
    dataProduced: ["Cloud asset inventory", "Tag standardization coverage"]
  },
  {
    id: "i3",
    name: "Identity Provider",
    type: "Identity",
    vendor: "Okta/Azure AD",
    status: "Connected",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    scopes: ["User + group read", "MFA status", "Privileged roles read"],
    dataProduced: ["MFA coverage", "SSO coverage", "Privileged accounts list", "Stale accounts"]
  },
  {
    id: "i4",
    name: "SIEM/Logging",
    type: "SIEM/Logging",
    vendor: "Splunk/Elastic",
    status: "Connected",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    scopes: ["Log source inventory", "Forwarder status read"],
    dataProduced: ["Telemetry readiness", "SOC signals", "Coverage gaps"]
  },
  {
    id: "i5",
    name: "Vulnerability Scanner",
    type: "Vuln Scanner",
    vendor: "Tenable/Qualys",
    status: "Error",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    scopes: ["Findings read"],
    dataProduced: ["Vulnerability posture", "Critical exposure list"],
    notes: "Token expired (demo)."
  },
  {
    id: "i6",
    name: "CI/CD Connector",
    type: "CI/CD",
    vendor: "GitHub/GitLab",
    status: "Not Connected",
    scopes: ["Pipeline metadata read", "Artifacts read (SBOM)"],
    dataProduced: ["SBOM presence", "Provenance presence", "Policy gate status"]
  },
  {
    id: "i7",
    name: "Ticketing",
    type: "Ticketing",
    vendor: "ServiceNow/Jira",
    status: "Not Connected",
    scopes: ["Create tickets", "Update status"],
    dataProduced: ["Roadmap tasks", "Remediation tracking"]
  }
];

export default function IntegrationsPage() {
  const [items, setItems] = React.useState<Integration[]>(seedIntegrations);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? "");
  const selected = items.find((x) => x.id === selectedId) ?? items[0];

  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<IntegrationType | "All">("All");
  const [status, setStatus] = React.useState<Integration["status"] | "All">("All");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((x) => (type === "All" ? true : x.type === type))
      .filter((x) => (status === "All" ? true : x.status === status))
      .filter((x) => {
        if (!query) return true;
        return (
          x.name.toLowerCase().includes(query) ||
          x.vendor.toLowerCase().includes(query) ||
          x.type.toLowerCase().includes(query)
        );
      });
  }, [items, q, type, status]);

  React.useEffect(() => {
    if (filtered.length && !filtered.some((x) => x.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  function updateSelected(patch: Partial<Integration>) {
    if (!selected) return;
    setItems((prev) => prev.map((x) => (x.id === selected.id ? { ...x, ...patch } : x)));
  }

  function connect() {
    if (!selected) return;
    updateSelected({ status: "Connected", lastSyncAt: new Date().toISOString(), notes: "" });
    alert("Demo: integration connected (wire OAuth/keys + backend later).");
  }

  function testSync() {
    if (!selected) return;
    updateSelected({ lastSyncAt: new Date().toISOString() });
    alert("Demo: test sync ran and refreshed signals (wire to backend later).");
  }

  function disconnect() {
    if (!selected) return;
    updateSelected({ status: "Not Connected" });
    alert("Demo: integration disconnected.");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Integrations"
        subtitle="Connect identity, logging/SIEM, cloud inventory, vulnerability scanners, and CI/CD so the platform can produce reusable posture signals."
        right={pill("Connectors", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search integrations…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 320 }}
          />

          <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All types</option>
            <option value="Cloud">Cloud</option>
            <option value="Identity">Identity</option>
            <option value="SIEM/Logging">SIEM/Logging</option>
            <option value="Vuln Scanner">Vuln Scanner</option>
            <option value="CI/CD">CI/CD</option>
            <option value="Ticketing">Ticketing</option>
            <option value="Email/SMS">Email/SMS</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All status</option>
            <option value="Connected">Connected</option>
            <option value="Not Connected">Not Connected</option>
            <option value="Paused">Paused</option>
            <option value="Error">Error</option>
          </select>

          <button
            onClick={() => alert("Demo: add custom connector blueprint (future).")}
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
            + Add Connector (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: 12, marginTop: 12 }}>
          {/* list */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Connector Catalog</div>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {filtered.map((x) => {
                const active = x.id === selectedId;
                return (
                  <div
                    key={x.id}
                    onClick={() => setSelectedId(x.id)}
                    style={{
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 12,
                      background: active ? "#111827" : "white",
                      color: active ? "white" : "#111827"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 900 }}>{x.name}</div>
                      <div style={{ marginLeft: "auto" }}>
                        {active ? pill(x.status.toUpperCase(), "white", "rgba(255,255,255,0.12)") : statusPill(x.status)}
                      </div>
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Type: {x.type} • Vendor: {x.vendor}
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Last sync: {x.lastSyncAt ? new Date(x.lastSyncAt).toLocaleString() : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* detail */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            {!selected ? (
              <div style={{ color: "#6b7280" }}>Select a connector.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{selected.name}</div>
                  <div style={{ marginLeft: "auto" }}>{statusPill(selected.status)}</div>
                </div>

                <div style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>
                  Type: <b>{selected.type}</b> • Vendor: <b>{selected.vendor}</b>
                </div>

                <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                  <div style={{ fontWeight: 900 }}>Scopes (Least Privilege)</div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selected.scopes.map((s) => pill(s, "#111827", "#f9fafb"))}
                  </div>
                  <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                    Demo: show that your platform is designed to be interoperable + minimally invasive.
                  </div>
                </div>

                <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                  <div style={{ fontWeight: 900 }}>Signals Produced</div>
                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    {selected.dataProduced.map((d) => (
                      <div key={d} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 10, background: "#fafafa", fontWeight: 900 }}>
                        {d}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                  <div style={{ fontWeight: 900 }}>Notes</div>
                  <textarea
                    value={selected.notes ?? ""}
                    onChange={(e) => updateSelected({ notes: e.target.value })}
                    rows={3}
                    style={{ marginTop: 8, padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: "100%", resize: "vertical" }}
                    placeholder="Connector notes, error details, requirements…"
                  />
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  {selected.status !== "Connected" ? (
                    <button
                      onClick={connect}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Connect (Demo)
                    </button>
                  ) : (
                    <button
                      onClick={testSync}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Test Sync (Demo)
                    </button>
                  )}

                  <button
                    onClick={() => updateSelected({ status: "Paused" })}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Pause
                  </button>

                  <button
                    onClick={disconnect}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Disconnect
                  </button>

                  <button
                    onClick={() => alert("Demo: rotate tokens / view audit events (future).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#eff6ff", color: "#2563eb", fontWeight: 900, cursor: "pointer" }}
                  >
                    Credential Hygiene (Demo)
                  </button>
                </div>

                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                  Last sync: {selected.lastSyncAt ? new Date(selected.lastSyncAt).toLocaleString() : "—"}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
