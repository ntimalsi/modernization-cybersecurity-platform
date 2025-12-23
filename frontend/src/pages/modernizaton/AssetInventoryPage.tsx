import { useEffect, useMemo, useState } from "react";
import { mockApi, type Asset } from "../../mockApi";

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle ? <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div> : null}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: "100%" }}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: "100%" }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function TagPill({ text }: { text: string }) {
  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: "#f9fafb",
        fontSize: 12,
        marginRight: 6,
        display: "inline-block",
        marginBottom: 6
      }}
    >
      {text}
    </span>
  );
}

export default function AssetInventoryPage() {
  const institutionId = localStorage.getItem("inst") ?? "inst_demo_1";

  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [owner, setOwner] = useState<string>("all");
  const [tagQuery, setTagQuery] = useState<string>("");

  async function load() {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      const a = await mockApi.listAssets(institutionId);
      setAssets(a);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const owners = useMemo(() => {
    const set = new Set<string>();
    for (const a of assets) if ((a.owner ?? "").trim()) set.add(a.owner!.trim());
    return ["all", ...Array.from(set).sort()];
  }, [assets]);

  const types = useMemo(() => {
    const set = new Set<string>();
    for (const a of assets) set.add(a.assetType);
    return ["all", ...Array.from(set).sort()];
  }, [assets]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const tq = tagQuery.trim().toLowerCase();

    return assets.filter((a) => {
      if (type !== "all" && a.assetType !== type) return false;
      if (owner !== "all" && (a.owner ?? "").trim() !== owner) return false;

      if (qq) {
        const hay = `${a.hostname ?? ""} ${a.ip ?? ""} ${a.os ?? ""} ${a.owner ?? ""} ${a.tags ?? ""}`.toLowerCase();
        if (!hay.includes(qq)) return false;
      }
      if (tq) {
        const tags = (a.tags ?? "").toLowerCase();
        if (!tags.includes(tq)) return false;
      }
      return true;
    });
  }, [assets, q, type, owner, tagQuery]);

  async function mockImport() {
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      const r = await mockApi.mockImportCsv(institutionId);
      setMsg(`Mock import added ${r.imported} assets.`);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Import failed");
    } finally {
      setLoading(false);
    }
  }

  function splitTags(tags?: string) {
    return (tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel
        title="Asset Inventory"
        subtitle="Discovery + normalized inventory with governance metadata. Demonstrates broad adoptability without vendor lock-in."
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
            onClick={mockImport}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: 800 }}
          >
            Mock CSV Import
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

        {/* filters */}
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10 }}>
          <Input value={q} onChange={setQ} placeholder="Search hostname, IP, OS, tags..." />
          <Select value={type} onChange={setType} options={types} />
          <Select value={owner} onChange={setOwner} options={owners} />
          <Input value={tagQuery} onChange={setTagQuery} placeholder="Filter by tag (e.g., logs:on)" />
        </div>

        <div style={{ marginTop: 10, color: "#6b7280" }}>
          Showing <b>{filtered.length}</b> of <b>{assets.length}</b> assets
        </div>

        {/* table */}
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Hostname</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>IP</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Type</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>OS/FW</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Owner</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.hostname || <span style={{ color: "#9ca3af" }}>(none)</span>}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.ip || <span style={{ color: "#9ca3af" }}>(none)</span>}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.assetType}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.os || <span style={{ color: "#9ca3af" }}>(unknown)</span>}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{a.owner || <span style={{ color: "#9ca3af" }}>(unassigned)</span>}</td>
                  <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>
                    {splitTags(a.tags).length ? splitTags(a.tags).map((t) => <TagPill key={t} text={t} />) : <span style={{ color: "#9ca3af" }}>(none)</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 12, color: "#6b7280" }}>
                    No results. Try clearing filters or run “Mock CSV Import”.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="What this demonstrates (NIW-friendly)" subtitle="Why this is reusable and scalable beyond one employer.">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li style={{ marginBottom: 8 }}>
            A vendor-neutral inventory model that can be adopted across universities, K-12, municipalities, and agencies.
          </li>
          <li style={{ marginBottom: 8 }}>
            Governance metadata (owner/tags) enables standardization and automation without disruptive changes.
          </li>
          <li>
            The inventory becomes a shared foundation for modernization scoring, drift detection, Zero Trust checks, and compliance reporting.
          </li>
        </ul>
      </Panel>
    </div>
  );
}
