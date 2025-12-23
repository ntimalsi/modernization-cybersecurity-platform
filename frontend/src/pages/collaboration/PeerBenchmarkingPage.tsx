import * as React from "react";

type MetricKey =
  | "Modernization Score"
  | "Zero Trust Score"
  | "Telemetry Readiness"
  | "Drift Rate"
  | "Identity Posture"
  | "Supply Chain Coverage";

type PeerGroup = "R1 Universities" | "Regional Universities" | "K-12 Districts" | "Municipal/County" | "Public Safety";

type PeerRow = {
  id: string;
  institution: string;
  group: PeerGroup;
  region: string;
  size: "Small" | "Medium" | "Large";
  modernization: number;
  zerotrust: number;
  telemetry: number;
  driftRate: number; // 0-100 (lower is better)
  identity: number;
  supplyChain: number;
  optedIn: boolean;
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

function scorePill(score: number) {
  if (score >= 80) return pill(`${score}`, "#16a34a", "#f0fdf4");
  if (score >= 60) return pill(`${score}`, "#b45309", "#fff7ed");
  return pill(`${score}`, "#dc2626", "#fef2f2");
}

const seedPeers: PeerRow[] = [
  {
    id: "p_you",
    institution: "Your Institution (Pilot)",
    group: "R1 Universities",
    region: "Mid-Atlantic",
    size: "Large",
    modernization: 66,
    zerotrust: 58,
    telemetry: 61,
    driftRate: 42,
    identity: 55,
    supplyChain: 38,
    optedIn: true
  },
  {
    id: "p1",
    institution: "Peer A (Anonymized)",
    group: "R1 Universities",
    region: "Northeast",
    size: "Large",
    modernization: 72,
    zerotrust: 64,
    telemetry: 70,
    driftRate: 35,
    identity: 62,
    supplyChain: 45,
    optedIn: true
  },
  {
    id: "p2",
    institution: "Peer B (Anonymized)",
    group: "R1 Universities",
    region: "South",
    size: "Large",
    modernization: 58,
    zerotrust: 49,
    telemetry: 52,
    driftRate: 55,
    identity: 46,
    supplyChain: 22,
    optedIn: true
  },
  {
    id: "p3",
    institution: "Peer C (Anonymized)",
    group: "Regional Universities",
    region: "Midwest",
    size: "Medium",
    modernization: 63,
    zerotrust: 57,
    telemetry: 54,
    driftRate: 48,
    identity: 53,
    supplyChain: 30,
    optedIn: true
  },
  {
    id: "p4",
    institution: "Peer D (Anonymized)",
    group: "Municipal/County",
    region: "West",
    size: "Medium",
    modernization: 51,
    zerotrust: 44,
    telemetry: 41,
    driftRate: 60,
    identity: 42,
    supplyChain: 18,
    optedIn: true
  }
];

function getMetric(row: PeerRow, key: MetricKey): number {
  switch (key) {
    case "Modernization Score":
      return row.modernization;
    case "Zero Trust Score":
      return row.zerotrust;
    case "Telemetry Readiness":
      return row.telemetry;
    case "Drift Rate":
      return row.driftRate;
    case "Identity Posture":
      return row.identity;
    case "Supply Chain Coverage":
      return row.supplyChain;
  }
}

function percentileRank(values: number[], v: number, lowerIsBetter: boolean) {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = sorted.findIndex((x) => x >= v);
  const pos = idx === -1 ? sorted.length - 1 : idx;
  const pct = Math.round((pos / Math.max(1, sorted.length - 1)) * 100);
  return lowerIsBetter ? 100 - pct : pct;
}

export default function PeerBenchmarkingPage() {
  const [optIn, setOptIn] = React.useState(true);
  const [group, setGroup] = React.useState<PeerGroup | "All">("R1 Universities");
  const [metric, setMetric] = React.useState<MetricKey>("Modernization Score");
  const [q, setQ] = React.useState("");

  const rows = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return seedPeers
      .filter((r) => (optIn ? r.optedIn : true))
      .filter((r) => (group === "All" ? true : r.group === group))
      .filter((r) => {
        if (!query) return true;
        return r.institution.toLowerCase().includes(query) || r.region.toLowerCase().includes(query);
      });
  }, [optIn, group, q]);

  const you = seedPeers.find((p) => p.id === "p_you")!;
  const values = rows.map((r) => getMetric(r, metric));
  const lowerIsBetter = metric === "Drift Rate";
  const yourMetricVal = getMetric(you, metric);
  const yourPct = percentileRank(values, yourMetricVal, lowerIsBetter);

  const gapInsights = React.useMemo(() => {
    // Identify lowest 2 areas for you
    const pairs: Array<{ key: MetricKey; value: number; lowerIsBetter?: boolean }> = [
      { key: "Modernization Score", value: you.modernization },
      { key: "Zero Trust Score", value: you.zerotrust },
      { key: "Telemetry Readiness", value: you.telemetry },
      { key: "Drift Rate", value: you.driftRate, lowerIsBetter: true },
      { key: "Identity Posture", value: you.identity },
      { key: "Supply Chain Coverage", value: you.supplyChain }
    ];
    const sorted = [...pairs].sort((a, b) => {
      // normalize so "lower is worse" always
      const av = a.lowerIsBetter ? 100 - a.value : a.value;
      const bv = b.lowerIsBetter ? 100 - b.value : b.value;
      return av - bv;
    });
    return sorted.slice(0, 2);
  }, [you]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Peer Benchmarking"
        subtitle="Opt-in anonymized benchmarking across institutions: compare posture, find common gaps, and prioritize next actions."
        right={pill("Opt-in anonymized", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 12 }}>
            <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
            <span style={{ fontWeight: 900 }}>Show opted-in peers only</span>
          </label>

          <select value={group} onChange={(e) => setGroup(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All peer groups</option>
            <option value="R1 Universities">R1 Universities</option>
            <option value="Regional Universities">Regional Universities</option>
            <option value="K-12 Districts">K-12 Districts</option>
            <option value="Municipal/County">Municipal/County</option>
            <option value="Public Safety">Public Safety</option>
          </select>

          <select value={metric} onChange={(e) => setMetric(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="Modernization Score">Modernization Score</option>
            <option value="Zero Trust Score">Zero Trust Score</option>
            <option value="Telemetry Readiness">Telemetry Readiness</option>
            <option value="Drift Rate">Drift Rate (lower is better)</option>
            <option value="Identity Posture">Identity Posture</option>
            <option value="Supply Chain Coverage">Supply Chain Coverage</option>
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search peers / region…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 280 }}
          />

          <button
            onClick={() => alert("Demo: export benchmarking summary PDF (coming next).")}
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Export Summary (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ color: "#6b7280", fontWeight: 900, fontSize: 12 }}>Your {metric}</div>
            <div style={{ marginTop: 6, fontSize: 26, fontWeight: 900 }}>{lowerIsBetter ? `${yourMetricVal}` : `${yourMetricVal}`}</div>
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>Compared across {rows.length} peers</div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ color: "#6b7280", fontWeight: 900, fontSize: 12 }}>Percentile (Demo)</div>
            <div style={{ marginTop: 6, fontSize: 26, fontWeight: 900 }}>{yourPct}%</div>
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>
              {lowerIsBetter ? "Higher is better (lower drift)" : "Higher is better"}
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ color: "#6b7280", fontWeight: 900, fontSize: 12 }}>Common Gap Pattern</div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>Telemetry + Identity</div>
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>Top cross-institution gaps (demo narrative)</div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ color: "#6b7280", fontWeight: 900, fontSize: 12 }}>Suggested Next Actions</div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>Adopt Baselines</div>
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>Apply IaC + policy bundles for Tier-1</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12, marginTop: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, overflowX: "auto" }}>
            <div style={{ fontWeight: 900 }}>Peer Table</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Institution</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Group</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Region</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Size</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>{metric}</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const v = getMetric(r, metric);
                  const showAsScore = metric !== "Drift Rate";
                  const active = r.id === "p_you";
                  return (
                    <tr key={r.id} style={{ background: active ? "#111827" : "transparent", color: active ? "white" : "#111827" }}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{r.institution}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{r.group}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{r.region}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{r.size}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        {showAsScore ? scorePill(v) : pill(`${v} (lower better)`, active ? "white" : "#111827", active ? "rgba(255,255,255,0.12)" : "#f9fafb")}
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        <button
                          onClick={() => alert(`Demo: open peer profile and compare deltas for ${r.institution}.`)}
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
                          Compare
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Demo value: shows broad, scalable field impact—your platform creates comparable posture signals across institutions.
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            <div style={{ fontWeight: 900 }}>Gap Insights (Your Lowest Areas)</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {gapInsights.map((g) => (
                <div key={g.key} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontWeight: 900 }}>{g.key}</div>
                    <div style={{ marginLeft: "auto" }}>{g.lowerIsBetter ? pill("Lower is worse here", "#b45309", "#fff7ed") : pill("Score gap", "#dc2626", "#fef2f2")}</div>
                  </div>
                  <div style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>
                    Suggested intervention: adopt a baseline bundle + policy gates + evidence pack automation (demo).
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => alert("Demo: create roadmap item for this gap.")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Create Roadmap Item (Demo)
                    </button>
                    <button
                      onClick={() => alert("Demo: open recommended template for this gap.")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      View Templates (Demo)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
              <div style={{ fontWeight: 900 }}>Privacy Controls (Demo)</div>
              <div style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>
                Opt-in + anonymization + minimum cohort size + aggregated metrics only.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
