import * as React from "react";

type Asset = {
  id: string;
  name: string;
  type: "server" | "network" | "app" | "db";
  osOrFirmware: string;
  owner: string;
  lifecycle: "supported" | "approaching_eol" | "eol";
  lastSeen: string;
  notes?: string;
};

const mockAssets: Asset[] = [
  { id: "a-101", name: "Windows Server 2012 (Finance)", type: "server", osOrFirmware: "Windows Server 2012", owner: "Finance IT", lifecycle: "eol", lastSeen: "2025-12-18", notes: "Legacy app dependency" },
  { id: "a-102", name: "Ubuntu 16 VM (Dept App)", type: "server", osOrFirmware: "Ubuntu 16.04", owner: "Dept IT", lifecycle: "eol", lastSeen: "2025-12-12" },
  { id: "a-103", name: "Core Switch Stack", type: "network", osOrFirmware: "IOS-XE 17.3", owner: "NetOps", lifecycle: "supported", lastSeen: "2025-12-19" },
  { id: "a-104", name: "Oracle Legacy DB", type: "db", osOrFirmware: "Oracle 12c", owner: "DBA Team", lifecycle: "approaching_eol", lastSeen: "2025-12-19", notes: "Upgrade path planned" },
  { id: "a-105", name: "Public Portal App", type: "app", osOrFirmware: "Node 18 LTS", owner: "Platform Team", lifecycle: "supported", lastSeen: "2025-12-20" }
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

function kpi(label: string, value: string) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 800 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function lifeColor(l: Asset["lifecycle"]) {
  if (l === "eol") return "#dc2626";
  if (l === "approaching_eol") return "#d97706";
  return "#16a34a";
}

function lifeLabel(l: Asset["lifecycle"]) {
  if (l === "eol") return "EOL";
  if (l === "approaching_eol") return "Approaching EOL";
  return "Supported";
}

export default function LifecycleTechnicalDebtPage() {
  const [owner, setOwner] = React.useState<string>("all");
  const [status, setStatus] = React.useState<Asset["lifecycle"] | "all">("all");

  const owners = React.useMemo(() => Array.from(new Set(mockAssets.map((a) => a.owner))), []);

  const filtered = mockAssets.filter((a) => {
    const okOwner = owner === "all" ? true : a.owner === owner;
    const okStatus = status === "all" ? true : a.lifecycle === status;
    return okOwner && okStatus;
  });

  const eol = mockAssets.filter((a) => a.lifecycle === "eol").length;
  const approaching = mockAssets.filter((a) => a.lifecycle === "approaching_eol").length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Lifecycle & Technical Debt"
        subtitle="Identify EOL/legacy systems, quantify risk, and generate an upgrade plan tied to modernization readiness."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {kpi("Total tracked assets", String(mockAssets.length))}
          {kpi("EOL assets", String(eol))}
          {kpi("Approaching EOL", String(approaching))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <select value={owner} onChange={(e) => setOwner(e.target.value)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All owners</option>
            {owners.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All lifecycle states</option>
            <option value="supported">Supported</option>
            <option value="approaching_eol">Approaching EOL</option>
            <option value="eol">EOL</option>
          </select>

          <button
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
            onClick={() => alert("Demo: generate an upgrade plan + milestones (coming next).")}
          >
            Generate Upgrade Plan (Demo)
          </button>
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Asset</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Type</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>OS / Firmware</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Lifecycle</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <div style={{ fontWeight: 900 }}>{a.name}</div>
                    {a.notes && <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{a.notes}</div>}
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.type}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.osOrFirmware}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.owner}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "2px 10px",
                        borderRadius: 999,
                        border: "1px solid #e5e7eb",
                        fontWeight: 900,
                        fontSize: 12,
                        color: lifeColor(a.lifecycle),
                        background: "#fff"
                      }}
                    >
                      {lifeLabel(a.lifecycle)}
                    </span>
                  </td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Suggested Actions (demo)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18, color: "#111827" }}>
            <li>Prioritize EOL assets in high-impact services first (finance, citizen services, emergency systems).</li>
            <li>Create a dependency map for each EOL system to avoid outage during upgrades.</li>
            <li>Convert recurring fixes into baseline templates (golden config) for repeatability across institutions.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
