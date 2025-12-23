import * as React from "react";

type TelemetrySignal = {
  id: string;
  asset: string;
  owner: string;
  logsForwarded: boolean;
  metricsEnabled: boolean;
  tracingEnabled: boolean;
  siemConnected: boolean;
  tags: string[];
};

const mockSignals: TelemetrySignal[] = [
  { id: "t-1", asset: "API Server Cluster", owner: "Platform Team", logsForwarded: true, metricsEnabled: true, tracingEnabled: false, siemConnected: true, tags: ["logs:on", "siem:on"] },
  { id: "t-2", asset: "Legacy Windows Server 2012", owner: "Facilities IT", logsForwarded: false, metricsEnabled: false, tracingEnabled: false, siemConnected: false, tags: [] },
  { id: "t-3", asset: "Core Switch Stack", owner: "NetOps", logsForwarded: true, metricsEnabled: true, tracingEnabled: false, siemConnected: true, tags: ["logs:on", "siem:on"] },
  { id: "t-4", asset: "Student Services App", owner: "App Team", logsForwarded: true, metricsEnabled: false, tracingEnabled: false, siemConnected: true, tags: ["logs:on"] },
  { id: "t-5", asset: "Shared Postgres", owner: "DBA Team", logsForwarded: true, metricsEnabled: true, tracingEnabled: false, siemConnected: true, tags: ["logs:on", "siem:on"] }
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

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export default function TelemetryReadinessPage() {
  const [owner, setOwner] = React.useState("all");
  const owners = React.useMemo(() => Array.from(new Set(mockSignals.map((x) => x.owner))), []);

  const rows = mockSignals.filter((x) => (owner === "all" ? true : x.owner === owner));

  const total = rows.length;
  const logs = rows.filter((x) => x.logsForwarded).length;
  const metrics = rows.filter((x) => x.metricsEnabled).length;
  const tracing = rows.filter((x) => x.tracingEnabled).length;
  const siem = rows.filter((x) => x.siemConnected).length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Telemetry Readiness"
        subtitle="Track logging/metrics/tracing readiness and SIEM connectivity. Strong telemetry is a prerequisite for modernization and security monitoring."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select value={owner} onChange={(e) => setOwner(e.target.value)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All owners</option>
            {owners.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
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
            onClick={() => alert("Demo: create a telemetry rollout plan based on gaps (coming next).")}
          >
            Generate Telemetry Rollout Plan (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14 }}>
          <KPI label="Log forwarding coverage" value={`${pct(logs, total)}%`} />
          <KPI label="Metrics coverage" value={`${pct(metrics, total)}%`} />
          <KPI label="Tracing coverage" value={`${pct(tracing, total)}%`} />
          <KPI label="SIEM connected" value={`${pct(siem, total)}%`} />
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Asset</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Logs</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Metrics</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Tracing</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>SIEM</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Tags</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{x.asset}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.owner}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.logsForwarded ? "✅" : "❌"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.metricsEnabled ? "✅" : "❌"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.tracingEnabled ? "✅" : "❌"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{x.siemConnected ? "✅" : "❌"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <span style={{ color: "#6b7280" }}>{x.tags.length ? x.tags.join(", ") : "(none)"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Suggested Actions (demo)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Enforce “logs:on” and “siem:on” tags as a baseline policy for critical assets.</li>
            <li>Prioritize telemetry rollout for EOL systems and tier-0 services to reduce blind spots.</li>
            <li>Use standard templates (agents/forwarders) to reduce per-institution customization.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
