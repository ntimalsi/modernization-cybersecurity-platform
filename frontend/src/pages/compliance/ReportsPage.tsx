import * as React from "react";

type ReportType = "Executive Summary" | "Modernization Brief" | "Cybersecurity Posture" | "Compliance Snapshot" | "Audit Package";

type Report = {
  id: string;
  type: ReportType;
  title: string;
  audience: "Board/CIO" | "CISO/SOC" | "Infra Team" | "Auditors";
  period: string;
  highlights: string[];
  risks: string[];
  topActions: string[];
  status: "Draft" | "Ready";
  updatedAt: string;
};

function Card({ title, subtitle, right, children }: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
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

const seedReports: Report[] = [
  {
    id: "r1",
    type: "Executive Summary",
    title: "Executive Brief — Unified Modernization + Cybersecurity",
    audience: "Board/CIO",
    period: "Q4 2025",
    highlights: ["Modernization score improved (demo)", "ZT readiness trending upward (demo)", "Top 3 risks quantified and prioritized"],
    risks: ["Tier-1 logging gaps", "Privileged MFA coverage incomplete", "Drift hotspots in network rule changes"],
    topActions: ["Approve 30/60/90 plan", "Adopt policy-as-code baseline for Tier-1", "Fund lifecycle upgrades for EOL assets"],
    status: "Ready",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: "r2",
    type: "Compliance Snapshot",
    title: "NIST 800-171 Mini-Profile Snapshot",
    audience: "Auditors",
    period: "Q4 2025",
    highlights: ["Mapped controls to platform evidence", "Evidence packs in review", "Enforcement roadmap defined"],
    risks: ["SBOM coverage missing for some legacy services", "Audit evidence gaps for SIEM ingest coverage"],
    topActions: ["Generate SBOM/provenance for in-scope apps", "Attach SIEM coverage report to pack", "Move key controls from Observe→Warn"],
    status: "Draft",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: "r3",
    type: "Cybersecurity Posture",
    title: "SOC Posture Report — Drift + Anomalies + Guardrails",
    audience: "CISO/SOC",
    period: "Last 30 days",
    highlights: ["Drift events reduced after baseline adoption (demo)", "Anomalies now include ‘why flagged’ explanation", "Policy engine blocked a high-risk deploy (demo)"],
    risks: ["Identity gap in public safety admin access", "Exposure risks for IoT segment"],
    topActions: ["Enable MFA enforcement for privileged roles", "Stage segmentation changes via digital twin", "Tighten CI/CD gates for Tier-1 repos"],
    status: "Ready",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  }
];

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <ul style={{ marginTop: 8, paddingLeft: 18 }}>
        {items.map((x, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReportsPage() {
  const [type, setType] = React.useState<"all" | ReportType>("all");
  const [aud, setAud] = React.useState<"all" | Report["audience"]>("all");
  const [selectedId, setSelectedId] = React.useState(seedReports[0]?.id ?? "");
  const [q, setQ] = React.useState("");

  const reports = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return seedReports
      .filter((r) => (type === "all" ? true : r.type === type))
      .filter((r) => (aud === "all" ? true : r.audience === aud))
      .filter((r) => {
        if (!query) return true;
        return r.title.toLowerCase().includes(query) || r.type.toLowerCase().includes(query) || r.period.toLowerCase().includes(query);
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [type, aud, q]);

  const selected = reports.find((r) => r.id === selectedId) ?? reports[0];

  React.useEffect(() => {
    if (reports.length && !reports.some((r) => r.id === selectedId)) setSelectedId(reports[0].id);
  }, [reports, selectedId]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Reports"
        subtitle="Executive-ready outputs (CIO/CISO/Board/Auditors) derived from scorecards, controls, and evidence packs."
        right={pill("Board-ready", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reports…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 420 }}
          />
          <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All types</option>
            <option value="Executive Summary">Executive Summary</option>
            <option value="Modernization Brief">Modernization Brief</option>
            <option value="Cybersecurity Posture">Cybersecurity Posture</option>
            <option value="Compliance Snapshot">Compliance Snapshot</option>
            <option value="Audit Package">Audit Package</option>
          </select>
          <select value={aud} onChange={(e) => setAud(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All audiences</option>
            <option value="Board/CIO">Board/CIO</option>
            <option value="CISO/SOC">CISO/SOC</option>
            <option value="Infra Team">Infra Team</option>
            <option value="Auditors">Auditors</option>
          </select>

          <button
            onClick={() => alert("Demo: generate a new report from templates (coming next).")}
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
          >
            New Report (Demo)
          </button>
          <button
            onClick={() => alert("Demo: export PDF (coming next).")}
            style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Export PDF (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 12, marginTop: 12 }}>
          {/* list */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Report Library</div>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {reports.map((r) => {
                const active = r.id === selectedId;
                const s = r.status === "Ready" ? { fg: "#16a34a", bg: "#f0fdf4" } : { fg: "#6b7280", bg: "#f9fafb" };
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    style={{
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 12,
                      background: active ? "#111827" : "white",
                      color: active ? "white" : "#111827"
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ fontWeight: 900 }}>{r.title}</div>
                      <div style={{ marginLeft: "auto" }}>{pill(r.status, active ? "white" : s.fg, active ? "rgba(255,255,255,0.12)" : s.bg)}</div>
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Type: {r.type} • Audience: {r.audience} • Period: {r.period}
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Updated: {new Date(r.updatedAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* detail */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            {!selected ? (
              <div style={{ color: "#6b7280" }}>Select a report.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{selected.title}</div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {pill(selected.type, "#111827", "white")}
                    {pill(selected.audience, "#2563eb", "#eff6ff")}
                    {pill(selected.period, "#6b7280", "#f9fafb")}
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                  <Section title="Highlights" items={selected.highlights} />
                  <Section title="Risks" items={selected.risks} />
                  <Section title="Top Actions (Next 30 Days)" items={selected.topActions} />
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => alert("Demo: link actions to Roadmap items + owners (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Convert to Roadmap Items (Demo)
                  </button>
                  <button
                    onClick={() => alert("Demo: attach Evidence Pack references (coming next).")}
                    style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                  >
                    Attach Evidence Links (Demo)
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
