import * as React from "react";

type Scenario = {
  id: string;
  name: string;
  description: string;
};

type ChangeType = "Segmentation" | "RBAC Tightening" | "OS Upgrade" | "Logging Enforcement" | "CI/CD Guardrails";

type Impact = {
  category: "Modernization" | "Cybersecurity" | "Operations" | "Compliance";
  level: "High" | "Medium" | "Low";
  detail: string;
};

type SimulationResult = {
  postureDelta: { modernization: number; cybersecurity: number; overall: number };
  breakageRisk: { level: "High" | "Medium" | "Low"; reasons: string[] };
  impactedServices: Array<{ name: string; blastRadius: "High" | "Medium" | "Low"; note: string }>;
  recommendedMitigations: string[];
  policyConflicts: string[];
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

function pill(text: string, fg: string, bg: string) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color: fg, background: bg }}>
      {text}
    </span>
  );
}

function levelColor(level: "High" | "Medium" | "Low") {
  if (level === "High") return { fg: "#dc2626", bg: "#fef2f2" };
  if (level === "Medium") return { fg: "#b45309", bg: "#fff7ed" };
  return { fg: "#6b7280", bg: "#f9fafb" };
}

const scenarios: Scenario[] = [
  { id: "s1", name: "Public Safety / E911", description: "High-criticality services with strict uptime and access requirements." },
  { id: "s2", name: "University Core IT", description: "Identity + networking + core apps, typical higher-ed enterprise profile." },
  { id: "s3", name: "K-12 District (Small)", description: "Lean staff; high need for templates, automation, and evidence packaging." }
];

function simulate(change: ChangeType, intensity: number, freezeWindow: boolean, scenarioId: string): SimulationResult {
  // Deterministic “demo” logic (so results feel consistent)
  const baseMod = scenarioId === "s1" ? 48 : scenarioId === "s2" ? 56 : 44;
  const baseSec = scenarioId === "s1" ? 52 : scenarioId === "s2" ? 58 : 50;

  const factor = intensity / 100;

  let modDelta = 0;
  let secDelta = 0;
  let breakRisk: "High" | "Medium" | "Low" = "Low";
  const breakReasons: string[] = [];
  const impactedServices: SimulationResult["impactedServices"] = [];
  const mitigations: string[] = [];
  const policyConflicts: string[] = [];

  if (change === "Segmentation") {
    secDelta += Math.round(12 * factor);
    modDelta += Math.round(6 * factor);
    breakRisk = factor > 0.7 ? "Medium" : "Low";
    breakReasons.push("Potential service-to-service communication changes");
    impactedServices.push(
      { name: "E911 Location Service", blastRadius: factor > 0.6 ? "High" : "Medium", note: "Requires explicit allow-lists for dependencies." },
      { name: "Facilities IoT Segment", blastRadius: "Medium", note: "Reduce lateral movement by enforcing zone boundaries." }
    );
    mitigations.push("Run discovery of flows before enforcement", "Apply changes in stages (monitor → enforce)", "Add emergency bypass procedure for public safety");
    policyConflicts.push("NetworkPolicy baseline missing for some namespaces (K8s)", "Tagging standard not fully adopted for segmentation tiers");
  }

  if (change === "RBAC Tightening") {
    secDelta += Math.round(14 * factor);
    modDelta += Math.round(4 * factor);
    breakRisk = factor > 0.55 ? "Medium" : "Low";
    breakReasons.push("Privilege changes may block automation accounts / service identities");
    impactedServices.push(
      { name: "Student Records DB", blastRadius: "Medium", note: "Admin paths may need break-glass accounts." },
      { name: "Research Kubernetes Cluster", blastRadius: factor > 0.7 ? "High" : "Medium", note: "ServiceAccounts and CI pipelines may lose permissions." }
    );
    mitigations.push("Inventory privileged roles and service accounts", "Implement break-glass with MFA + approvals", "Pilot on one unit before broad rollout");
    policyConflicts.push("Least-privilege policy requires explicit role definitions", "Some workloads rely on cluster-admin (needs refactor)");
  }

  if (change === "OS Upgrade") {
    modDelta += Math.round(16 * factor);
    secDelta += Math.round(7 * factor);
    breakRisk = factor > 0.5 ? "High" : "Medium";
    breakReasons.push("Application compatibility and driver/firmware dependencies");
    impactedServices.push(
      { name: "Legacy ERP integration", blastRadius: "High", note: "Pinned runtime dependencies; requires compatibility test." },
      { name: "Student Records DB", blastRadius: "High", note: "Maintenance window required; validate backups and rollback plan." }
    );
    mitigations.push("Create upgrade waves by dependency graph", "Perform canary upgrade + rollback rehearsal", "Validate backups and DR before change");
    policyConflicts.push("Maintenance window policy required for tier-1 assets", "Evidence pack needs upgrade approvals documented");
  }

  if (change === "Logging Enforcement") {
    secDelta += Math.round(10 * factor);
    modDelta += Math.round(10 * factor);
    breakRisk = factor > 0.8 ? "Medium" : "Low";
    breakReasons.push("Possible performance/storage impact if mis-sized");
    impactedServices.push(
      { name: "SIEM pipeline", blastRadius: "Medium", note: "May require scaling and retention tuning." },
      { name: "High-volume firewall logs", blastRadius: factor > 0.6 ? "High" : "Medium", note: "Need filtering and routing to control cost." }
    );
    mitigations.push("Tune log sampling/filters", "Set retention tiers by asset criticality", "Monitor ingest rate + budget impact");
    policyConflicts.push("Required logging policy conflicts with some legacy systems lacking agents", "Tagging required for routing not fully implemented");
  }

  if (change === "CI/CD Guardrails") {
    secDelta += Math.round(15 * factor);
    modDelta += Math.round(5 * factor);
    breakRisk = factor > 0.7 ? "Medium" : "Low";
    breakReasons.push("Pipeline failures until teams update build standards");
    impactedServices.push(
      { name: "App release cadence", blastRadius: "Medium", note: "Initial friction; long-term stability improves." },
      { name: "Infrastructure provisioning", blastRadius: "Low", note: "More consistent outcomes; fewer emergency changes." }
    );
    mitigations.push("Introduce guardrails in warn-only mode first", "Provide templates and auto-fix guidance", "Add exception workflow with approvals");
    policyConflicts.push("SBOM/provenance enforcement requires signing keys", "Some repos lack baseline scanning configuration");
  }

  if (freezeWindow) {
    // Freeze window reduces breakage risk but slows outcomes slightly
    breakRisk = breakRisk === "High" ? "Medium" : breakRisk === "Medium" ? "Low" : "Low";
    modDelta = Math.max(0, modDelta - 2);
    secDelta = Math.max(0, secDelta - 2);
    mitigations.unshift("Change freeze window enabled: safer rollout cadence");
  }

  const modernization = Math.min(100, baseMod + modDelta);
  const cybersecurity = Math.min(100, baseSec + secDelta);
  const overall = Math.round((modernization + cybersecurity) / 2);

  return {
    postureDelta: { modernization, cybersecurity, overall },
    breakageRisk: { level: breakRisk, reasons: breakReasons },
    impactedServices,
    recommendedMitigations: mitigations,
    policyConflicts
  };
}

export default function DigitalTwinPage() {
  const [scenarioId, setScenarioId] = React.useState<string>("s2");
  const [change, setChange] = React.useState<ChangeType>("Segmentation");
  const [intensity, setIntensity] = React.useState<number>(60);
  const [freezeWindow, setFreezeWindow] = React.useState<boolean>(true);

  const scenario = scenarios.find((s) => s.id === scenarioId)!;
  const result = React.useMemo(() => simulate(change, intensity, freezeWindow, scenarioId), [change, intensity, freezeWindow, scenarioId]);

  const br = levelColor(result.breakageRisk.level);

  const impacts: Impact[] = [
    { category: "Modernization", level: result.postureDelta.modernization >= 70 ? "Low" : result.postureDelta.modernization >= 55 ? "Medium" : "High", detail: "Improves readiness and reduces upgrade friction over time." },
    { category: "Cybersecurity", level: result.postureDelta.cybersecurity >= 70 ? "Low" : result.postureDelta.cybersecurity >= 55 ? "Medium" : "High", detail: "Reduces exploit paths by enforcing repeatable controls." },
    { category: "Operations", level: result.breakageRisk.level, detail: "Change risk depends on dependency awareness, rollout pacing, and guardrails." },
    { category: "Compliance", level: "Medium", detail: "Improves audit readiness when evidence + approvals are captured as artifacts." }
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Digital Twin"
        subtitle="Change simulation mode: ‘If we segment’, ‘if we tighten RBAC’, ‘if we upgrade OS’ — see posture impact + breakage risk."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            <div style={{ fontWeight: 900 }}>Scenario Builder</div>
            <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>
              Demo: select an environment profile and simulate a change before deploying.
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Environment</div>
                <select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>{scenario.description}</div>
              </div>

              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Change type</div>
                <select value={change} onChange={(e) => setChange(e.target.value as ChangeType)} style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
                  <option value="Segmentation">Segmentation</option>
                  <option value="RBAC Tightening">RBAC Tightening</option>
                  <option value="OS Upgrade">OS Upgrade</option>
                  <option value="Logging Enforcement">Logging Enforcement</option>
                  <option value="CI/CD Guardrails">CI/CD Guardrails</option>
                </select>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>Change intensity</div>
                  <div style={{ fontWeight: 900 }}>{intensity}%</div>
                </div>
                <input type="range" min={0} max={100} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} style={{ width: "100%" }} />
                <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>Higher intensity increases posture gains but can raise breakage risk.</div>
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={freezeWindow} onChange={(e) => setFreezeWindow(e.target.checked)} />
                <div>
                  <div style={{ fontWeight: 900 }}>Enable change freeze window</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>Safer rollout cadence (reduces risk slightly, slows gains slightly).</div>
                </div>
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => alert("Demo: generate a staged rollout plan + approvals + evidence checklist (coming next).")}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  Generate Rollout Plan (Demo)
                </button>
                <button
                  onClick={() => alert("Demo: open Dependency Map for this scenario (coming next).")}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  View Dependency Map (Demo)
                </button>
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Simulation Output</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
                <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 900 }}>Modernization</div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{result.postureDelta.modernization}%</div>
              </div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
                <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 900 }}>Cybersecurity</div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{result.postureDelta.cybersecurity}%</div>
              </div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
                <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 900 }}>Overall</div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{result.postureDelta.overall}%</div>
              </div>
            </div>

            <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 900 }}>Breakage Risk</div>
                <div style={{ marginLeft: "auto" }}>{pill(result.breakageRisk.level.toUpperCase(), br.fg, br.bg)}</div>
              </div>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {result.breakageRisk.reasons.length ? result.breakageRisk.reasons.map((r, i) => <li key={i}>{r}</li>) : <li>No major risks detected in this scenario.</li>}
              </ul>
            </div>

            <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
              <div style={{ fontWeight: 900 }}>Impact Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 10 }}>
                {impacts.map((i) => {
                  const c = levelColor(i.level);
                  return (
                    <div key={i.category} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 10, background: "#fafafa" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontWeight: 900 }}>{i.category}</div>
                        <div style={{ marginLeft: "auto" }}>{pill(i.level.toUpperCase(), c.fg, c.bg)}</div>
                      </div>
                      <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>{i.detail}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card
          title="Impacted Services (Blast Radius)"
          subtitle="Demo: derived from dependency relationships (app→server→network→identity→logging)."
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Service</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Blast radius</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {result.impactedServices.map((s) => {
                  const c = levelColor(s.blastRadius);
                  return (
                    <tr key={s.name}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{s.name}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{pill(s.blastRadius.toUpperCase(), c.fg, c.bg)}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{s.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
            Later: this list can link into “Dependency Map” nodes and show policy conflicts per edge.
          </div>
        </Card>

        <Card
          title="Mitigations & Policy Conflicts"
          subtitle="Demo: guardrails + evidence artifacts reduce risk while accelerating modernization."
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ fontWeight: 900 }}>Recommended mitigations</div>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {result.recommendedMitigations.map((m, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
              <div style={{ fontWeight: 900 }}>Policy conflicts (guardrails)</div>
              {result.policyConflicts.length === 0 ? (
                <div style={{ marginTop: 8, color: "#6b7280" }}>No conflicts detected.</div>
              ) : (
                <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                  {result.policyConflicts.map((p, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      {p}
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => alert("Demo: open Policy-as-Code page filtered to these conflicts (coming next).")}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  View Policies (Demo)
                </button>
                <button
                  onClick={() => alert("Demo: open Evidence Pack Builder with this plan (coming next).")}
                  style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  Create Evidence Checklist (Demo)
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
