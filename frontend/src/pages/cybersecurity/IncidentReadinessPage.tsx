import * as React from "react";

type Playbook = {
  id: string;
  name: string;
  owner: string;
  status: "missing" | "draft" | "approved";
  lastUpdated: string;
};

type Drill = {
  id: string;
  scenario: string;
  owner: string;
  completed: boolean;
  date: string;
  gaps: number;
};

const mockPlaybooks: Playbook[] = [
  { id: "p-1", name: "Ransomware Response", owner: "SecOps", status: "approved", lastUpdated: "2025-11-10" },
  { id: "p-2", name: "Account Compromise (IdP)", owner: "IAM", status: "draft", lastUpdated: "2025-12-01" },
  { id: "p-3", name: "Third-Party Vendor Incident", owner: "GRC", status: "missing", lastUpdated: "—" }
];

const mockDrills: Drill[] = [
  { id: "d-1", scenario: "Ransomware tabletop", owner: "SecOps", completed: true, date: "2025-10-12", gaps: 3 },
  { id: "d-2", scenario: "SSO outage & recovery", owner: "IAM", completed: false, date: "2025-12-28", gaps: 0 },
  { id: "d-3", scenario: "Data exfiltration triage", owner: "SecOps", completed: true, date: "2025-09-05", gaps: 5 }
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
    <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color }}>
      {text}
    </span>
  );
}

export default function IncidentReadinessPage() {
  const approved = mockPlaybooks.filter((p) => p.status === "approved").length;
  const missing = mockPlaybooks.filter((p) => p.status === "missing").length;
  const upcoming = mockDrills.filter((d) => !d.completed).length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Incident Readiness"
        subtitle="Preparedness to respond: playbooks, tabletop exercises, and tracked gaps. Demonstrates the platform is actionable, not just reporting."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="Playbooks approved" value={`${approved}/${mockPlaybooks.length}`} />
          <KPI label="Playbooks missing" value={String(missing)} />
          <KPI label="Upcoming drills" value={String(upcoming)} />
          <KPI label="Total gaps (recent drills)" value={String(mockDrills.reduce((a, d) => a + d.gaps, 0))} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Playbooks</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>Status by scenario owner.</div>

            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Scenario</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPlaybooks.map((p) => (
                    <tr key={p.id}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{p.name}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.owner}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                        {p.status === "approved"
                          ? pill("APPROVED", "#16a34a")
                          : p.status === "draft"
                          ? pill("DRAFT", "#d97706")
                          : pill("MISSING", "#dc2626")}
                      </td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{p.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              style={{ marginTop: 12, padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 900 }}
              onClick={() => alert("Demo: create a playbook template + assign owner + due date (coming next).")}
            >
              Create Playbook Template (Demo)
            </button>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Tabletop Exercises</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>Drill schedule and tracked gaps.</div>

            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Scenario</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Completed</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Date</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Gaps</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDrills.map((d) => (
                    <tr key={d.id}>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, fontWeight: 900 }}>{d.scenario}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.owner}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.completed ? "✅" : "⏳"}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.date}</td>
                      <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{d.gaps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              style={{ marginTop: 12, padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 900, background: "#111827", color: "white" }}
              onClick={() => alert("Demo: generate gap remediation tasks + owners (coming next).")}
            >
              Convert Gaps to Remediation Tasks (Demo)
            </button>
          </div>
        </div>

        <div style={{ marginTop: 14, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 900 }}>Recommended Actions (demo)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Standardize incident playbooks across institutions using reusable templates.</li>
            <li>Run quarterly tabletop exercises and track remediation closure.</li>
            <li>Integrate evidence packs (logs, approvals, scan reports) to support audits and post-incident review.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
