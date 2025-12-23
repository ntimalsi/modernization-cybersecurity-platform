import * as React from "react";

type ProfileKey = "k12" | "r1" | "municipal" | "public_safety";

type TargetProfile = {
  key: ProfileKey;
  title: string;
  subtitle: string;
  recommendedCapabilities: string[];
  baselinePolicies: string[];
  deploymentBlueprints: string[];
  adoptionChecklist: string[];
};

const profiles: TargetProfile[] = [
  {
    key: "k12",
    title: "K-12 District (Small/Medium)",
    subtitle: "Standardized core services, simple segmentation, strong identity controls, low ops burden.",
    recommendedCapabilities: [
      "Centralized asset inventory (devices, servers, apps)",
      "MFA + SSO for staff/admin",
      "Logging forwarding for critical systems",
      "Endpoint baseline coverage and patching cadence"
    ],
    baselinePolicies: ["MFA required for admin access", "No direct internet exposure for internal admin ports", "Central log forwarding required"],
    deploymentBlueprints: ["Terraform landing zone (basic)", "CI/CD template (app+db)", "Logging forwarding baseline"],
    adoptionChecklist: ["Inventory + ownership tagging", "Turn on MFA/SSO for admins", "Enable log forwarding for core systems", "Create baseline configs for top 20 assets"]
  },
  {
    key: "r1",
    title: "R1 University (Complex)",
    subtitle: "Multi-domain IT, federated identity, research networks, and segmented zones with strong governance.",
    recommendedCapabilities: [
      "Dependency graph for critical services",
      "Zero Trust readiness program (identity + segmentation + device posture)",
      "Policy-as-code guardrails for IaC & K8s",
      "Evidence packs for audits and grants"
    ],
    baselinePolicies: ["Least privilege enforced for admin roles", "Segmentation required between admin and user zones", "Policy checks in CI/CD required"],
    deploymentBlueprints: ["K8s cluster baseline (RBAC + network policy)", "Policy-as-code pack (audit→enforce)", "SBOM/provenance pipeline template"],
    adoptionChecklist: ["Define critical service tiers", "Map dependencies for critical apps", "Adopt GitOps baseline for infra", "Enable compliance evidence capture"]
  },
  {
    key: "municipal",
    title: "Municipal / County IT",
    subtitle: "High availability for citizen services, consistent change control, and audit-ready evidence.",
    recommendedCapabilities: [
      "Lifecycle planning + EOL mitigation",
      "Continuity readiness (DR/backups tested)",
      "Change history and audit trails",
      "Standard CI/CD templates with approval gates"
    ],
    baselinePolicies: ["Backups tested quarterly", "Change approvals required for production", "Encryption enforced for sensitive data"],
    deploymentBlueprints: ["CI/CD with approvals + scanning", "DR readiness checklist", "Asset lifecycle reporting template"],
    adoptionChecklist: ["Tag assets by service owner", "Identify EOL systems and upgrade plan", "Establish backup testing schedule", "Enable approvals for prod deployments"]
  },
  {
    key: "public_safety",
    title: "Public Safety / E911 Environment",
    subtitle: "Mission-critical uptime, redundancy, segmentation, and tight access control.",
    recommendedCapabilities: [
      "Availability readiness score for critical services",
      "Strict segmentation and limited administrative exposure",
      "Continuous config drift monitoring for critical nodes",
      "Rapid evidence reporting for incident response"
    ],
    baselinePolicies: ["Zero internet-exposed admin interfaces", "Redundancy required for tier-0 services", "Drift alerts prioritized for E911 assets"],
    deploymentBlueprints: ["Tier-0 network segmentation baseline", "Drift baseline policy for critical assets", "Incident readiness evidence pack"],
    adoptionChecklist: ["Identify tier-0 assets", "Create redundancy plan and validate", "Baseline configs + drift monitoring", "Run tabletop exercises & track gaps"]
  }
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

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <ul style={{ marginTop: 10, paddingLeft: 18, color: "#111827" }}>
        {items.map((x) => (
          <li key={x} style={{ marginBottom: 6 }}>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReferenceArchitecturesPage() {
  const [selected, setSelected] = React.useState<ProfileKey>("k12");
  const profile = profiles.find((p) => p.key === selected)!;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Reference Architectures"
        subtitle="Vendor-neutral patterns that prove broad adoptability (not one-off consulting). Pick a profile to see recommended capabilities, baseline policies, and adoption checklists."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {profiles.map((p) => {
            const active = p.key === selected;
            return (
              <button
                key={p.key}
                onClick={() => setSelected(p.key)}
                style={{
                  cursor: "pointer",
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  background: active ? "#111827" : "white",
                  color: active ? "white" : "#111827",
                  fontWeight: 900
                }}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 14, padding: 12, border: "1px solid #e5e7eb", borderRadius: 16, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>{profile.title}</div>
          <div style={{ color: "#6b7280", marginTop: 6 }}>{profile.subtitle}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <Section title="Recommended Capabilities" items={profile.recommendedCapabilities} />
          <Section title="Baseline Policies" items={profile.baselinePolicies} />
          <Section title="Deployment Blueprints" items={profile.deploymentBlueprints} />
          <Section title="Adoption Checklist" items={profile.adoptionChecklist} />
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#111827",
              color: "white",
              fontWeight: 900,
              cursor: "pointer"
            }}
            onClick={() => alert("Demo: Apply target profile → show delta vs current posture (coming next).")}
          >
            Apply Profile (Demo)
          </button>
          <div style={{ color: "#6b7280" }}>
            Next: show “current posture vs target” deltas and generate a roadmap from gaps.
          </div>
        </div>
      </Card>
    </div>
  );
}
