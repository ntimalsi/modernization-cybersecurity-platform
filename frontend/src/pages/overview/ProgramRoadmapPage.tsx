import * as React from "react";

type RoadmapItem = {
  id: string;
  phase: "0–30 days" | "31–60 days" | "61–90 days" | "6–12 months";
  workstream: "Modernization" | "Cybersecurity" | "Automation & IaC" | "Compliance" | "Workforce";
  title: string;
  outcomes: string[];
  dependencies: string[];
  effort: "Low" | "Medium" | "High";
  riskReduction: "High" | "Medium" | "Low";
  owner: string;
  status: "Planned" | "In Progress" | "Done";
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

function KPI({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 800 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{value}</div>
      {hint && <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>{hint}</div>}
    </div>
  );
}

function pill(text: string, color: string, bg?: string) {
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
        color,
        background: bg ?? "white"
      }}
    >
      {text}
    </span>
  );
}

function rrColor(rr: "High" | "Medium" | "Low") {
  if (rr === "High") return { fg: "#16a34a", bg: "#f0fdf4" };
  if (rr === "Medium") return { fg: "#2563eb", bg: "#eff6ff" };
  return { fg: "#6b7280", bg: "#f9fafb" };
}

const mockRoadmap: RoadmapItem[] = [
  // 0–30
  {
    id: "r1",
    phase: "0–30 days",
    workstream: "Cybersecurity",
    title: "Privileged access hardening (MFA + stale admin cleanup)",
    outcomes: ["MFA coverage baseline", "Remove/disable stale privileged accounts", "Exception process defined"],
    dependencies: ["Identity inventory", "Executive sponsorship"],
    effort: "Low",
    riskReduction: "High",
    owner: "IAM / Security"
  ,
    status: "Planned"
  },
  {
    id: "r2",
    phase: "0–30 days",
    workstream: "Modernization",
    title: "Asset inventory bootstrap (CSV import + ownership + tagging standard)",
    outcomes: ["Visibility score improves", "Ownership accountability model", "Tag schema adopted"],
    dependencies: ["Asset data sources", "Org unit owners identified"],
    effort: "Medium",
    riskReduction: "Medium",
    owner: "Infrastructure Leads",
    status: "Planned"
  },
  {
    id: "r3",
    phase: "0–30 days",
    workstream: "Automation & IaC",
    title: "CI/CD blueprint MVP (scan + policy gate + signed artifacts)",
    outcomes: ["Standard pipeline template", "Basic SAST/dependency scans", "Policy gate introduced"],
    dependencies: ["Select CI target(s)", "Define baseline guardrails"],
    effort: "Medium",
    riskReduction: "High",
    owner: "Platform Engineering",
    status: "Planned"
  },

  // 31–60
  {
    id: "r4",
    phase: "31–60 days",
    workstream: "Cybersecurity",
    title: "Policy-as-code baseline (block public admin ports, require logging tags)",
    outcomes: ["Reduced exposure findings", "Enforcement/monitor modes defined", "Violation tracking"],
    dependencies: ["Policy engine selection", "Tagging standard (from 0–30)"],
    effort: "Medium",
    riskReduction: "High",
    owner: "Platform Engineering",
    status: "Planned"
  },
  {
    id: "r5",
    phase: "31–60 days",
    workstream: "Modernization",
    title: "Telemetry readiness plan (SIEM forwarding coverage for tier-1 services)",
    outcomes: ["Logging coverage baseline", "Top gaps prioritized", "Rollout wave plan"],
    dependencies: ["SIEM/log pipeline readiness", "Owner buy-in"],
    effort: "Medium",
    riskReduction: "Medium",
    owner: "SecOps + Networking",
    status: "Planned"
  },

  // 61–90
  {
    id: "r6",
    phase: "61–90 days",
    workstream: "Automation & IaC",
    title: "GitOps drift & remediation (PR-based change for tier-1 configs)",
    outcomes: ["Baseline definitions", "Drift detection signals", "Auto-fix eligible PR workflow"],
    dependencies: ["GitOps repo", "Golden baseline templates"],
    effort: "Medium",
    riskReduction: "High",
    owner: "Platform Engineering",
    status: "Planned"
  },
  {
    id: "r7",
    phase: "61–90 days",
    workstream: "Compliance",
    title: "Evidence pack builder (audit artifacts from pipelines + policies)",
    outcomes: ["Evidence checklist", "Artifact retention model", "Compliance snapshot ties to signals"],
    dependencies: ["CI/CD blueprint MVP", "Policy-as-code baseline"],
    effort: "Medium",
    riskReduction: "Medium",
    owner: "GRC / Security",
    status: "Planned"
  },
  {
    id: "r8",
    phase: "61–90 days",
    workstream: "Workforce",
    title: "Guided remediation labs (MFA, logging, GitOps basics)",
    outcomes: ["Training modules aligned to gaps", "Hands-on tasks + checklists", "Talent upskilling"],
    dependencies: ["Top actions agreed", "Internal trainers/SMEs"],
    effort: "Low",
    riskReduction: "Medium",
    owner: "Security + IT Training",
    status: "Planned"
  },

  // 6–12 months
  {
    id: "r9",
    phase: "6–12 months",
    workstream: "Modernization",
    title: "Lifecycle & technical debt program (EOL upgrades for top critical services)",
    outcomes: ["Reduced legacy footprint", "Planned upgrade waves", "Measured outage reduction"],
    dependencies: ["Budget planning", "Vendor/upgrade windows"],
    effort: "High",
    riskReduction: "High",
    owner: "CIO / Infra Leads",
    status: "Planned"
  },
  {
    id: "r10",
    phase: "6–12 months",
    workstream: "Cybersecurity",
    title: "Supply chain security standardization (SBOM + provenance + signing)",
    outcomes: ["SBOM coverage across releases", "Provenance retained", "EO 14028 alignment strengthened"],
    dependencies: ["CI/CD maturity", "Artifact registry + signing keys"],
    effort: "High",
    riskReduction: "High",
    owner: "Platform + Security",
    status: "Planned"
  }
];

function groupByPhase(items: RoadmapItem[]) {
  const phases: RoadmapItem["phase"][] = ["0–30 days", "31–60 days", "61–90 days", "6–12 months"];
  return phases.map((p) => ({
    phase: p,
    items: items.filter((i) => i.phase === p)
  }));
}

export default function ProgramRoadmapPage() {
  const [phase, setPhase] = React.useState<RoadmapItem["phase"] | "all">("all");
  const [workstream, setWorkstream] = React.useState<RoadmapItem["workstream"] | "all">("all");

  const workstreams = React.useMemo(() => Array.from(new Set(mockRoadmap.map((r) => r.workstream))), []);

  const filtered = mockRoadmap
    .filter((r) => (phase === "all" ? true : r.phase === phase))
    .filter((r) => (workstream === "all" ? true : r.workstream === workstream));

  const highRR = filtered.filter((r) => r.riskReduction === "High").length;
  const mediumRR = filtered.filter((r) => r.riskReduction === "Medium").length;

  const grouped = groupByPhase(filtered);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Program Roadmap"
        subtitle="30/60/90-day roadmap + 6–12 month milestones derived from scorecards and gaps."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Initiatives" value={String(filtered.length)} />
          <KPI label="High risk reduction" value={String(highRR)} />
          <KPI label="Medium risk reduction" value={String(mediumRR)} />
          <KPI label="Workstreams" value={String(workstreams.length)} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
          <select value={phase} onChange={(e) => setPhase(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All phases</option>
            <option value="0–30 days">0–30 days</option>
            <option value="31–60 days">31–60 days</option>
            <option value="61–90 days">61–90 days</option>
            <option value="6–12 months">6–12 months</option>
          </select>

          <select value={workstream} onChange={(e) => setWorkstream(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="all">All workstreams</option>
            {workstreams.map((w) => (
              <option key={w} value={w}>
                {w}
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
            onClick={() => alert("Demo: export roadmap as board-ready report (coming next).")}
          >
            Export Roadmap (Demo)
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {grouped.map((g) => (
            <div key={g.phase} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 900 }}>{g.phase}</div>
                <div style={{ marginLeft: "auto", color: "#6b7280", fontWeight: 800 }}>{g.items.length} items</div>
              </div>

              {g.items.length === 0 ? (
                <div style={{ marginTop: 10, color: "#6b7280" }}>No items for this filter.</div>
              ) : (
                <div style={{ marginTop: 10, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Initiative</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Workstream</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Risk reduction</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Effort</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Dependencies</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map((r) => {
                        const c = rrColor(r.riskReduction);
                        return (
                          <tr key={r.id}>
                            <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                              <div style={{ fontWeight: 900 }}>{r.title}</div>
                              <div style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
                                <strong>Outcomes:</strong> {r.outcomes.join(" • ")}
                              </div>
                            </td>
                            <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{r.workstream}</td>
                            <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{pill(r.riskReduction.toUpperCase(), c.fg, c.bg)}</td>
                            <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{r.effort}</td>
                            <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                              <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {r.dependencies.map((d) => (
                                  <li key={d}>{d}</li>
                                ))}
                              </ul>
                            </td>
                            <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{r.owner}</td>
                            <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{r.status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>How this ties to your platform</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Roadmap is derived from gaps across **identity, drift, telemetry, lifecycle, and guardrails**.</li>
            <li>Designed to be **repeatable** across institutions (adoptable modules + templates).</li>
            <li>Creates a clear bridge from dashboard → execution (key for public-sector modernization).</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
