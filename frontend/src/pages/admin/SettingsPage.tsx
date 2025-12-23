import * as React from "react";

type EnforcementMode = "Observe" | "Warn" | "Enforce";

type SettingsState = {
  scoring: {
    modernizationWeights: { visibility: number; lifecycle: number; standardization: number; telemetry: number };
    riskWeights: { exposure: number; drift: number; identity: number; lifecycle: number; supplyChain: number };
  };
  policy: {
    enforcementMode: EnforcementMode;
    requireSBOMForTier1: boolean;
    requireProvenanceForTier1: boolean;
    requireLoggingForTier1: boolean;
  };
  reporting: {
    executiveDigestFrequency: "Daily" | "Weekly" | "Monthly";
    includePeerBenchmarking: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    slackEnabled: boolean;
    severityThreshold: "Low" | "Medium" | "High" | "Critical";
  };
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
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color: fg, background: bg }}>
      {text}
    </span>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  hint
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ fontWeight: 900 }}>{label}</div>
        <div style={{ marginLeft: "auto", fontWeight: 900 }}>{value}</div>
      </div>
      {hint && <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>{hint}</div>}
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", marginTop: 10 }}
      />
    </div>
  );
}

const defaultSettings: SettingsState = {
  scoring: {
    modernizationWeights: { visibility: 25, lifecycle: 25, standardization: 25, telemetry: 25 },
    riskWeights: { exposure: 25, drift: 20, identity: 25, lifecycle: 15, supplyChain: 15 }
  },
  policy: {
    enforcementMode: "Observe",
    requireSBOMForTier1: true,
    requireProvenanceForTier1: false,
    requireLoggingForTier1: true
  },
  reporting: { executiveDigestFrequency: "Weekly", includePeerBenchmarking: true },
  notifications: { emailEnabled: true, slackEnabled: false, severityThreshold: "High" }
};

export default function SettingsPage() {
  const [s, setS] = React.useState<SettingsState>(defaultSettings);

  function save() {
    alert("Demo: settings saved (wire to backend later).");
  }

  function reset() {
    setS(defaultSettings);
    alert("Demo: reset to defaults.");
  }

  // Simple “weights sum” indicator (not enforcing in MVP)
  const modernizationSum =
    s.scoring.modernizationWeights.visibility +
    s.scoring.modernizationWeights.lifecycle +
    s.scoring.modernizationWeights.standardization +
    s.scoring.modernizationWeights.telemetry;

  const riskSum =
    s.scoring.riskWeights.exposure +
    s.scoring.riskWeights.drift +
    s.scoring.riskWeights.identity +
    s.scoring.riskWeights.lifecycle +
    s.scoring.riskWeights.supplyChain;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Settings"
        subtitle="Configure scoring weights, policy enforcement, reporting cadence, and alert routing. (Frontend-only MVP)"
        right={pill("Admin", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={save}
            style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Save (Demo)
          </button>
          <button
            onClick={reset}
            style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Reset Defaults
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {pill(`Modernization weights sum: ${modernizationSum}`, modernizationSum === 100 ? "#16a34a" : "#b45309", modernizationSum === 100 ? "#f0fdf4" : "#fff7ed")}
            {pill(`Risk weights sum: ${riskSum}`, riskSum === 100 ? "#16a34a" : "#b45309", riskSum === 100 ? "#f0fdf4" : "#fff7ed")}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          {/* Scoring */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            <div style={{ fontWeight: 900 }}>Scoring Weights</div>
            <div style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
              Demo: adjust weights to match institutional priorities (modernization and risk prioritization engine).
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Modernization Weights</div>
              <div style={{ display: "grid", gap: 10 }}>
                <SliderRow
                  label="Visibility"
                  value={s.scoring.modernizationWeights.visibility}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, modernizationWeights: { ...p.scoring.modernizationWeights, visibility: v } } }))}
                  hint="Asset coverage + inventory completeness"
                />
                <SliderRow
                  label="Lifecycle"
                  value={s.scoring.modernizationWeights.lifecycle}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, modernizationWeights: { ...p.scoring.modernizationWeights, lifecycle: v } } }))}
                  hint="EOL/EOS systems and technical debt impact"
                />
                <SliderRow
                  label="Standardization"
                  value={s.scoring.modernizationWeights.standardization}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, modernizationWeights: { ...p.scoring.modernizationWeights, standardization: v } } }))}
                  hint="Tagging, naming conventions, blueprint adoption"
                />
                <SliderRow
                  label="Telemetry"
                  value={s.scoring.modernizationWeights.telemetry}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, modernizationWeights: { ...p.scoring.modernizationWeights, telemetry: v } } }))}
                  hint="Logging/metrics/traces forwarding readiness"
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Risk Engine Weights</div>
              <div style={{ display: "grid", gap: 10 }}>
                <SliderRow
                  label="Exposure"
                  value={s.scoring.riskWeights.exposure}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, riskWeights: { ...p.scoring.riskWeights, exposure: v } } }))}
                  hint="Internet exposure, critical vulns, open services"
                />
                <SliderRow
                  label="Drift"
                  value={s.scoring.riskWeights.drift}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, riskWeights: { ...p.scoring.riskWeights, drift: v } } }))}
                  hint="Drift frequency and impact"
                />
                <SliderRow
                  label="Identity"
                  value={s.scoring.riskWeights.identity}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, riskWeights: { ...p.scoring.riskWeights, identity: v } } }))}
                  hint="MFA/SSO, privileged accounts, stale accounts"
                />
                <SliderRow
                  label="Lifecycle"
                  value={s.scoring.riskWeights.lifecycle}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, riskWeights: { ...p.scoring.riskWeights, lifecycle: v } } }))}
                  hint="EOL systems increase exploitability"
                />
                <SliderRow
                  label="Supply Chain"
                  value={s.scoring.riskWeights.supplyChain}
                  onChange={(v) => setS((p) => ({ ...p, scoring: { ...p.scoring, riskWeights: { ...p.scoring.riskWeights, supplyChain: v } } }))}
                  hint="SBOM/provenance/pipeline integrity coverage"
                />
              </div>
            </div>
          </div>

          {/* Policy + Reporting + Alerts */}
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ fontWeight: 900 }}>Policy Enforcement</div>
              <div style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
                Observe → Warn → Enforce: proves “controls baked into pipelines” (unique methodology).
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Enforcement Mode</span>
                  <select
                    value={s.policy.enforcementMode}
                    onChange={(e) => setS((p) => ({ ...p, policy: { ...p.policy, enforcementMode: e.target.value as any } }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="Observe">Observe</option>
                    <option value="Warn">Warn</option>
                    <option value="Enforce">Enforce</option>
                  </select>
                </label>

                <label style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "white" }}>
                  <input
                    type="checkbox"
                    checked={s.policy.requireSBOMForTier1}
                    onChange={(e) => setS((p) => ({ ...p, policy: { ...p.policy, requireSBOMForTier1: e.target.checked } }))}
                  />
                  <span style={{ fontWeight: 900 }}>Require SBOM for Tier-1 builds</span>
                </label>

                <label style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "white" }}>
                  <input
                    type="checkbox"
                    checked={s.policy.requireProvenanceForTier1}
                    onChange={(e) => setS((p) => ({ ...p, policy: { ...p.policy, requireProvenanceForTier1: e.target.checked } }))}
                  />
                  <span style={{ fontWeight: 900 }}>Require provenance/attestations for Tier-1</span>
                </label>

                <label style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "white" }}>
                  <input
                    type="checkbox"
                    checked={s.policy.requireLoggingForTier1}
                    onChange={(e) => setS((p) => ({ ...p, policy: { ...p.policy, requireLoggingForTier1: e.target.checked } }))}
                  />
                  <span style={{ fontWeight: 900 }}>Require logging forwarding for Tier-1 services</span>
                </label>
              </div>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ fontWeight: 900 }}>Reporting</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Executive Digest Frequency</span>
                  <select
                    value={s.reporting.executiveDigestFrequency}
                    onChange={(e) => setS((p) => ({ ...p, reporting: { ...p.reporting, executiveDigestFrequency: e.target.value as any } }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </label>

                <label style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "white" }}>
                  <input
                    type="checkbox"
                    checked={s.reporting.includePeerBenchmarking}
                    onChange={(e) => setS((p) => ({ ...p, reporting: { ...p.reporting, includePeerBenchmarking: e.target.checked } }))}
                  />
                  <span style={{ fontWeight: 900 }}>Include peer benchmarking summary (opt-in)</span>
                </label>
              </div>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ fontWeight: 900 }}>Notifications</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <label style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "white" }}>
                  <input
                    type="checkbox"
                    checked={s.notifications.emailEnabled}
                    onChange={(e) => setS((p) => ({ ...p, notifications: { ...p.notifications, emailEnabled: e.target.checked } }))}
                  />
                  <span style={{ fontWeight: 900 }}>Email alerts enabled</span>
                </label>

                <label style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "white" }}>
                  <input
                    type="checkbox"
                    checked={s.notifications.slackEnabled}
                    onChange={(e) => setS((p) => ({ ...p, notifications: { ...p.notifications, slackEnabled: e.target.checked } }))}
                  />
                  <span style={{ fontWeight: 900 }}>Slack alerts enabled</span>
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Severity Threshold</span>
                  <select
                    value={s.notifications.severityThreshold}
                    onChange={(e) => setS((p) => ({ ...p, notifications: { ...p.notifications, severityThreshold: e.target.value as any } }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
