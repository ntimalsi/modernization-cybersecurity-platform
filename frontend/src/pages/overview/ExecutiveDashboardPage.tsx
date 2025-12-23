import * as React from "react";

/**
 * Frontend-only mock data to demonstrate “unified” KPI view.
 * Later you can replace this with API calls and keep the same UI.
 */

type Kpi = {
  label: string;
  value: string;
  hint?: string;
};

type ActionItem = {
  id: string;
  title: string;
  category: "Modernization" | "Cybersecurity" | "Automation & IaC" | "Compliance";
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  rationale: string;
  recommendedOwner: string;
  due: string; // demo
  status: "Open" | "In Progress" | "Done";
};

type RiskSignal = {
  name: string;
  severity: "High" | "Medium" | "Low";
  signal: string;
  whyItMatters: string;
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

function KPI({ label, value, hint }: Kpi) {
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

function sevColor(sev: "High" | "Medium" | "Low") {
  if (sev === "High") return { fg: "#dc2626", bg: "#fef2f2" };
  if (sev === "Medium") return { fg: "#d97706", bg: "#fff7ed" };
  return { fg: "#6b7280", bg: "#f9fafb" };
}

function impactColor(impact: "High" | "Medium" | "Low") {
  if (impact === "High") return { fg: "#dc2626", bg: "#fef2f2" };
  if (impact === "Medium") return { fg: "#2563eb", bg: "#eff6ff" };
  return { fg: "#6b7280", bg: "#f9fafb" };
}

function scoreToStatus(score: number) {
  if (score >= 80) return { label: "Strong", ...sevColor("Low") };
  if (score >= 60) return { label: "Fair", ...sevColor("Medium") };
  return { label: "Needs Attention", ...sevColor("High") };
}

export default function ExecutiveDashboardPage() {
  // --- mock “unified posture” values (swap with API later) ---
  const modernization = {
    visibility: 68,
    lifecycle: 54,
    standardization: 61,
    telemetry: 52
  };

  const cybersecurity = {
    zeroTrust: 57,
    driftEvents7d: 14,
    criticalExposure: 6,
    identityRisk: 62, // higher = worse (demo)
    resilience: 58,
    compliance: 60
  };

  // Derived
  const modernizationAvg = Math.round(
    (modernization.visibility + modernization.lifecycle + modernization.standardization + modernization.telemetry) / 4
  );

  const securityHealth = Math.round(
    (cybersecurity.zeroTrust + cybersecurity.resilience + cybersecurity.compliance + (100 - cybersecurity.identityRisk)) / 4
  );

  const overallPosture = Math.round((modernizationAvg + securityHealth) / 2);

  const postureTag = scoreToStatus(overallPosture);
  const modernTag = scoreToStatus(modernizationAvg);
  const secTag = scoreToStatus(securityHealth);

  const kpis: Kpi[] = [
    { label: "Overall Posture", value: `${overallPosture}%`, hint: "Combined modernization + security health" },
    { label: "Modernization Health", value: `${modernizationAvg}%`, hint: "Visibility + lifecycle + standards + telemetry" },
    { label: "Security Health", value: `${securityHealth}%`, hint: "Zero Trust + resilience + compliance + identity" },
    { label: "Drift Events (7d)", value: String(cybersecurity.driftEvents7d), hint: "Config drift + policy violations" }
  ];

  const riskSignals: RiskSignal[] = [
    {
      name: "Lifecycle Debt",
      severity: "High",
      signal: "Outdated OS/FW candidates concentrated in critical segments",
      whyItMatters: "Higher exploitability + increased outage risk during change windows."
    },
    {
      name: "Identity Risk",
      severity: "Medium",
      signal: "Privileged access not fully MFA-covered / stale admin accounts",
      whyItMatters: "Identity is the primary control plane for Zero Trust."
    },
    {
      name: "Telemetry Gaps",
      severity: "Medium",
      signal: "Logging/SIEM forwarding not consistent across assets",
      whyItMatters: "Limits detection/response; increases audit effort."
    },
    {
      name: "Exposure Hotspots",
      severity: "High",
      signal: "Critical exposure findings include open admin ports / weak segmentation",
      whyItMatters: "Directly increases likelihood and impact of ransomware incidents."
    }
  ];

  const actions: ActionItem[] = [
    {
      id: "a1",
      title: "Enforce MFA for privileged roles + remove stale admin accounts",
      category: "Cybersecurity",
      impact: "High",
      effort: "Low",
      rationale: "Fastest reduction in account takeover risk; aligns with Zero Trust core controls.",
      recommendedOwner: "IAM / Security Team",
      due: "30 days",
      status: "Open"
    },
    {
      id: "a2",
      title: "Deploy policy-as-code: block public admin ports + require segmentation tags",
      category: "Automation & IaC",
      impact: "High",
      effort: "Medium",
      rationale: "Prevents risky changes before deployment; makes compliance preventive.",
      recommendedOwner: "Platform Engineering",
      due: "60 days",
      status: "Open"
    },
    {
      id: "a3",
      title: "Standardize SIEM forwarding for high-value asset groups",
      category: "Cybersecurity",
      impact: "Medium",
      effort: "Medium",
      rationale: "Improves detection and reduces audit overhead; supports incident response.",
      recommendedOwner: "SecOps / Networking",
      due: "90 days",
      status: "In Progress"
    },
    {
      id: "a4",
      title: "Create modernization roadmap for EOL systems (top 10 critical services)",
      category: "Modernization",
      impact: "High",
      effort: "High",
      rationale: "Reduces outage likelihood and exposure from legacy systems.",
      recommendedOwner: "Infrastructure Leads",
      due: "6–12 months",
      status: "Open"
    },
    {
      id: "a5",
      title: "Baseline and GitOps-manage configs for tier-1 systems to reduce drift",
      category: "Automation & IaC",
      impact: "Medium",
      effort: "Medium",
      rationale: "Turn drift into controlled PR-based change; reduce recurring incidents.",
      recommendedOwner: "Platform Engineering",
      due: "90 days",
      status: "Open"
    }
  ];

  const topActions = actions
    .slice()
    .sort((a, b) => {
      const score = (x: ActionItem) =>
        (x.impact === "High" ? 3 : x.impact === "Medium" ? 2 : 1) +
        (x.effort === "Low" ? 2 : x.effort === "Medium" ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, 5);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Executive Dashboard"
        subtitle="Unified KPI view for CIO/CISO: modernization + cybersecurity + top actions."
        right={pill(postureTag.label, postureTag.fg, postureTag.bg)}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {kpis.map((k) => (
            <KPI key={k.label} {...k} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12, marginTop: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 900 }}>Modernization vs Cybersecurity</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                {pill(`Modernization ${modernizationAvg}%`, modernTag.fg, modernTag.bg)}
                {pill(`Security ${securityHealth}%`, secTag.fg, secTag.bg)}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 12 }}>
              {/* Modernization */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
                <div style={{ fontWeight: 900 }}>Modernization Signals</div>
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Visibility</span>
                    <strong>{modernization.visibility}%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Lifecycle / Legacy</span>
                    <strong>{modernization.lifecycle}%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Standardization</span>
                    <strong>{modernization.standardization}%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Telemetry readiness</span>
                    <strong>{modernization.telemetry}%</strong>
                  </div>
                </div>
                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                  Demo: improvements here reduce outages, speed upgrades, and lower incident likelihood.
                </div>
              </div>

              {/* Cybersecurity */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
                <div style={{ fontWeight: 900 }}>Cybersecurity Signals</div>
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Zero Trust readiness</span>
                    <strong>{cybersecurity.zeroTrust}%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Identity risk</span>
                    <strong>{cybersecurity.identityRisk}%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Critical exposure</span>
                    <strong>{cybersecurity.criticalExposure}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280" }}>Resilience</span>
                    <strong>{cybersecurity.resilience}%</strong>
                  </div>
                </div>
                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
                  Demo: security health improves via guardrails, drift reduction, identity hardening.
                </div>
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Top Risk Signals</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>
              Executive-friendly “why it matters” view.
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {riskSignals.map((r) => {
                const c = sevColor(r.severity);
                return (
                  <div key={r.name} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ fontWeight: 900 }}>{r.name}</div>
                      <div style={{ marginLeft: "auto" }}>{pill(r.severity.toUpperCase(), c.fg, c.bg)}</div>
                    </div>
                    <div style={{ marginTop: 6, color: "#111827" }}>{r.signal}</div>
                    <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>{r.whyItMatters}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>Top Actions (next 30–90 days)</div>
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
              onClick={() => alert("Demo: export executive action plan (PDF/report) - coming next.")}
            >
              Export Action Plan (Demo)
            </button>
          </div>

          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Category</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Impact</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Effort</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Target</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {topActions.map((a) => {
                  const ic = impactColor(a.impact);
                  return (
                    <tr key={a.id}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        <div style={{ fontWeight: 900 }}>{a.title}</div>
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{a.rationale}</div>
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.category}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{pill(a.impact.toUpperCase(), ic.fg, ic.bg)}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.effort}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.recommendedOwner}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.due}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
            Demo note: these actions should link to the detailed module pages (Identity, Policy-as-Code, Telemetry, Lifecycle).
          </div>
        </div>
      </Card>
    </div>
  );
}
