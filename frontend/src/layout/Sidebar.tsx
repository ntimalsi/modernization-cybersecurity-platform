import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * ---------- Types ----------
 */
type NavItem = { to: string; label: string };
type NavGroup = { id: string; title: string; items: NavItem[]; icon?: React.ReactNode };

/**
 * ---------- Config ----------
 * Keep ALL nav structure in one place.
 */
const NAV: NavGroup[] = [
  {
    id: "overview",
    title: "Overview",
    icon: <span aria-hidden>📊</span>,
    items: [
      { to: "/overview/executive", label: "Executive Dashboard" },
      { to: "/overview/roadmap", label: "Program Roadmap" }
    ]
  },
  {
    id: "modernization",
    title: "Modernization",
    icon: <span aria-hidden>🧱</span>,
    items: [
      { to: "/modernization/overview", label: "Infrastructure Overview" },
      { to: "/modernization/assets", label: "Asset Inventory" },
      { to: "/modernization/scorecard", label: "Modernization Scorecard" },
      { to: "/modernization/dependency-map", label: "Dependency Map" },
      { to: "/modernization/reference-architectures", label: "Reference Architectures" },
      { to: "/modernization/lifecycle", label: "Lifecycle & Technical Debt" },
      { to: "/modernization/telemetry", label: "Telemetry Readiness" }
    ]
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: <span aria-hidden>🛡️</span>,
    items: [
      { to: "/cybersecurity/soc", label: "Security Operations Center" },
      { to: "/cybersecurity/drift", label: "Drift Detection" },
      { to: "/cybersecurity/zerotrust", label: "Zero Trust Readiness" },
      { to: "/cybersecurity/identity", label: "Identity & Access Posture" },
      { to: "/cybersecurity/supply-chain", label: "Supply Chain Security" },
      { to: "/cybersecurity/exposure", label: "Vulnerability & Exposure" },
      { to: "/cybersecurity/resilience", label: "Resilience & Continuity" },
      { to: "/cybersecurity/incident-readiness", label: "Incident Readiness" }
    ]
  },
  {
    id: "automation",
    title: "Automation & IaC",
    icon: <span aria-hidden>⚙️</span>,
    items: [
      { to: "/automation/iac-blueprints", label: "IaC Blueprints" },
      { to: "/automation/cicd-blueprints", label: "CI/CD Blueprints" },
      { to: "/automation/policy-as-code", label: "Policy-as-Code" },
      { to: "/automation/gitops-remediation", label: "GitOps Drift & Remediation" },
      { to: "/automation/secure-provisioning", label: "Secure Provisioning" }
    ]
  },
  {
    id: "compliance",
    title: "Compliance & Evidence",
    icon: <span aria-hidden>✅</span>,
    items: [
      { to: "/compliance/snapshot", label: "Compliance Snapshot" },
      { to: "/compliance/mapping", label: "Control Mapping Studio" },
      { to: "/compliance/evidence", label: "Evidence Pack Builder" },
      { to: "/compliance/audit", label: "Audit Trails" },
      { to: "/compliance/reports", label: "Reports" }
    ]
  },
  {
    id: "ai",
    title: "AI & Simulation",
    icon: <span aria-hidden>🤖</span>,
    items: [
      { to: "/ai/risk", label: "Risk Prioritization Engine" },
      { to: "/ai/anomalies", label: "Misconfiguration Anomalies" },
      { to: "/ai/digital-twin", label: "Digital Twin" }
    ]
  },
  {
    id: "collaboration",
    title: "Collaboration",
    icon: <span aria-hidden>🤝</span>,
    items: [
      { to: "/collaboration/benchmarking", label: "Peer Benchmarking" },
      { to: "/collaboration/exchange", label: "Template Exchange" },
      { to: "/collaboration/training", label: "Workforce Training & Labs" }
    ]
  },
  {
    id: "admin",
    title: "Admin",
    icon: <span aria-hidden>🔧</span>,
    items: [
      { to: "/admin/institutions", label: "Institutions" },
      { to: "/admin/integrations", label: "Integrations" },
      { to: "/admin/settings", label: "Settings" }
    ]
  }
];

/**
 * ---------- Small helpers ----------
 */
function isGroupActive(pathname: string, group: NavGroup) {
  return group.items.some((it) => pathname === it.to || pathname.startsWith(it.to + "/"));
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 140ms ease"
      }}
    >
      ▶
    </span>
  );
}

function NavItemLink({ to, label }: NavItem) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: "none",
        padding: "9px 10px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: isActive ? "#111827" : "white",
        color: isActive ? "white" : "#111827",
        fontWeight: 700,
        fontSize: 13,
        lineHeight: "18px"
      })}
    >
      {label}
    </NavLink>
  );
}

/**
 * ---------- Component ----------
 */
export default function Sidebar() {
  const { pathname } = useLocation();

  // default open: only the active group (or Overview if none matched)
  const defaultOpen = React.useMemo(() => {
    const active = NAV.find((g) => isGroupActive(pathname, g))?.id ?? "overview";
    return new Set([active]);
  }, [pathname]);

  const [openSet, setOpenSet] = React.useState<Set<string>>(defaultOpen);

  // when route changes, ensure the active group is expanded (but don't collapse others)
  React.useEffect(() => {
    const activeId = NAV.find((g) => isGroupActive(pathname, g))?.id;
    if (!activeId) return;
    setOpenSet((prev) => {
      if (prev.has(activeId)) return prev;
      const next = new Set(prev);
      next.add(activeId);
      return next;
    });
  }, [pathname]);

  const expandAll = () => setOpenSet(new Set(NAV.map((g) => g.id)));
  const collapseAll = () => setOpenSet(new Set());

  return (
    <div style={{ position: "sticky", top: 18, alignSelf: "start" }}>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 12 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <div style={{ fontWeight: 900, color: "#111827", fontSize: 14 }}>Platform</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={expandAll}
              style={{
                border: "1px solid #e5e7eb",
                background: "white",
                borderRadius: 10,
                padding: "6px 8px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 800
              }}
            >
              Expand
            </button>
            <button
              type="button"
              onClick={collapseAll}
              style={{
                border: "1px solid #e5e7eb",
                background: "white",
                borderRadius: 10,
                padding: "6px 8px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 800
              }}
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Accordion groups */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {NAV.map((group) => {
            const open = openSet.has(group.id);
            const active = isGroupActive(pathname, group);

            return (
              <div key={group.id} style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenSet((prev) => {
                      const next = new Set(prev);
                      if (next.has(group.id)) next.delete(group.id);
                      else next.add(group.id);
                      return next;
                    });
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "10px 12px",
                    cursor: "pointer",
                    border: 0,
                    background: active ? "#f9fafb" : "white"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Chevron open={open} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{group.icon}</span>
                      <span style={{ fontWeight: 900, color: "#111827", fontSize: 13 }}>{group.title}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#6b7280",
                      border: "1px solid #e5e7eb",
                      borderRadius: 999,
                      padding: "3px 8px",
                      background: "white"
                    }}
                    aria-label={`${group.items.length} items`}
                  >
                    {group.items.length}
                  </div>
                </button>

                {open && (
                  <div style={{ padding: 10, paddingTop: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {group.items.map((it) => (
                        <NavItemLink key={it.to} {...it} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
