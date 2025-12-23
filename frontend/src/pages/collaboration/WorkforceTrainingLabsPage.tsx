import * as React from "react";

type Track = "Zero Trust Fundamentals" | "Policy-as-Code" | "CI/CD Security" | "Telemetry & SOC Ops" | "Modernization Roadmap";

type LabDifficulty = "Beginner" | "Intermediate" | "Advanced";

type Lab = {
  id: string;
  title: string;
  track: Track;
  difficulty: LabDifficulty;
  timeMins: number;
  objectives: string[];
  prerequisites: string[];
  tiedFindings: string[]; // platform findings that recommend this lab
  checklist: Array<{ id: string; item: string; done: boolean }>;
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
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, color: fg, background: bg }}>
      {text}
    </span>
  );
}

function difficultyPill(d: LabDifficulty) {
  if (d === "Advanced") return pill("ADVANCED", "#dc2626", "#fef2f2");
  if (d === "Intermediate") return pill("INTERMEDIATE", "#b45309", "#fff7ed");
  return pill("BEGINNER", "#16a34a", "#f0fdf4");
}

const seedLabs: Lab[] = [
  {
    id: "l1",
    title: "Implement MFA for Privileged Accounts",
    track: "Zero Trust Fundamentals",
    difficulty: "Beginner",
    timeMins: 45,
    objectives: ["Identify privileged roles", "Enable MFA policy", "Validate coverage report export"],
    prerequisites: ["Admin access to IdP (demo)", "List of privileged groups"],
    tiedFindings: ["Identity: MFA coverage gap", "Zero Trust readiness below target"],
    checklist: [
      { id: "c1", item: "Identify privileged groups and break-glass accounts", done: true },
      { id: "c2", item: "Enable MFA policy for privileged access", done: false },
      { id: "c3", item: "Export coverage report as evidence artifact", done: false }
    ]
  },
  {
    id: "l2",
    title: "Add SBOM + Provenance to CI/CD",
    track: "CI/CD Security",
    difficulty: "Intermediate",
    timeMins: 60,
    objectives: ["Generate CycloneDX SBOM", "Produce provenance attestation", "Fail pipeline if missing artifacts"],
    prerequisites: ["GitLab/GitHub pipeline access (demo)", "Build runner"],
    tiedFindings: ["Supply chain coverage gap", "EO 14028 SBOM control unmapped"],
    checklist: [
      { id: "c1", item: "Add SBOM job to pipeline template", done: false },
      { id: "c2", item: "Add provenance attestation step", done: false },
      { id: "c3", item: "Add policy gate to require artifacts for Tier-1", done: false }
    ]
  },
  {
    id: "l3",
    title: "Enforce Required Logging with Policy-as-Code",
    track: "Policy-as-Code",
    difficulty: "Intermediate",
    timeMins: 50,
    objectives: ["Select baseline policies", "Set mode to WARN", "Review violations + remediation guidance"],
    prerequisites: ["Cluster policy engine enabled (demo)"],
    tiedFindings: ["Telemetry readiness below target", "Policy violations observed"],
    checklist: [
      { id: "c1", item: "Apply required-logging policy bundle", done: true },
      { id: "c2", item: "Switch enforcement: OBSERVE → WARN", done: false },
      { id: "c3", item: "Create remediation PR for the top violation", done: false }
    ]
  },
  {
    id: "l4",
    title: "Build a 30/60/90-Day Modernization Plan",
    track: "Modernization Roadmap",
    difficulty: "Beginner",
    timeMins: 40,
    objectives: ["Prioritize technical debt", "Assign owners", "Define milestones and metrics"],
    prerequisites: ["Modernization scorecard available"],
    tiedFindings: ["Legacy assets detected", "Standardization score below target"],
    checklist: [
      { id: "c1", item: "Select top 10 upgrade candidates", done: false },
      { id: "c2", item: "Assign owners and budgets (demo)", done: false },
      { id: "c3", item: "Publish plan as executive report", done: false }
    ]
  }
];

export default function WorkforceTrainingLabsPage() {
  const [track, setTrack] = React.useState<Track | "All">("All");
  const [difficulty, setDifficulty] = React.useState<LabDifficulty | "All">("All");
  const [q, setQ] = React.useState("");

  const labs = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return seedLabs
      .filter((l) => (track === "All" ? true : l.track === track))
      .filter((l) => (difficulty === "All" ? true : l.difficulty === difficulty))
      .filter((l) => {
        if (!query) return true;
        return (
          l.title.toLowerCase().includes(query) ||
          l.track.toLowerCase().includes(query) ||
          l.tiedFindings.join(" ").toLowerCase().includes(query)
        );
      });
  }, [track, difficulty, q]);

  const [selectedId, setSelectedId] = React.useState(labs[0]?.id ?? "");
  const selected = labs.find((l) => l.id === selectedId) ?? labs[0];

  React.useEffect(() => {
    if (labs.length && !labs.some((x) => x.id === selectedId)) setSelectedId(labs[0].id);
  }, [labs, selectedId]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Workforce Training & Labs"
        subtitle="Built-in training modules that turn findings into guided remediation tasks (closing the public-sector talent gap)."
        right={pill("Guided remediation", "#2563eb", "#eff6ff")}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select value={track} onChange={(e) => setTrack(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All tracks</option>
            <option value="Zero Trust Fundamentals">Zero Trust Fundamentals</option>
            <option value="Policy-as-Code">Policy-as-Code</option>
            <option value="CI/CD Security">CI/CD Security</option>
            <option value="Telemetry & SOC Ops">Telemetry & SOC Ops</option>
            <option value="Modernization Roadmap">Modernization Roadmap</option>
          </select>

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <option value="All">All difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search labs (MFA, SBOM, logging)…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 340 }}
          />

          <button
            onClick={() => alert("Demo: assign labs to a team cohort (coming next).")}
            style={{ marginLeft: "auto", padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
          >
            Create Cohort (Demo)
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          {/* list */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Lab Library</div>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {labs.map((l) => {
                const active = l.id === selectedId;
                return (
                  <div
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    style={{
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 12,
                      background: active ? "#111827" : "white",
                      color: active ? "white" : "#111827"
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ fontWeight: 900 }}>{l.title}</div>
                      <div style={{ marginLeft: "auto" }}>
                        {active ? pill(l.difficulty, "white", "rgba(255,255,255,0.12)") : difficultyPill(l.difficulty)}
                      </div>
                    </div>
                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Track: {l.track} • Time: {l.timeMins} mins
                    </div>
                    <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {l.tiedFindings.slice(0, 2).map((f) =>
                        active ? pill(f, "white", "rgba(255,255,255,0.12)") : pill(f, "#111827", "#f9fafb")
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Demo value: ties platform findings to workforce upskilling — a direct national importance angle.
            </div>
          </div>

          {/* detail */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            {!selected ? (
              <div style={{ color: "#6b7280" }}>Select a lab.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{selected.title}</div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {pill(selected.track, "#2563eb", "#eff6ff")}
                    {difficultyPill(selected.difficulty)}
                    {pill(`${selected.timeMins} mins`, "#111827", "white")}
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                    <div style={{ fontWeight: 900 }}>Objectives</div>
                    <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                      {selected.objectives.map((o, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                    <div style={{ fontWeight: 900 }}>Prerequisites</div>
                    <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                      {selected.prerequisites.map((p, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
                    <div style={{ fontWeight: 900 }}>Checklist (Demo)</div>
                    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                      {selected.checklist.map((c) => (
                        <label
                          key={c.id}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            padding: 10,
                            borderRadius: 14,
                            border: "1px solid #e5e7eb",
                            background: "#fafafa",
                            cursor: "pointer"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={c.done}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const idx = seedLabs.findIndex((x) => x.id === selected.id);
                              // Frontend-only: local mutate by creating an updated copy
                              const updated = seedLabs[idx];
                              updated.checklist = updated.checklist.map((x) => (x.id === c.id ? { ...x, done: checked } : x));
                              alert("Demo: checklist state updated (wire to backend later).");
                            }}
                          />
                          <span style={{ fontWeight: 900 }}>{c.item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => alert("Demo: start lab and generate task tickets (coming next).")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Start Lab (Demo)
                    </button>
                    <button
                      onClick={() => alert("Demo: attach completion as evidence artifact (coming next).")}
                      style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Attach to Evidence Pack (Demo)
                    </button>
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
