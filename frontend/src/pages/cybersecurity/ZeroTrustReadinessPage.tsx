import { useEffect, useMemo, useState } from "react";
import { mockApi, type ZeroTrustCheck } from "../../mockApi";

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle ? <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div> : null}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 12 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function buildZtRecs(score: number, checks: ZeroTrustCheck[]) {
  const missing = checks.filter((c) => !c.passed);
  const recs: string[] = [];
  if (score < 70) recs.push(`Zero Trust readiness is ${score}%. Focus on the highest-impact missing controls first.`);
  if (missing.length) {
    recs.push(`Top missing controls: ${missing.slice(0, 4).map((m) => m.title).join("; ")}.`);
  } else {
    recs.push("All baseline Zero Trust checks are marked passed. Expand checks and add evidence collection next.");
  }
  return recs;
}

export default function ZeroTrustReadinessPage() {
  const institutionId = localStorage.getItem("inst") ?? "inst_demo_1";

  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [checks, setChecks] = useState<ZeroTrustCheck[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      const z = await mockApi.listZeroTrust(institutionId);
      setScore(z.score);
      setChecks(z.checks);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load Zero Trust checks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return checks;
    return checks.filter((c) => `${c.title} ${c.key}`.toLowerCase().includes(qq));
  }, [checks, q]);

  const passed = checks.filter((c) => c.passed).length;

  const recs = useMemo(() => buildZtRecs(score, checks), [score, checks]);

  async function toggle(checkId: string, passed: boolean) {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      await mockApi.toggleZeroTrust(checkId, passed);
      setMsg("Updated check (mock).");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel
        title="Zero Trust Readiness"
        subtitle="Control-based readiness scoring (vendor-neutral). Toggle checks to simulate pilot verification and score changes."
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

        {msg ? (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 12, border: "1px solid #d1e7dd", background: "#d1e7dd55" }}>
            {msg}
          </div>
        ) : null}
        {error ? (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 12, border: "1px solid #f5c2c7", background: "#f8d7da" }}>
            {error}
          </div>
        ) : null}

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Card label="Readiness Score" value={`${score}%`} />
          <Card label="Checks Passed" value={`${passed}/${checks.length}`} />
          <Card label="Missing Checks" value={checks.length - passed} />
          <Card label="Pilot Mode" value="Manual verification" />
        </div>

        <div style={{ marginTop: 12, height: 10, borderRadius: 999, background: "#f3f4f6", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: "#111827" }} />
        </div>
      </Panel>

      <Panel title="Recommendations" subtitle="Explainable actions derived from missing controls (demo logic).">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {recs.map((r, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {r}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Controls Checklist" subtitle="Search checks and mark them passed/missing to demonstrate score changes.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 10, marginBottom: 12 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search controls (e.g., MFA, SSO, segmentation)..."
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: "100%" }}
          />
          <div style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#6b7280" }}>
            Showing <b>{filtered.length}</b> of <b>{checks.length}</b>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Control</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{c.title}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{c.passed ? "✅ Passed" : "❌ Missing"}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                  <button
                    onClick={() => toggle(c.id, !c.passed)}
                    disabled={loading}
                    style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: 800 }}
                  >
                    Mark {c.passed ? "Missing" : "Passed"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 12, color: "#6b7280" }}>
                  No checks match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
