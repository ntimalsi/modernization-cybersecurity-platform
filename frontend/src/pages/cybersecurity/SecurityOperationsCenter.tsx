import { useEffect, useMemo, useState } from "react";
import {
  mockApi,
  type DriftEvent,
  type ZeroTrustCheck,
  type ModernizationDashboard,
  type CybersecurityDashboard
} from "../../mockApi";

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle ? <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div> : null}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 12 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function severityFromSignals(m: ModernizationDashboard | null, c: CybersecurityDashboard | null) {
  const unknown = m?.totals.unknownAssets ?? 0;
  const outdated = m?.totals.outdated ?? 0;
  const drift = c?.totals.driftEvents ?? 0;
  const zt = c?.zeroTrustScore ?? 0;

  // Demo heuristic
  let score = 0;
  score += Math.min(unknown * 2, 25);
  score += Math.min(outdated * 2, 25);
  score += Math.min(drift * 3, 30);
  score += Math.max(0, 20 - Math.floor(zt / 5)); // lower ZT => more risk

  const level = score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";
  return { score, level };
}

export default function SecurityOperationsCenter() {
  const institutionId = localStorage.getItem("inst") ?? "inst_demo_1";

  const [loading, setLoading] = useState(false);
  const [m, setM] = useState<ModernizationDashboard | null>(null);
  const [c, setC] = useState<CybersecurityDashboard | null>(null);
  const [drift, setDrift] = useState<DriftEvent[]>([]);
  const [zt, setZt] = useState<{ score: number; checks: ZeroTrustCheck[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [mm, cc, d, z] = await Promise.all([
        mockApi.getModernizationDashboard(institutionId),
        mockApi.getCybersecurityDashboard(institutionId),
        mockApi.listDrift(institutionId),
        mockApi.listZeroTrust(institutionId)
      ]);
      setM(mm);
      setC(cc);
      setDrift(d);
      setZt(z);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load SOC");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const missingControls = useMemo(() => (zt?.checks ?? []).filter((x) => !x.passed), [zt]);

  const risk = useMemo(() => severityFromSignals(m, c), [m, c]);

  const topActions = useMemo(() => {
    const actions: string[] = [];
    if ((m?.totals.unknownAssets ?? 0) > 0) actions.push("Classify unknown assets and enforce inventory completeness.");
    if ((m?.totals.outdated ?? 0) > 0) actions.push("Prioritize lifecycle upgrades for legacy OS/FW systems.");
    if ((c?.totals.driftEvents ?? 0) > 0) actions.push("Review drift events; lock baselines and change windows.");
    if ((zt?.score ?? 0) < 70) actions.push("Raise Zero Trust readiness by addressing missing baseline controls.");
    if (actions.length === 0) actions.push("Posture looks stable for pilot. Expand coverage and enable reporting automation.");
    return actions.slice(0, 6);
  }, [m, c, zt]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel
        title="Security Operations Center (SOC)"
        subtitle="Unified operational view that correlates modernization + drift + Zero Trust + compliance signals."
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={load}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #111827", background: "#111827", color: "white", cursor: "pointer", fontWeight: 900 }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <div style={{ color: "#6b7280" }}>
            Institution: <code>{institutionId}</code>
          </div>
        </div>

        {error ? (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 12, border: "1px solid #f5c2c7", background: "#f8d7da" }}>
            {error}
          </div>
        ) : null}

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Card label="Operational Risk (demo)" value={`${risk.level} (${risk.score})`} />
          <Card label="Unknown Assets" value={m?.totals.unknownAssets ?? 0} />
          <Card label="Drift Events" value={c?.totals.driftEvents ?? 0} />
          <Card label="Zero Trust Score" value={`${zt?.score ?? 0}%`} />
        </div>
      </Panel>

      <Panel title="Top Actions" subtitle="Prioritized remediation guidance generated from platform signals (demo heuristic).">
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          {topActions.map((a, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {a}
            </li>
          ))}
        </ol>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14 }}>
        <Panel title="Recent Drift" subtitle="Quick visibility into the most recent changes.">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Time</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Asset</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Summary</th>
              </tr>
            </thead>
            <tbody>
              {(drift ?? []).slice(0, 6).map((e) => (
                <tr key={e.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{new Date(e.createdAt).toLocaleString()}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{e.hostname ?? e.ip ?? "(unknown)"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{e.summary}</td>
                </tr>
              ))}
              {drift.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: 12, color: "#6b7280" }}>
                    No drift events yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </Panel>

        <Panel title="Missing Zero Trust Controls" subtitle="A compact view for understaffed teams.">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {missingControls.slice(0, 10).map((c) => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                {c.title}
              </li>
            ))}
            {missingControls.length === 0 ? (
              <li style={{ color: "#6b7280" }}>No missing controls.</li>
            ) : null}
          </ul>
        </Panel>
      </div>

      <Panel title="What this demonstrates (NIW-friendly)" subtitle="A scalable control-plane view that helps public institutions operate with limited resources.">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li style={{ marginBottom: 8 }}>
            Correlates modernization + security + compliance signals into one decision layer (portable methodology).
          </li>
          <li style={{ marginBottom: 8 }}>
            Helps institutions without full SOC budgets prioritize risk and remediation.
          </li>
          <li>
            Supports nationwide resilience through consistent operational visibility and evidence-ready reporting.
          </li>
        </ul>
      </Panel>
    </div>
  );
}
