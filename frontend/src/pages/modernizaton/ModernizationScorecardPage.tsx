import { useEffect, useMemo, useState } from "react";
import { mockApi, type ModernizationDashboard } from "../../mockApi";

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle ? <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div> : null}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function ScoreTile({
  label,
  score,
  hint
}: {
  label: string;
  score: number;
  hint: string;
}) {
  const badge =
    score >= 80 ? "Strong" : score >= 60 ? "Moderate" : "Needs work";

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontWeight: 900 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{badge}</div>
      </div>
      <div style={{ marginTop: 8, fontSize: 28, fontWeight: 900 }}>{score}%</div>
      <div style={{ marginTop: 8, height: 10, borderRadius: 999, background: "#f3f4f6", overflow: "hidden", border: "1px solid #e5e7eb" }}>
        <div style={{ width: `${score}%`, height: "100%", background: "#111827" }} />
      </div>
      <div style={{ marginTop: 10, color: "#6b7280" }}>{hint}</div>
    </div>
  );
}

function buildRecs(m: ModernizationDashboard | null) {
  if (!m) return [];
  const recs: string[] = [];

  if (m.totals.unknownAssets > 0) recs.push(`Reduce unknown assets (${m.totals.unknownAssets}) by improving discovery and classification workflows.`);
  if (m.totals.untagged > 0) recs.push(`Increase standardization: ${m.totals.untagged} assets have no tags (owner, env, logging, criticality).`);
  if (m.totals.outdated > 0) recs.push(`Prioritize lifecycle upgrades: ${m.totals.outdated} assets flagged as legacy (demo heuristic).`);

  if (m.scores.visibility < 70) recs.push("Improve visibility: ensure hostname + IP + asset type are captured consistently.");
  if (m.scores.loggingReadiness < 60) recs.push("Improve telemetry readiness: expand logs/SIEM forwarding coverage to critical assets.");
  if (m.scores.standardization < 60) recs.push("Create tagging standards and enforce them through automation (policy-as-code).");

  if (recs.length === 0) recs.push("Modernization posture looks solid for a pilot. Expand inventory scope and add trends by month next.");

  return recs;
}

export default function ModernizationScorecardPage() {
  const institutionId = localStorage.getItem("inst") ?? "inst_demo_1";

  const [loading, setLoading] = useState(false);
  const [mod, setMod] = useState<ModernizationDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const m = await mockApi.getModernizationDashboard(institutionId);
      setMod(m);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load scorecard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const recs = useMemo(() => buildRecs(mod), [mod]);

  // "Configuration Consistency Score" — for demo: reuse standardization as proxy unless you later add drift-bucket into modernization.
  const configConsistency = mod?.scores.standardization ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel
        title="Modernization Scorecard"
        subtitle="Explainable, vendor-neutral readiness scoring for modernization planning (visibility, lifecycle, consistency, telemetry)."
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={load}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #111827", background: "#111827", color: "white", cursor: "pointer", fontWeight: 800 }}
          >
            {loading ? "Refreshing..." : "Refresh"}
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
          <ScoreTile
            label="Asset Visibility"
            score={mod?.scores.visibility ?? 0}
            hint="Completeness of hostname + IP + type across the inventory."
          />
          <ScoreTile
            label="Lifecycle / Legacy"
            score={mod?.scores.lifecycle ?? 0}
            hint="Lower legacy concentration improves stability and security posture."
          />
          <ScoreTile
            label="Configuration Consistency"
            score={configConsistency}
            hint="Proxy for governance consistency (tagging/standards). Extend with drift signals later."
          />
          <ScoreTile
            label="Telemetry Readiness"
            score={mod?.scores.loggingReadiness ?? 0}
            hint="Coverage of logging/SIEM forwarding markers (demo tags)."
          />
        </div>
      </Panel>

      <Panel title="Recommendations" subtitle="Auto-generated based on the scorecard signals.">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {recs.map((r, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {r}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Trend Placeholder" subtitle="In the full platform, scores persist over time for benchmarking and progress reporting.">
        <div style={{ color: "#6b7280" }}>
          MVP demo idea: store monthly snapshots and show a simple line chart of score improvement over time.
          <br />
          (Frontend-only) We can simulate this next with mock history in localStorage.
        </div>
      </Panel>
    </div>
  );
}
