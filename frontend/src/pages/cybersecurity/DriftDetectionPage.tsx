import { useEffect, useMemo, useState } from "react";
import { mockApi, type DriftEvent, type Asset } from "../../mockApi";

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

export default function DriftDetectionPage() {
  const institutionId = localStorage.getItem("inst") ?? "inst_demo_1";

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<DriftEvent[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      const [d, a] = await Promise.all([mockApi.listDrift(institutionId), mockApi.listAssets(institutionId)]);
      setEvents(d);
      setAssets(a);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load drift");
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
    if (!qq) return events;
    return events.filter((e) => {
      const hay = `${e.summary ?? ""} ${e.hostname ?? ""} ${e.ip ?? ""}`.toLowerCase();
      return hay.includes(qq);
    });
  }, [events, q]);

  const driftAssets = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) if (e.hostname || e.ip) set.add(`${e.hostname ?? ""}|${e.ip ?? ""}`);
    return set.size;
  }, [events]);

  async function generateDrift() {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      await mockApi.generateDrift(institutionId);
      setMsg("Generated a drift event (mock).");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate drift");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel
        title="Drift Detection"
        subtitle="Demonstrates configuration integrity: baseline vs current drift events and evidence-ready timelines."
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={load}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #111827", background: "#111827", color: "white", cursor: "pointer", fontWeight: 800 }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={generateDrift}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: 800 }}
          >
            Generate Drift (Mock)
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
          <Card label="Assets" value={assets.length} />
          <Card label="Drift Events" value={events.length} />
          <Card label="Assets w/ Drift" value={driftAssets} />
          <Card label="Last Event" value={events[0] ? new Date(events[0].createdAt).toLocaleString() : "—"} />
        </div>
      </Panel>

      <Panel title="Drift Timeline" subtitle="Search drift summaries and review evidence of changes.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 10, marginBottom: 12 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search drift by hostname, IP, summary..."
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: "100%" }}
          />
          <div style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#6b7280" }}>
            Showing <b>{filtered.length}</b> of <b>{events.length}</b>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Time</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Asset</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Summary</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{new Date(e.createdAt).toLocaleString()}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{e.hostname ?? e.ip ?? "(unknown)"}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{e.summary}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    <details>
                      <summary style={{ cursor: "pointer", color: "#111827", fontWeight: 700 }}>View diff</summary>
                      <pre style={{ marginTop: 10, padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", overflowX: "auto" }}>
                        {JSON.stringify(e.diff ?? {}, null, 2)}
                      </pre>
                    </details>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 12, color: "#6b7280" }}>
                    No drift events found. Click “Generate Drift (Mock)” to demonstrate.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="What this demonstrates (NIW-friendly)" subtitle="Why drift detection is a scalable, nationally important control primitive.">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li style={{ marginBottom: 8 }}>
            Drift events provide evidence of misconfiguration risk and unauthorized change across vendors and environments.
          </li>
          <li style={{ marginBottom: 8 }}>
            Supports compliance and incident response by maintaining an auditable change history.
          </li>
          <li>
            A modular control that can be adopted widely by public institutions without requiring proprietary tools.
          </li>
        </ul>
      </Panel>
    </div>
  );
}