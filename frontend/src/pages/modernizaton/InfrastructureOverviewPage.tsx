import { useEffect, useMemo, useState } from "react";
import { mockApi, type Asset, type ModernizationDashboard } from "../../mockApi";

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 12 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle ? <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div> : null}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function BarRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ height: 10, borderRadius: 999, background: "#f3f4f6", overflow: "hidden", border: "1px solid #e5e7eb" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#111827" }} />
      </div>
      <div style={{ textAlign: "right", color: "#6b7280" }}>{value}</div>
    </div>
  );
}

function isOutdated(os?: string) {
  return /(2008|2012|\b7\b|xp|centos\s*6|ubuntu\s*16)/i.test(os ?? "");
}

export default function InfrastructureOverviewPage() {
  const institutionId = localStorage.getItem("inst") ?? "inst_demo_1";

  const [loading, setLoading] = useState(false);
  const [mod, setMod] = useState<ModernizationDashboard | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [m, a] = await Promise.all([
        mockApi.getModernizationDashboard(institutionId),
        mockApi.listAssets(institutionId)
      ]);
      setMod(m);
      setAssets(a);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const total = mod?.totals.assets ?? 0;

  const topUnknown = useMemo(() => {
    return assets
      .filter((a) => a.assetType === "unknown")
      .slice(0, 8)
      .map((a) => a.hostname || a.ip || "(unknown)");
  }, [assets]);

  const topOutdated = useMemo(() => {
    return assets
      .filter((a) => isOutdated(a.os))
      .slice(0, 8)
      .map((a) => `${a.hostname || a.ip || "(unknown)"} — ${a.os}`);
  }, [assets]);

  const topUntagged = useMemo(() => {
    return assets
      .filter((a) => !(a.tags ?? "").trim())
      .slice(0, 8)
      .map((a) => a.hostname || a.ip || "(unknown)");
  }, [assets]);

  const byTypeSorted = useMemo(() => {
    const byType = mod?.byType ?? {};
    return Object.entries(byType).sort((a, b) => b[1] - a[1]);
  }, [mod]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel
        title="Infrastructure Overview"
        subtitle="Executive KPIs to guide modernization planning: visibility, legacy risk, standardization, telemetry readiness."
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <button
            onClick={load}
            disabled={loading}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #111827",
              background: "#111827",
              color: "white",
              cursor: "pointer",
              fontWeight: 800
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <div style={{ color: "#6b7280" }}>
            Institution: <code>{institutionId}</code>
          </div>
        </div>

        {error ? (
          <div style={{ padding: 10, borderRadius: 12, border: "1px solid #f5c2c7", background: "#f8d7da" }}>
            {error}
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Card label="Total Assets" value={mod?.totals.assets ?? 0} />
          <Card label="Unknown Assets" value={mod?.totals.unknownAssets ?? 0} />
          <Card label="Untagged Assets" value={mod?.totals.untagged ?? 0} />
          <Card label="Outdated OS/FW" value={mod?.totals.outdated ?? 0} />
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Card label="Visibility" value={`${mod?.scores.visibility ?? 0}%`} />
          <Card label="Lifecycle" value={`${mod?.scores.lifecycle ?? 0}%`} />
          <Card label="Standardization" value={`${mod?.scores.standardization ?? 0}%`} />
          <Card label="Telemetry Readiness" value={`${mod?.scores.loggingReadiness ?? 0}%`} />
        </div>
      </Panel>

      <Panel title="Asset Type Breakdown" subtitle="Distribution across infrastructure categories (vendor-neutral).">
        {byTypeSorted.length === 0 ? (
          <div style={{ color: "#6b7280" }}>No assets available yet. Use “Mock Import” on the Asset Inventory page.</div>
        ) : (
          <div>
            {byTypeSorted.map(([t, n]) => (
              <BarRow key={t} label={t} value={n} total={total} />
            ))}
          </div>
        )}
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <Panel title="Top Unknown / Unmanaged" subtitle="Assets lacking classification or inventory completeness.">
          {topUnknown.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {topUnknown.map((x, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  {x}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#6b7280" }}>No unknown assets detected.</div>
          )}
        </Panel>

        <Panel title="Top Outdated OS/FW" subtitle="Legacy systems that raise operational and security risk.">
          {topOutdated.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {topOutdated.map((x, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  {x}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#6b7280" }}>No outdated OS/FW detected (demo heuristic).</div>
          )}
        </Panel>

        <Panel title="Top Untagged Assets" subtitle="Governance gap: missing ownership/environment/logging tags.">
          {topUntagged.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {topUntagged.map((x, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  {x}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#6b7280" }}>All assets have tags.</div>
          )}
        </Panel>
      </div>
    </div>
  );
}
