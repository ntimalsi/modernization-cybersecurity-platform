import * as React from "react";

type BuildRow = {
  id: string;
  service: string;
  repo: string;
  sbom: "present" | "missing";
  provenance: "verified" | "unverified" | "missing";
  signing: "signed" | "unsigned";
  vulnerabilities: { critical: number; high: number; medium: number };
  lastBuild: string;
};

const mockBuilds: BuildRow[] = [
  {
    id: "b-1",
    service: "Public Portal",
    repo: "org/portal",
    sbom: "present",
    provenance: "verified",
    signing: "signed",
    vulnerabilities: { critical: 0, high: 2, medium: 9 },
    lastBuild: "2025-12-19"
  },
  {
    id: "b-2",
    service: "Orca API",
    repo: "org/orca-api",
    sbom: "present",
    provenance: "unverified",
    signing: "signed",
    vulnerabilities: { critical: 1, high: 4, medium: 7 },
    lastBuild: "2025-12-18"
  },
  {
    id: "b-3",
    service: "Legacy Batch Processor",
    repo: "org/legacy-batch",
    sbom: "missing",
    provenance: "missing",
    signing: "unsigned",
    vulnerabilities: { critical: 2, high: 8, medium: 13 },
    lastBuild: "2025-11-30"
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

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 800 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function pill(text: string, color: string) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "2px 10px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        fontWeight: 900,
        fontSize: 12,
        color,
        background: "white"
      }}
    >
      {text}
    </span>
  );
}

function buildIntegrityScore(row: BuildRow) {
  let score = 0;
  score += row.sbom === "present" ? 30 : 0;
  score += row.provenance === "verified" ? 35 : row.provenance === "unverified" ? 20 : 0;
  score += row.signing === "signed" ? 20 : 0;

  // vuln penalty
  score -= row.vulnerabilities.critical * 10;
  score -= row.vulnerabilities.high * 3;

  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

export default function SupplyChainSecurityPage() {
  const totals = React.useMemo(() => {
    const services = mockBuilds.length;
    const sbomOk = mockBuilds.filter((b) => b.sbom === "present").length;
    const provVerified = mockBuilds.filter((b) => b.provenance === "verified").length;
    const signed = mockBuilds.filter((b) => b.signing === "signed").length;
    const critical = mockBuilds.reduce((a, b) => a + b.vulnerabilities.critical, 0);
    return { services, sbomOk, provVerified, signed, critical };
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Supply Chain Security"
        subtitle="EO 14028-friendly posture view: SBOM status, provenance integrity, signing, and vulnerability signals per service."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Services tracked" value={String(totals.services)} />
          <KPI label="SBOM present" value={`${totals.sbomOk}/${totals.services}`} />
          <KPI label="Provenance verified" value={`${totals.provVerified}/${totals.services}`} />
          <KPI label="Critical vulns" value={String(totals.critical)} />
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Service</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Repo</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>SBOM</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Provenance</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Signing</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Vulns (C/H/M)</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Integrity Score</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Last Build</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockBuilds.map((b) => {
                const score = buildIntegrityScore(b);
                const scorePill =
                  score >= 80 ? pill("Good", "#16a34a") : score >= 55 ? pill("Needs work", "#d97706") : pill("High risk", "#dc2626");

                return (
                  <tr key={b.id}>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{b.service}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, color: "#6b7280" }}>{b.repo}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      {b.sbom === "present" ? pill("Present", "#16a34a") : pill("Missing", "#dc2626")}
                    </td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      {b.provenance === "verified"
                        ? pill("Verified", "#16a34a")
                        : b.provenance === "unverified"
                        ? pill("Unverified", "#d97706")
                        : pill("Missing", "#dc2626")}
                    </td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      {b.signing === "signed" ? pill("Signed", "#16a34a") : pill("Unsigned", "#dc2626")}
                    </td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      {b.vulnerabilities.critical}/{b.vulnerabilities.high}/{b.vulnerabilities.medium}
                    </td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontWeight: 900 }}>{score}/100</span>
                        {scorePill}
                      </div>
                    </td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{b.lastBuild}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      <button
                        style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 900 }}
                        onClick={() => alert("Demo: open SBOM / scan report / provenance attestation (coming next).")}
                      >
                        View Evidence
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Recommended Actions (demo)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Make SBOM generation mandatory for all builds and store artifacts for audits.</li>
            <li>Require signed builds + verified provenance (SLSA-style) for critical services.</li>
            <li>Block deployments on critical vulnerabilities; create remediation SLAs by severity.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
