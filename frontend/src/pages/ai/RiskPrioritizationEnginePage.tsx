import * as React from "react";

type Asset = {
  id: string;
  name: string;
  type: "Server" | "Network" | "Cloud" | "App" | "IoT";
  owner: string;
  criticality: 1 | 2 | 3 | 4 | 5; // 5 = highest
  exposure: "Low" | "Medium" | "High";
  lifecycleRisk: "Low" | "Medium" | "High";
  drift7d: number;
  identityGap: "Low" | "Medium" | "High";
  telemetryGap: "Low" | "Medium" | "High";
  notes?: string;
};

type RiskResult = {
  assetId: string;
  score: number; // 0-100
  drivers: Array<{ label: string; value: string; weight: number; points: number }>;
  recommendation: string;
  timeToFix: "30m" | "2h" | "1d" | "3d" | "1w";
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

function sev(score: number) {
  if (score >= 80) return { label: "CRITICAL", fg: "#dc2626", bg: "#fef2f2" };
  if (score >= 60) return { label: "HIGH", fg: "#b45309", bg: "#fff7ed" };
  if (score >= 40) return { label: "MEDIUM", fg: "#2563eb", bg: "#eff6ff" };
  return { label: "LOW", fg: "#6b7280", bg: "#f9fafb" };
}

function pointsForLevel(level: "Low" | "Medium" | "High") {
  return level === "High" ? 100 : level === "Medium" ? 60 : 20;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const mockAssets: Asset[] = [
  {
    id: "a1",
    name: "Student Records DB",
    type: "Server",
    owner: "Registrar IT",
    criticality: 5,
    exposure: "Medium",
    lifecycleRisk: "High",
    drift7d: 6,
    identityGap: "Medium",
    telemetryGap: "High",
    notes: "Legacy OS signals; inconsistent logging forwarding."
  },
  {
    id: "a2",
    name: "E911 Location Service",
    type: "App",
    owner: "Telecom Ops",
    criticality: 5,
    exposure: "High",
    lifecycleRisk: "Medium",
    drift7d: 3,
    identityGap: "High",
    telemetryGap: "Medium",
    notes: "Public safety critical; privileged MFA gaps."
  },
  {
    id: "a3",
    name: "Core Network Firewall",
    type: "Network",
    owner: "Network Team",
    criticality: 4,
    exposure: "High",
    lifecycleRisk: "Medium",
    drift7d: 9,
    identityGap: "Low",
    telemetryGap: "Medium",
    notes: "Frequent rule drift; change control needs PR-based workflow."
  },
  {
    id: "a4",
    name: "Research Kubernetes Cluster",
    type: "Cloud",
    owner: "Research IT",
    criticality: 3,
    exposure: "Medium",
    lifecycleRisk: "Low",
    drift7d: 5,
    identityGap: "Medium",
    telemetryGap: "Medium",
    notes: "Policy-as-code coverage incomplete; namespace controls inconsistent."
  },
  {
    id: "a5",
    name: "Facilities IoT Segment",
    type: "IoT",
    owner: "Facilities",
    criticality: 2,
    exposure: "High",
    lifecycleRisk: "High",
    drift7d: 1,
    identityGap: "Low",
    telemetryGap: "High",
    notes: "Weak visibility; needs segmentation and logging baseline."
  }
];

type Weights = {
  criticality: number;
  exposure: number;
  lifecycle: number;
  drift: number;
  identity: number;
  telemetry: number;
};

const defaultWeights: Weights = {
  criticality: 0.25,
  exposure: 0.20,
  lifecycle: 0.15,
  drift: 0.15,
  identity: 0.15,
  telemetry: 0.10
};

function normalizeWeights(w: Weights): Weights {
  const sum = Object.values(w).reduce((a, b) => a + b, 0);
  if (sum === 0) return defaultWeights;
  return {
    criticality: w.criticality / sum,
    exposure: w.exposure / sum,
    lifecycle: w.lifecycle / sum,
    drift: w.drift / sum,
    identity: w.identity / sum,
    telemetry: w.telemetry / sum
  };
}

function computeRisk(asset: Asset, weights: Weights): RiskResult {
  const w = normalizeWeights(weights);

  const crit = (asset.criticality / 5) * 100;
  const exp = pointsForLevel(asset.exposure);
  const life = pointsForLevel(asset.lifecycleRisk);
  const drift = clamp((asset.drift7d / 10) * 100, 0, 100);
  const id = pointsForLevel(asset.identityGap);
  const tel = pointsForLevel(asset.telemetryGap);

  const drivers = [
    { label: "Criticality", value: `${asset.criticality}/5`, weight: w.criticality, points: Math.round(crit * w.criticality) },
    { label: "Exposure", value: asset.exposure, weight: w.exposure, points: Math.round(exp * w.exposure) },
    { label: "Lifecycle risk", value: asset.lifecycleRisk, weight: w.lifecycle, points: Math.round(life * w.lifecycle) },
    { label: "Drift (7d)", value: String(asset.drift7d), weight: w.drift, points: Math.round(drift * w.drift) },
    { label: "Identity gap", value: asset.identityGap, weight: w.identity, points: Math.round(id * w.identity) },
    { label: "Telemetry gap", value: asset.telemetryGap, weight: w.telemetry, points: Math.round(tel * w.telemetry) }
  ];

  const score = clamp(drivers.reduce((s, d) => s + d.points, 0), 0, 100);

  const recommendation =
    score >= 80
      ? "Immediate: reduce exposure + enforce MFA + remediate drift using PR-based change controls."
      : score >= 60
        ? "Prioritize: close identity/logging gaps and address drift hotspots."
        : score >= 40
          ? "Planned: include in next wave; monitor and standardize baselines."
          : "Monitor: low priority; keep visibility and telemetry improving.";

  const timeToFix: RiskResult["timeToFix"] =
    score >= 80 ? "1d" : score >= 60 ? "3d" : score >= 40 ? "1w" : "2h";

  return { assetId: asset.id, score, drivers, recommendation, timeToFix };
}

function SliderRow({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", gap: 10, alignItems: "center" }}>
      <div style={{ fontWeight: 900, color: "#111827" }}>{label}</div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
      />
      <div style={{ textAlign: "right", fontWeight: 900 }}>{Math.round(value * 100)}%</div>
    </div>
  );
}

export default function RiskPrioritizationEnginePage() {
  const [weights, setWeights] = React.useState<Weights>(defaultWeights);
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string>(mockAssets[0]?.id ?? "");

  const results = React.useMemo(() => {
    return mockAssets
      .map((a) => ({ asset: a, risk: computeRisk(a, weights) }))
      .filter(({ asset }) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          asset.name.toLowerCase().includes(q) ||
          asset.owner.toLowerCase().includes(q) ||
          asset.type.toLowerCase().includes(q)
        );
      })
      .sort((x, y) => y.risk.score - x.risk.score);
  }, [weights, query]);

  const selected = results.find((r) => r.asset.id === selectedId) ?? results[0];
  const selectedRisk = selected?.risk;
  const selectedAsset = selected?.asset;

  React.useEffect(() => {
    if (results.length && !results.some((r) => r.asset.id === selectedId)) {
      setSelectedId(results[0].asset.id);
    }
  }, [results, selectedId]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Risk Prioritization Engine"
        subtitle="Explainable multi-signal scoring: criticality + exposure + lifecycle + drift + identity + telemetry."
        right={pill("Explainable", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            <div style={{ fontWeight: 900 }}>Weights (demo)</div>
            <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>
              Adjust weights to show how priorities change without “black box” behavior.
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <SliderRow label="Criticality" value={weights.criticality} onChange={(v) => setWeights((w) => ({ ...w, criticality: v }))} />
              <SliderRow label="Exposure" value={weights.exposure} onChange={(v) => setWeights((w) => ({ ...w, exposure: v }))} />
              <SliderRow label="Lifecycle" value={weights.lifecycle} onChange={(v) => setWeights((w) => ({ ...w, lifecycle: v }))} />
              <SliderRow label="Drift" value={weights.drift} onChange={(v) => setWeights((w) => ({ ...w, drift: v }))} />
              <SliderRow label="Identity gap" value={weights.identity} onChange={(v) => setWeights((w) => ({ ...w, identity: v }))} />
              <SliderRow label="Telemetry gap" value={weights.telemetry} onChange={(v) => setWeights((w) => ({ ...w, telemetry: v }))} />
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => setWeights(defaultWeights)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  fontWeight: 900,
                  cursor: "pointer"
                }}
              >
                Reset
              </button>
              <button
                onClick={() => alert("Demo: save scoring profile per institution (coming next).")}
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  background: "#111827",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer"
                }}
              >
                Save Profile (Demo)
              </button>
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Prioritized Remediation Queue</div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets (name, owner, type)…"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb"
                }}
              />
            </div>

            <div style={{ marginTop: 10, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Asset</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Risk</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>ETA</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(({ asset, risk }) => {
                    const s = sev(risk.score);
                    const active = asset.id === selectedId;
                    return (
                      <tr key={asset.id} style={{ background: active ? "#111827" : "transparent", color: active ? "white" : "#111827" }}>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                          <div style={{ fontWeight: 900 }}>{asset.name}</div>
                          <div style={{ fontSize: 12, color: active ? "#d1d5db" : "#6b7280" }}>{asset.type}</div>
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{asset.owner}</td>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                          {pill(`${risk.score}% ${s.label}`, active ? "white" : s.fg, active ? "rgba(255,255,255,0.12)" : s.bg)}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{risk.timeToFix}</td>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                          <button
                            onClick={() => setSelectedId(asset.id)}
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
            </div>

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Demo angle: show that prioritization is transparent (weights + drivers), not “mystery AI”.
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Explainability Panel"
        subtitle="Why this asset is prioritized (drivers + points)."
        right={selectedRisk ? pill(`${selectedRisk.score}%`, sev(selectedRisk.score).fg, sev(selectedRisk.score).bg) : undefined}
      >
        {!selectedAsset || !selectedRisk ? (
          <div style={{ color: "#6b7280" }}>Select an asset from the queue.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ fontWeight: 900 }}>{selectedAsset.name}</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>
                {selectedAsset.type} • Owner: {selectedAsset.owner}
              </div>
              <div style={{ marginTop: 10, color: "#111827" }}>
                <strong>Recommendation:</strong> {selectedRisk.recommendation}
              </div>
              {selectedAsset.notes && (
                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                  <strong>Notes:</strong> {selectedAsset.notes}
                </div>
              )}
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => alert("Demo: open policy-as-code violations for this asset (coming next).")}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  View Guardrail Violations (Demo)
                </button>
                <button
                  onClick={() => alert("Demo: generate a remediation plan / PR (coming next).")}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  Generate Remediation Plan (Demo)
                </button>
              </div>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
              <div style={{ fontWeight: 900 }}>Drivers & Points</div>
              <div style={{ marginTop: 10, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Signal</th>
                      <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Value</th>
                      <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Weight</th>
                      <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRisk.drivers.map((d) => (
                      <tr key={d.label}>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{d.label}</td>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.value}</td>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{Math.round(d.weight * 100)}%</td>
                        <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{d.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                This is NIW-friendly: explainable, auditable methodology (not opaque model outputs).
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
