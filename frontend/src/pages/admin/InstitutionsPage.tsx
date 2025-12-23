import * as React from "react";

type Institution = {
  id: string;
  name: string;
  sector: "Higher Ed" | "K-12" | "Municipal" | "Public Safety" | "Other";
  state: string;
  size: "Small" | "Medium" | "Large";
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  dataMode: "Mock" | "CSV Import" | "API Connectors";
  status: "Active" | "Paused" | "Archived";
  createdAt: string;
  notes?: string;
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
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        fontWeight: 900,
        fontSize: 12,
        color: fg,
        background: bg
      }}
    >
      {text}
    </span>
  );
}

function statusPill(s: Institution["status"]) {
  if (s === "Active") return pill("ACTIVE", "#16a34a", "#f0fdf4");
  if (s === "Paused") return pill("PAUSED", "#b45309", "#fff7ed");
  return pill("ARCHIVED", "#6b7280", "#f9fafb");
}

const seedInstitutions: Institution[] = [
  {
    id: "inst_pilot",
    name: "Pilot Institution",
    sector: "Higher Ed",
    state: "VA",
    size: "Large",
    tier: "Tier 1",
    dataMode: "Mock",
    status: "Active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    notes: "Demo tenant for MVP walkthrough."
  },
  {
    id: "inst_k12",
    name: "K-12 District (Demo)",
    sector: "K-12",
    state: "MD",
    size: "Medium",
    tier: "Tier 2",
    dataMode: "CSV Import",
    status: "Paused",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    notes: "Paused pending connector approval."
  },
  {
    id: "inst_county",
    name: "County IT (Demo)",
    sector: "Municipal",
    state: "PA",
    size: "Medium",
    tier: "Tier 2",
    dataMode: "API Connectors",
    status: "Active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
  }
];

function makeId() {
  return `inst_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function InstitutionsPage() {
  const [items, setItems] = React.useState<Institution[]>(seedInstitutions);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? "");
  const selected = items.find((x) => x.id === selectedId) ?? items[0];

  const [q, setQ] = React.useState("");
  const [sector, setSector] = React.useState<Institution["sector"] | "All">("All");
  const [status, setStatus] = React.useState<Institution["status"] | "All">("All");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((x) => (sector === "All" ? true : x.sector === sector))
      .filter((x) => (status === "All" ? true : x.status === status))
      .filter((x) => {
        if (!query) return true;
        return (
          x.name.toLowerCase().includes(query) ||
          x.id.toLowerCase().includes(query) ||
          x.state.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items, q, sector, status]);

  React.useEffect(() => {
    if (filtered.length && !filtered.some((x) => x.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  // Create (modal-ish panel)
  const [creating, setCreating] = React.useState(false);
  const [newInst, setNewInst] = React.useState<Partial<Institution>>({
    name: "",
    sector: "Higher Ed",
    state: "VA",
    size: "Medium",
    tier: "Tier 2",
    dataMode: "Mock",
    status: "Active",
    notes: ""
  });

  function createInstitution() {
    if (!newInst.name?.trim()) return alert("Name is required (demo).");
    const inst: Institution = {
      id: makeId(),
      name: newInst.name!.trim(),
      sector: (newInst.sector as any) ?? "Other",
      state: (newInst.state as any) ?? "NA",
      size: (newInst.size as any) ?? "Medium",
      tier: (newInst.tier as any) ?? "Tier 2",
      dataMode: (newInst.dataMode as any) ?? "Mock",
      status: (newInst.status as any) ?? "Active",
      createdAt: new Date().toISOString(),
      notes: newInst.notes ?? ""
    };
    setItems((prev) => [inst, ...prev]);
    setSelectedId(inst.id);
    setCreating(false);
    alert("Demo: institution created (wire to backend later).");
  }

  function updateSelected(patch: Partial<Institution>) {
    if (!selected) return;
    setItems((prev) => prev.map((x) => (x.id === selected.id ? { ...x, ...patch } : x)));
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Institutions"
        subtitle="Manage pilot tenants, sectors, and configuration baselines. This is the top-level multi-institution control plane."
        right={pill("Admin", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name / id / state…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 320 }}
          />

          <select value={sector} onChange={(e) => setSector(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All sectors</option>
            <option value="Higher Ed">Higher Ed</option>
            <option value="K-12">K-12</option>
            <option value="Municipal">Municipal</option>
            <option value="Public Safety">Public Safety</option>
            <option value="Other">Other</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Archived">Archived</option>
          </select>

          <button
            onClick={() => setCreating(true)}
            style={{
              marginLeft: "auto",
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "#111827",
              color: "white",
              fontWeight: 900,
              cursor: "pointer"
            }}
          >
            + New Institution
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: 12, marginTop: 12 }}>
          {/* list */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Tenants</div>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {filtered.map((x) => {
                const active = x.id === selectedId;
                return (
                  <div
                    key={x.id}
                    onClick={() => setSelectedId(x.id)}
                    style={{
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 12,
                      background: active ? "#111827" : "white",
                      color: active ? "white" : "#111827"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 900 }}>{x.name}</div>
                      <div style={{ marginLeft: "auto" }}>
                        {active ? pill(x.status.toUpperCase(), "white", "rgba(255,255,255,0.12)") : statusPill(x.status)}
                      </div>
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      {x.sector} • {x.state} • {x.size} • {x.tier}
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Data Mode: {x.dataMode} • Created: {new Date(x.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      ID: <span style={{ fontFamily: "monospace" }}>{x.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* details */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            {creating ? (
              <>
                <div style={{ fontWeight: 900 }}>Create Institution (Demo)</div>
                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Name</span>
                    <input
                      value={newInst.name ?? ""}
                      onChange={(e) => setNewInst((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g., Lehigh University Pilot"
                      style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                    />
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Sector</span>
                      <select
                        value={newInst.sector as any}
                        onChange={(e) => setNewInst((p) => ({ ...p, sector: e.target.value as any }))}
                        style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                      >
                        <option value="Higher Ed">Higher Ed</option>
                        <option value="K-12">K-12</option>
                        <option value="Municipal">Municipal</option>
                        <option value="Public Safety">Public Safety</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>State</span>
                      <input
                        value={newInst.state ?? ""}
                        onChange={(e) => setNewInst((p) => ({ ...p, state: e.target.value.toUpperCase() }))}
                        placeholder="VA"
                        style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                      />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Size</span>
                      <select
                        value={newInst.size as any}
                        onChange={(e) => setNewInst((p) => ({ ...p, size: e.target.value as any }))}
                        style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                      >
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Criticality Tier</span>
                      <select
                        value={newInst.tier as any}
                        onChange={(e) => setNewInst((p) => ({ ...p, tier: e.target.value as any }))}
                        style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                      >
                        <option value="Tier 1">Tier 1</option>
                        <option value="Tier 2">Tier 2</option>
                        <option value="Tier 3">Tier 3</option>
                      </select>
                    </label>
                  </div>

                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Data Mode</span>
                    <select
                      value={newInst.dataMode as any}
                      onChange={(e) => setNewInst((p) => ({ ...p, dataMode: e.target.value as any }))}
                      style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                    >
                      <option value="Mock">Mock</option>
                      <option value="CSV Import">CSV Import</option>
                      <option value="API Connectors">API Connectors</option>
                    </select>
                  </label>

                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Notes</span>
                    <textarea
                      value={newInst.notes ?? ""}
                      onChange={(e) => setNewInst((p) => ({ ...p, notes: e.target.value }))}
                      rows={3}
                      placeholder="Optional notes (pilot scope, contacts, constraints)…"
                      style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", resize: "vertical" }}
                    />
                  </label>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={createInstitution}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Create (Demo)
                    </button>
                    <button
                      onClick={() => setCreating(false)}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : !selected ? (
              <div style={{ color: "#6b7280" }}>Select an institution.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{selected.name}</div>
                  <div style={{ marginLeft: "auto" }}>{statusPill(selected.status)}</div>
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                    <div style={{ fontWeight: 900 }}>Tenant Details</div>
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Sector</span>
                        <select
                          value={selected.sector}
                          onChange={(e) => updateSelected({ sector: e.target.value as any })}
                          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                        >
                          <option value="Higher Ed">Higher Ed</option>
                          <option value="K-12">K-12</option>
                          <option value="Municipal">Municipal</option>
                          <option value="Public Safety">Public Safety</option>
                          <option value="Other">Other</option>
                        </select>
                      </label>

                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>State</span>
                        <input
                          value={selected.state}
                          onChange={(e) => updateSelected({ state: e.target.value.toUpperCase() })}
                          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                        />
                      </label>

                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Size</span>
                        <select
                          value={selected.size}
                          onChange={(e) => updateSelected({ size: e.target.value as any })}
                          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                        >
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                        </select>
                      </label>

                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Tier</span>
                        <select
                          value={selected.tier}
                          onChange={(e) => updateSelected({ tier: e.target.value as any })}
                          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                        >
                          <option value="Tier 1">Tier 1</option>
                          <option value="Tier 2">Tier 2</option>
                          <option value="Tier 3">Tier 3</option>
                        </select>
                      </label>
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Data Mode</span>
                        <select
                          value={selected.dataMode}
                          onChange={(e) => updateSelected({ dataMode: e.target.value as any })}
                          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                        >
                          <option value="Mock">Mock</option>
                          <option value="CSV Import">CSV Import</option>
                          <option value="API Connectors">API Connectors</option>
                        </select>
                      </label>

                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Status</span>
                        <select
                          value={selected.status}
                          onChange={(e) => updateSelected({ status: e.target.value as any })}
                          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                        >
                          <option value="Active">Active</option>
                          <option value="Paused">Paused</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </label>
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Tenant ID</div>
                      <div style={{ marginTop: 6, fontFamily: "monospace", fontWeight: 900 }}>{selected.id}</div>
                    </div>

                    <label style={{ display: "grid", gap: 6, marginTop: 10 }}>
                      <span style={{ fontWeight: 900, fontSize: 12, color: "#6b7280" }}>Notes</span>
                      <textarea
                        value={selected.notes ?? ""}
                        onChange={(e) => updateSelected({ notes: e.target.value })}
                        rows={3}
                        style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", resize: "vertical" }}
                      />
                    </label>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                      <button
                        onClick={() => alert("Demo: saved institution settings (wire to backend later).")}
                        style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                      >
                        Save (Demo)
                      </button>
                      <button
                        onClick={() => alert("Demo: switch tenant context for dashboards (wire to context store later).")}
                        style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                      >
                        Use This Tenant (Demo)
                      </button>
                    </div>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                    <div style={{ fontWeight: 900 }}>Quick Actions (Demo)</div>
                    <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                      <button
                        onClick={() => alert("Demo: run scoring + generate roadmap now.")}
                        style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer", textAlign: "left" }}
                      >
                        Run Scoring + Roadmap (Now)
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>Recompute modernization + cyber posture and refresh executive KPIs.</div>
                      </button>
                      <button
                        onClick={() => alert("Demo: export tenant configuration bundle.")}
                        style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer", textAlign: "left" }}
                      >
                        Export Tenant Config
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>Export scoring weights, policies, and templates selected (future).</div>
                      </button>
                      <button
                        onClick={() => alert("Demo: archive tenant.")}
                        style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#fef2f2", color: "#dc2626", fontWeight: 900, cursor: "pointer", textAlign: "left" }}
                      >
                        Archive Tenant (Demo)
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>Soft-delete view; keeps audit trails (future).</div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
