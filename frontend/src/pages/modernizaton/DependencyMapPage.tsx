import * as React from "react";

type NodeKind = "app" | "server" | "network" | "identity" | "logging" | "db" | "unknown";
type Criticality = "low" | "medium" | "high";

type GraphNode = {
  id: string;
  name: string;
  kind: NodeKind;
  owner?: string;
  criticality: Criticality;
};

type GraphEdge = {
  from: string;
  to: string;
  relationship: "depends_on" | "authenticates_via" | "logs_to" | "routes_through" | "stores_in";
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        fontSize: 12,
        fontWeight: 800,
        color: "#111827",
        background: "#fff"
      }}
    >
      {children}
    </span>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
          {subtitle && <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function badgeColor(kind: NodeKind) {
  switch (kind) {
    case "app":
      return "#111827";
    case "server":
      return "#1f2937";
    case "network":
      return "#374151";
    case "identity":
      return "#4b5563";
    case "logging":
      return "#6b7280";
    case "db":
      return "#111827";
    default:
      return "#9ca3af";
  }
}

function critLabel(c: Criticality) {
  if (c === "high") return "High";
  if (c === "medium") return "Medium";
  return "Low";
}

function relationshipLabel(r: GraphEdge["relationship"]) {
  switch (r) {
    case "depends_on":
      return "depends on";
    case "authenticates_via":
      return "authenticates via";
    case "logs_to":
      return "logs to";
    case "routes_through":
      return "routes through";
    case "stores_in":
      return "stores in";
    default:
      return r;
  }
}

const mockNodes: GraphNode[] = [
  { id: "app-portal", name: "Unified Portal (App)", kind: "app", owner: "IT Services", criticality: "high" },
  { id: "srv-api", name: "API Server Cluster", kind: "server", owner: "Platform Team", criticality: "high" },
  { id: "db-pg", name: "Postgres (Shared)", kind: "db", owner: "DBA Team", criticality: "high" },
  { id: "net-core", name: "Core Network Segment", kind: "network", owner: "NetOps", criticality: "high" },
  { id: "idp-sso", name: "SSO / IdP", kind: "identity", owner: "IAM", criticality: "high" },
  { id: "log-siem", name: "SIEM / Log Pipeline", kind: "logging", owner: "SecOps", criticality: "medium" },
  { id: "srv-legacy", name: "Legacy Windows Server 2012", kind: "server", owner: "Facilities IT", criticality: "medium" }
];

const mockEdges: GraphEdge[] = [
  { from: "app-portal", to: "srv-api", relationship: "depends_on" },
  { from: "srv-api", to: "db-pg", relationship: "stores_in" },
  { from: "app-portal", to: "idp-sso", relationship: "authenticates_via" },
  { from: "srv-api", to: "log-siem", relationship: "logs_to" },
  { from: "srv-api", to: "net-core", relationship: "routes_through" },
  { from: "srv-legacy", to: "net-core", relationship: "routes_through" }
];

function computeBlastRadius(nodeId: string) {
  // Simple downstream traversal from nodeId over edges where from==nodeId.
  // For demo: treat "to" nodes as impacted.
  const impacted = new Set<string>();
  const queue = [nodeId];

  while (queue.length) {
    const cur = queue.shift()!;
    for (const e of mockEdges) {
      if (e.from === cur && !impacted.has(e.to)) {
        impacted.add(e.to);
        queue.push(e.to);
      }
    }
  }
  impacted.delete(nodeId);
  return Array.from(impacted);
}

export default function DependencyMapPage() {
  const [query, setQuery] = React.useState("");
  const [kind, setKind] = React.useState<NodeKind | "all">("all");
  const [selected, setSelected] = React.useState<string>("app-portal");

  const nodes = React.useMemo(() => {
    return mockNodes.filter((n) => {
      const matchesQ =
        !query.trim() ||
        n.name.toLowerCase().includes(query.toLowerCase()) ||
        n.id.toLowerCase().includes(query.toLowerCase());
      const matchesKind = kind === "all" ? true : n.kind === kind;
      return matchesQ && matchesKind;
    });
  }, [query, kind]);

  const selectedNode = mockNodes.find((n) => n.id === selected) ?? mockNodes[0];
  const blastIds = computeBlastRadius(selectedNode.id);
  const blastNodes = blastIds.map((id) => mockNodes.find((n) => n.id === id)).filter(Boolean) as GraphNode[];

  const edgesForSelected = mockEdges.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id);

  const singlePointsOfFailure = React.useMemo(() => {
    // Node is SPOF if many things depend on it (in-degree >= 2) and criticality high
    const inDegree: Record<string, number> = {};
    for (const e of mockEdges) inDegree[e.to] = (inDegree[e.to] ?? 0) + 1;
    return mockNodes
      .filter((n) => (inDegree[n.id] ?? 0) >= 2 && n.criticality === "high")
      .map((n) => ({ node: n, inDegree: inDegree[n.id] ?? 0 }));
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Dependency Map"
        subtitle="Relationship view (app → server → network → identity → logging). Use this to understand blast radius and single points of failure."
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes (name or id)"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 320 }}
          />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as any)}
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
          >
            <option value="all">All types</option>
            <option value="app">App</option>
            <option value="server">Server</option>
            <option value="db">Database</option>
            <option value="network">Network</option>
            <option value="identity">Identity</option>
            <option value="logging">Logging</option>
            <option value="unknown">Unknown</option>
          </select>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <Pill>Demo Mode</Pill>
            <Pill>Graph-lite</Pill>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12, marginTop: 14 }}>
          {/* Left: nodes list */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Nodes</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {nodes.map((n) => {
                const isSel = n.id === selectedNode.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelected(n.id)}
                    style={{
                      textAlign: "left",
                      cursor: "pointer",
                      padding: 10,
                      borderRadius: 14,
                      border: "1px solid #e5e7eb",
                      background: isSel ? "#111827" : "white",
                      color: isSel ? "white" : "#111827"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <div style={{ fontWeight: 900 }}>{n.name}</div>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 900,
                          background: isSel ? "rgba(255,255,255,0.15)" : "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          color: isSel ? "white" : badgeColor(n.kind)
                        }}
                      >
                        {n.kind.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap", color: isSel ? "#e5e7eb" : "#6b7280" }}>
                      <span>ID: {n.id}</span>
                      <span>•</span>
                      <span>Owner: {n.owner ?? "—"}</span>
                      <span>•</span>
                      <span>Criticality: {critLabel(n.criticality)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: details */}
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <div>
                  <div style={{ fontWeight: 900 }}>{selectedNode.name}</div>
                  <div style={{ color: "#6b7280", marginTop: 6 }}>
                    Type: <b>{selectedNode.kind}</b> • Owner: <b>{selectedNode.owner ?? "—"}</b>
                  </div>
                </div>
                <Pill>Criticality: {critLabel(selectedNode.criticality)}</Pill>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Direct Relationships</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {edgesForSelected.length === 0 ? (
                    <div style={{ color: "#6b7280" }}>No relationships found.</div>
                  ) : (
                    edgesForSelected.map((e, idx) => {
                      const from = mockNodes.find((n) => n.id === e.from);
                      const to = mockNodes.find((n) => n.id === e.to);
                      return (
                        <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 10 }}>
                          <div style={{ fontWeight: 800 }}>
                            {from?.name ?? e.from} <span style={{ color: "#6b7280" }}>{relationshipLabel(e.relationship)}</span>{" "}
                            {to?.name ?? e.to}
                          </div>
                          <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>
                            {e.from} → {e.to}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
              <div style={{ fontWeight: 900 }}>Blast Radius (if this fails)</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>
                Downstream components impacted by <b>{selectedNode.name}</b>.
              </div>

              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {blastNodes.length === 0 ? (
                  <div style={{ color: "#6b7280" }}>No downstream impact detected in demo graph.</div>
                ) : (
                  blastNodes.map((n) => <Pill key={n.id}>{n.name}</Pill>)
                )}
              </div>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
              <div style={{ fontWeight: 900 }}>Single Points of Failure (demo heuristic)</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>High-critical nodes with multiple dependencies.</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {singlePointsOfFailure.length === 0 ? (
                  <div style={{ color: "#6b7280" }}>No SPOFs flagged.</div>
                ) : (
                  singlePointsOfFailure.map((x) => (
                    <div key={x.node.id} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 10 }}>
                      <div style={{ fontWeight: 900 }}>{x.node.name}</div>
                      <div style={{ color: "#6b7280", marginTop: 6, fontSize: 12 }}>
                        In-degree (dependents): <b>{x.inDegree}</b> • Owner: <b>{x.node.owner ?? "—"}</b>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
