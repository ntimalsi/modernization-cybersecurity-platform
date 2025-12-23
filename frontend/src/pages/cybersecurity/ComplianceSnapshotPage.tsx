import { useEffect, useMemo, useState } from "react";
import { mockApi, type ZeroTrustCheck, type Asset } from "../../mockApi";

type ControlMap = {
  id: string;
  family: string;
  control: string;
  description: string;
  mappedKeys: string[]; // from Zero Trust checks
};

const MINI_PROFILE: ControlMap[] = [
  { id: "AC-2", family: "Access Control", control: "AC-2", description: "Account management / privileged access", mappedKeys: ["least_privilege", "mfa"] },
  { id: "AC-3", family: "Access Control", control: "AC-3", description: "Access enforcement", mappedKeys: ["sso", "least_privilege"] },
  { id: "SC-7", family: "System & Comms", control: "SC-7", description: "Boundary protection / segmentation", mappedKeys: ["segmentation"] },
  { id: "AU-2", family: "Audit & Accountability", control: "AU-2", description: "Event logging", mappedKeys: ["logging"] },
  { id: "SI-2", family: "System Integrity", control: "SI-2", description: "Flaw remediation / patching", mappedKeys: ["patching"] },
  { id: "CP-9", family: "Contingency", control: "CP-9", description: "Backups and recovery", mappedKeys: ["backup"] },
  { id: "SI-3", family: "System Integrity", control: "SI-3", description: "Malicious code protection (EDR)", mappedKeys: ["edr"] }
];

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle ? <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div> : null}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function HeatCell({ label, status }: { label: string; status: "met" | "partial" | "missing" }) {
  const bg = status === "met" ? "#dcfce7" : status === "partial" ? "#fef9c3" : "#fee2e2";
  const border = status === "met" ? "#86efac" : status === "partial" ? "#fde047" : "#fca5a5";
  const text = status === "met" ? "Met" : status === "partial" ? "Partial" : "Missing";
  return (
    <div style={{ border: `1px solid ${border}`, background: bg, borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 900 }}>{label}</div>
      <div style={{ marginTop: 6, color: "#111827" }}>{text}</div>
    </div>
  );
}

export default function ComplianceSnapshotPage() {
  const institutionId = localStorage.getItem("inst") ?? "inst_demo_1";

  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState<ZeroTrustCheck[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [z, a] = await Promise.all([mockApi.listZeroTrust(institutionId), mockApi.listAssets(institutionId)]);
      setChecks(z.checks);
      setAssets(a);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load compliance snapshot");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const checkByKey = useMemo(() => {
    const m = new Map<string, ZeroTrustCheck>();
    for (const c of checks) m.set(c.key, c);
    return m;
  }, [checks]);

  function statusFor(mappedKeys: string[]): "met" | "partial" | "missing" {
    const relevant = mappedKeys.map((k) => checkByKey.get(k)).filter(Boolean) as ZeroTrustCheck[];
    if (relevant.length === 0) return "missing";
    const passed = relevant.filter((c) => c.passed).length;
    if (passed === 0) return "missing";
    if (passed === relevant.length) return "met";
    return "partial";
  }

  const families = useMemo(() => {
    const set = new Set<string>();
    MINI_PROFILE.forEach((c) => set.add(c.family));
    return Array.from(set);
  }, []);

  const coverage = useMemo(() => {
    const rows = MINI_PROFILE.map((c) => statusFor(c.mappedKeys));
    const met = rows.filter((s) => s === "met").length;
    const partial = rows.filter((s) => s === "partial").length;
    const missing = rows.filter((s) => s === "missing").length;
    return { met, partial, missing, total: rows.length };
  }, [checkByKey]);

  const evidenceHints = useMemo(() => {
    // Simple demo evidence guidance; in real system, evidence = config logs/screenshots/SSO policies.
    const missing = checks.filter((c) => !c.passed).slice(0, 5);
    if (!missing.length) return ["All mapped controls are satisfied in this mini-profile. Expand mapping scope next."];
    return missing.map((m) => `Collect evidence for "${m.title}" (policy screenshot, config export, or audit log reference).`);
  }, [checks]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel
        title="Compliance Snapshot (NIST mini-profile)"
        subtitle="Maps technical signals (Zero Trust checks) to a small, explainable subset of NIST-style controls and visualizes coverage."
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={load}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #111827", background: "#111827", color: "white", cursor: "pointer", fontWeight: 800 }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <div style={{ color: "#6b7280" }}>
            Institution: <code>{institutionId}</code>
          </div>
        </div>

        {error ? (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 12, border: "1px solid #f5c2c7", background: "#f8d7da" }}>
            {error}
          </div>
        ) : null}

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Controls (mini)</div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{coverage.total}</div>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Met</div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{coverage.met}</div>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Partial</div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{coverage.partial}</div>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Missing</div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{coverage.missing}</div>
          </div>
        </div>
      </Panel>

      <Panel title="Coverage Heatmap" subtitle="Green = met, yellow = partial, red = missing (based on mapped Zero Trust checks).">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {families.map((fam) => {
            const famControls = MINI_PROFILE.filter((c) => c.family === fam);
            const famStatus = statusFor(famControls.flatMap((c) => c.mappedKeys));
            return <HeatCell key={fam} label={fam} status={famStatus} />;
          })}
        </div>

        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Family</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Control</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Description</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Mapped Signals</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {MINI_PROFILE.map((c) => {
                const s = statusFor(c.mappedKeys);
                return (
                  <tr key={c.id}>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{c.family}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{c.control}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{c.description}</td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      {c.mappedKeys.map((k) => (
                        <span key={k} style={{ marginRight: 8, padding: "3px 8px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 12 }}>
                          {k}
                        </span>
                      ))}
                    </td>
                    <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                      {s === "met" ? "🟢 Met" : s === "partial" ? "🟡 Partial" : "🔴 Missing"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Evidence Notes" subtitle="In the full platform, evidence is stored as policy artifacts and config exports.">
        <div style={{ color: "#6b7280", marginBottom: 10 }}>
          Assets in inventory: <b>{assets.length}</b>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {evidenceHints.map((t, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {t}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
