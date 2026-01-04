import * as React from "react";

type Track =
  | "Zero Trust Fundamentals"
  | "Policy-as-Code"
  | "CI/CD Security"
  | "DevSecOps"
  | "Telemetry & SOC Ops"
  | "Modernization Roadmap";

type LabDifficulty = "Beginner" | "Intermediate" | "Advanced";

type ChecklistItem = { id: string; item: string; done: boolean };

type Lab = {
  id: string;
  title: string;
  track: Track;
  difficulty: LabDifficulty;
  timeMins: number;
  objectives: string[];
  prerequisites: string[];
  tiedFindings: string[];
  checklist: ChecklistItem[];
};

type EvidenceArtifact = {
  id: string;
  labId?: string;
  type: "Screenshot" | "Report Export" | "Curriculum Export" | "Completion Note";
  title: string;
  createdAt: string; // ISO
};

type Cohort = {
  id: string;
  name: string;
  members: number;
  assignedLabIds: string[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatDate(dtIso: string) {
  const d = new Date(dtIso);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function pill(text: string, fg: string, bg: string) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        fontWeight: 900,
        fontSize: 12,
        color: fg,
        background: bg,
        whiteSpace: "nowrap"
      }}
    >
      {text}
    </span>
  );
}

function difficultyPill(d: LabDifficulty) {
  if (d === "Advanced") return pill("ADVANCED", "#b91c1c", "#fef2f2");
  if (d === "Intermediate") return pill("INTERMEDIATE", "#92400e", "#fff7ed");
  return pill("BEGINNER", "#166534", "#f0fdf4");
}

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
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        background: "white",
        padding: 16,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02)"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 950, letterSpacing: -0.2 }}>{title}</div>
          {subtitle && (
            <div style={{ color: "#6b7280", marginTop: 6, lineHeight: 1.35 }}>{subtitle}</div>
          )}
        </div>
        {right}
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "white" }}>
      <div style={{ fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function calcCompletion(lab: Lab) {
  const total = lab.checklist.length || 1;
  const done = lab.checklist.filter((c) => c.done).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

const SEED_LABS: Lab[] = [
  {
    id: "l1",
    title: "Implement MFA for Privileged Accounts",
    track: "Zero Trust Fundamentals",
    difficulty: "Beginner",
    timeMins: 45,
    objectives: ["Identify privileged roles", "Enable MFA policy", "Export coverage report as evidence"],
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
    objectives: ["Generate CycloneDX SBOM", "Produce provenance attestation", "Fail pipeline if artifacts missing"],
    prerequisites: ["GitLab/GitHub pipeline access (demo)", "Build runner"],
    tiedFindings: ["Supply chain coverage gap", "EO 14028 SBOM control unmapped"],
    checklist: [
      { id: "c1", item: "Add SBOM job to pipeline template", done: false },
      { id: "c2", item: "Add provenance attestation step", done: false },
      { id: "c3", item: "Add policy gate to require artifacts for Tier-1 services", done: false }
    ]
  },
  {
    id: "l3",
    title: "Enforce Required Logging with Policy-as-Code",
    track: "Policy-as-Code",
    difficulty: "Intermediate",
    timeMins: 50,
    objectives: ["Select baseline policies", "Run in WARN mode", "Open remediation PR for top violation"],
    prerequisites: ["Policy engine enabled (demo)", "Workload with logs to validate"],
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
    objectives: ["Prioritize technical debt", "Assign owners", "Publish plan as executive report"],
    prerequisites: ["Modernization scorecard available"],
    tiedFindings: ["Legacy assets detected", "Standardization score below target"],
    checklist: [
      { id: "c1", item: "Select top 10 upgrade candidates", done: false },
      { id: "c2", item: "Assign owners and budgets (demo)", done: false },
      { id: "c3", item: "Publish plan as executive report", done: false }
    ]
  },
  {
    id: "l5",
    title: "SOC Triage Playbook: Detect & Escalate High-Risk Drift",
    track: "Telemetry & SOC Ops",
    difficulty: "Advanced",
    timeMins: 75,
    objectives: ["Review drift signal", "Classify severity", "Create incident + remediation workflow"],
    prerequisites: ["Drift detection enabled (demo)", "Alert routing channel configured"],
    tiedFindings: ["High-risk drift detected", "Baseline enforcement missing"],
    checklist: [
      { id: "c1", item: "Review drift diff and impacted services", done: false },
      { id: "c2", item: "Classify severity and escalate per runbook", done: false },
      { id: "c3", item: "Open remediation ticket and attach evidence snapshot", done: false }
    ]
  },

  // -------------------
  // DevSecOps Track
  // -------------------
  {
    id: "l6",
    title: "Secure GitOps Workflow (PR Checks + Approvals)",
    track: "DevSecOps",
    difficulty: "Beginner",
    timeMins: 50,
    objectives: [
      "Define protected branches + required approvals",
      "Enable required status checks",
      "Demonstrate an auditable merge process"
    ],
    prerequisites: ["Repo admin access (demo)", "Branch protection enabled"],
    tiedFindings: ["Change control gap", "Unreviewed merges observed"],
    checklist: [
      { id: "c1", item: "Enable protected branches for main/release", done: false },
      { id: "c2", item: "Require 1–2 approvals + CODEOWNERS", done: false },
      { id: "c3", item: "Turn on required checks (build + security)", done: false }
    ]
  },
  {
    id: "l7",
    title: "IaC Scanning: Prevent Insecure Terraform Changes",
    track: "DevSecOps",
    difficulty: "Intermediate",
    timeMins: 60,
    objectives: [
      "Add IaC scan job to pipeline",
      "Fail on critical misconfigurations",
      "Generate a reusable policy baseline"
    ],
    prerequisites: ["Terraform repo (demo)", "CI runner available"],
    tiedFindings: ["Misconfiguration risk", "Cloud controls unmapped"],
    checklist: [
      { id: "c1", item: "Add IaC scanning job to pipeline template", done: false },
      { id: "c2", item: "Fail pipeline on critical findings", done: false },
      { id: "c3", item: "Export baseline policy config for reuse", done: false }
    ]
  },
  {
    id: "l8",
    title: "Secrets Hygiene: Detect and Block Leaked Credentials",
    track: "DevSecOps",
    difficulty: "Intermediate",
    timeMins: 45,
    objectives: [
      "Enable secret scanning",
      "Block commits that contain secrets",
      "Create incident-ready evidence output"
    ],
    prerequisites: ["Repo access (demo)", "Example secret patterns"],
    tiedFindings: ["Secrets exposure risk", "Credential handling weaknesses"],
    checklist: [
      { id: "c1", item: "Enable secret scanning on repo", done: false },
      { id: "c2", item: "Add pre-receive/CI gate to block leaks", done: false },
      { id: "c3", item: "Export detection log as evidence artifact", done: false }
    ]
  },
  {
    id: "l9",
    title: "SLSA-lite: Build Integrity with Signed Artifacts",
    track: "DevSecOps",
    difficulty: "Advanced",
    timeMins: 75,
    objectives: ["Sign build artifacts", "Attach provenance", "Verify signature before deploy"],
    prerequisites: ["CI pipeline access (demo)", "Artifact registry (demo)"],
    tiedFindings: ["Supply chain integrity gap", "Artifact trust not enforced"],
    checklist: [
      { id: "c1", item: "Add signing step to build job", done: false },
      { id: "c2", item: "Publish provenance alongside artifact", done: false },
      { id: "c3", item: "Verify signature in deploy gate", done: false }
    ]
  }
];

export default function WorkforceTrainingLabsPage() {
  const [labs, setLabs] = React.useState<Lab[]>(SEED_LABS);

  const [track, setTrack] = React.useState<Track | "All">("All");
  const [difficulty, setDifficulty] = React.useState<LabDifficulty | "All">("All");
  const [q, setQ] = React.useState("");

  const [selectedId, setSelectedId] = React.useState<string>(SEED_LABS[0]?.id ?? "");

  const [artifacts, setArtifacts] = React.useState<EvidenceArtifact[]>([
    {
      id: "a1",
      labId: "l1",
      type: "Report Export",
      title: "MFA Coverage Report (Demo Export)",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    }
  ]);

  const [cohorts, setCohorts] = React.useState<Cohort[]>([
    { id: "co1", name: "Campus IT — Winter Cohort", members: 18, assignedLabIds: ["l1", "l4", "l6"] }
  ]);

  const [showCohort, setShowCohort] = React.useState(false);
  const [newCohortName, setNewCohortName] = React.useState("");
  const [newCohortMembers, setNewCohortMembers] = React.useState(12);

  const filteredLabs = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return labs
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
  }, [labs, track, difficulty, q]);

  const selected = React.useMemo(() => {
    return filteredLabs.find((l) => l.id === selectedId) ?? filteredLabs[0];
  }, [filteredLabs, selectedId]);

  React.useEffect(() => {
    if (filteredLabs.length && !filteredLabs.some((x) => x.id === selectedId)) {
      setSelectedId(filteredLabs[0].id);
    }
  }, [filteredLabs, selectedId]);

  const overall = React.useMemo(() => {
    const totals = filteredLabs.reduce(
      (acc, l) => {
        const c = calcCompletion(l);
        acc.done += c.done;
        acc.total += c.total;
        acc.mins += l.timeMins;
        return acc;
      },
      { done: 0, total: 0, mins: 0 }
    );
    const pct = totals.total ? Math.round((totals.done / totals.total) * 100) : 0;
    return { ...totals, pct };
  }, [filteredLabs]);

  function toggleChecklist(labId: string, itemId: string, done: boolean) {
    setLabs((prev) =>
      prev.map((l) => {
        if (l.id !== labId) return l;
        return {
          ...l,
          checklist: l.checklist.map((c) => (c.id === itemId ? { ...c, done } : c))
        };
      })
    );
  }

  function addArtifact(partial: Omit<EvidenceArtifact, "id" | "createdAt">) {
    setArtifacts((prev) => [
      {
        id: `a_${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        ...partial
      },
      ...prev
    ]);
  }

  function exportCurriculumOutline() {
    addArtifact({
      type: "Curriculum Export",
      title: "Workforce Training Curriculum Outline (Demo)"
    });
    alert("Demo: Curriculum outline exported and added to Evidence Pack.");
  }

  function attachScreenshotForSelectedLab() {
    if (!selected) return;
    addArtifact({
      labId: selected.id,
      type: "Screenshot",
      title: `Screenshot — ${selected.title} (Demo)`
    });
    alert("Demo: Screenshot added to Evidence Pack.");
  }

  function addCompletionNoteForSelectedLab() {
    if (!selected) return;
    addArtifact({
      labId: selected.id,
      type: "Completion Note",
      title: `Completion note — ${selected.title} (Demo)`
    });
    alert("Demo: Completion note added to Evidence Pack.");
  }

  function createCohort() {
    const name = newCohortName.trim();
    if (!name) {
      alert("Please provide a cohort name.");
      return;
    }
    setCohorts((prev) => [
      {
        id: `co_${Math.random().toString(16).slice(2)}`,
        name,
        members: clamp(newCohortMembers, 1, 500),
        assignedLabIds: selected ? [selected.id] : []
      },
      ...prev
    ]);
    setNewCohortName("");
    setNewCohortMembers(12);
    setShowCohort(false);
    alert("Demo: Cohort created and assigned the selected lab.");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Workforce Training & Labs"
        subtitle="Built-in training modules (Zero Trust, DevSecOps, CI/CD security, policy-as-code) that translate findings into guided remediation — designed to be transferable across public institutions."
        right={pill("Dissemination channel", "#1d4ed8", "#eff6ff")}
      >
        {/* Controls */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value as any)}
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
          >
            <option value="All">All tracks</option>
            <option value="Zero Trust Fundamentals">Zero Trust Fundamentals</option>
            <option value="DevSecOps">DevSecOps</option>
            <option value="Policy-as-Code">Policy-as-Code</option>
            <option value="CI/CD Security">CI/CD Security</option>
            <option value="Telemetry & SOC Ops">Telemetry & SOC Ops</option>
            <option value="Modernization Roadmap">Modernization Roadmap</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
          >
            <option value="All">All difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search labs (MFA, SBOM, Terraform, secrets)…"
            style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 360 }}
          />

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {pill(`Completion: ${overall.pct}%`, "#111827", "#f9fafb")}
            {pill(`Checklist: ${overall.done}/${overall.total}`, "#111827", "#f9fafb")}
            <button
              onClick={exportCurriculumOutline}
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "white",
                fontWeight: 950,
                cursor: "pointer"
              }}
            >
              Export Curriculum Outline
            </button>
            <button
              onClick={() => setShowCohort(true)}
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "#111827",
                color: "white",
                fontWeight: 950,
                cursor: "pointer"
              }}
            >
              Create Cohort
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1.25fr", gap: 12, marginTop: 12 }}>
          {/* Left: Library */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 950 }}>Lab Library</div>
              <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: 12 }}>{filteredLabs.length} labs</div>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {filteredLabs.map((l) => {
                const active = l.id === selectedId;
                const c = calcCompletion(l);
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
                      <div style={{ fontWeight: 950 }}>{l.title}</div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                        {active
                          ? pill(`${c.pct}%`, "white", "rgba(255,255,255,0.12)")
                          : pill(`${c.pct}%`, "#111827", "#f9fafb")}
                        {active
                          ? pill(l.difficulty, "white", "rgba(255,255,255,0.12)")
                          : difficultyPill(l.difficulty)}
                      </div>
                    </div>

                    <div style={{ marginTop: 6, color: active ? "#d1d5db" : "#6b7280", fontSize: 12 }}>
                      Track: {l.track} • Time: {l.timeMins} mins • Checklist: {c.done}/{c.total}
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

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12, lineHeight: 1.35 }}>
              <b>USCIS-ready angle:</b> This page formalizes a repeatable training mechanism tied to platform findings, so
              other institutions can learn and apply the remediation methods independently.
            </div>
          </div>

          {/* Right: Details + Evidence Pack */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
            {!selected ? (
              <div style={{ color: "#6b7280" }}>Select a lab.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontWeight: 950, fontSize: 16 }}>{selected.title}</div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {pill(selected.track, "#1d4ed8", "#eff6ff")}
                    {difficultyPill(selected.difficulty)}
                    {pill(`${selected.timeMins} mins`, "#111827", "white")}
                    {pill(`Completion: ${calcCompletion(selected).pct}%`, "#111827", "white")}
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                  <Section title="Objectives">
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {selected.objectives.map((o, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Prerequisites">
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {selected.prerequisites.map((p, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Checklist (Guided Remediation)">
                    <div style={{ display: "grid", gap: 8 }}>
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
                            onChange={(e) => toggleChecklist(selected.id, c.id, e.target.checked)}
                          />
                          <span style={{ fontWeight: 900 }}>{c.item}</span>
                        </label>
                      ))}
                    </div>

                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        onClick={attachScreenshotForSelectedLab}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 14,
                          border: "1px solid #e5e7eb",
                          background: "white",
                          fontWeight: 950,
                          cursor: "pointer"
                        }}
                      >
                        Attach Screenshot (Demo)
                      </button>
                      <button
                        onClick={addCompletionNoteForSelectedLab}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 14,
                          border: "1px solid #e5e7eb",
                          background: "#111827",
                          color: "white",
                          fontWeight: 950,
                          cursor: "pointer"
                        }}
                      >
                        Add Completion Note (Demo)
                      </button>
                    </div>
                  </Section>

                  <Section title="Evidence Pack (Dissemination Artifacts)">
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      {pill(`${artifacts.length} artifacts`, "#111827", "#f9fafb")}
                      {pill("Exportable for RFE", "#166534", "#f0fdf4")}
                      <button
                        onClick={() => {
                          addArtifact({
                            type: "Report Export",
                            labId: selected.id,
                            title: "Exported Lab Report (Demo)"
                          });
                          alert("Demo: Lab report exported and added to Evidence Pack.");
                        }}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 14,
                          border: "1px solid #e5e7eb",
                          background: "white",
                          fontWeight: 950,
                          cursor: "pointer"
                        }}
                      >
                        Export Lab Report (Demo)
                      </button>
                      <button
                        onClick={() => alert("Demo: Evidence Pack PDF generation (wire later).")}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 14,
                          border: "1px solid #e5e7eb",
                          background: "#111827",
                          color: "white",
                          fontWeight: 950,
                          cursor: "pointer"
                        }}
                      >
                        Generate Evidence Pack (PDF Later)
                      </button>
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                      {artifacts.slice(0, 8).map((a) => (
                        <div
                          key={a.id}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            padding: 10,
                            borderRadius: 14,
                            border: "1px solid #e5e7eb",
                            background: "#fafafa"
                          }}
                        >
                          {pill(a.type, "#111827", "white")}
                          <div style={{ fontWeight: 950 }}>{a.title}</div>
                          <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: 12 }}>
                            {formatDate(a.createdAt)}
                          </div>
                        </div>
                      ))}
                      {artifacts.length > 8 && (
                        <div style={{ color: "#6b7280", fontSize: 12 }}>
                          Showing 8 of {artifacts.length} artifacts.
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12, lineHeight: 1.35 }}>
                      Tip: screenshot this Evidence Pack panel + the Lab Library list. Those two screenshots alone are
                      strong “tangible training mechanism” proof.
                    </div>
                  </Section>

                  <Section title="Cohorts (Internal + Partner Training)">
                    <div style={{ display: "grid", gap: 8 }}>
                      {cohorts.map((co) => (
                        <div
                          key={co.id}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            padding: 10,
                            borderRadius: 14,
                            border: "1px solid #e5e7eb",
                            background: "#fafafa"
                          }}
                        >
                          <div style={{ fontWeight: 950 }}>{co.name}</div>
                          {pill(`${co.members} members`, "#111827", "white")}
                          <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: 12 }}>
                            Assigned labs: {co.assignedLabIds.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Cohort Modal */}
      {showCohort && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            padding: 16
          }}
          onClick={() => setShowCohort(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(760px, 100%)",
              background: "white",
              borderRadius: 18,
              border: "1px solid #e5e7eb",
              padding: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 950, fontSize: 16 }}>Create Cohort</div>
              <div style={{ marginLeft: "auto" }}>
                <button
                  onClick={() => setShowCohort(false)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    cursor: "pointer",
                    fontWeight: 950
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 950 }}>Cohort Name</div>
                <input
                  value={newCohortName}
                  onChange={(e) => setNewCohortName(e.target.value)}
                  placeholder="e.g., Partner University Pilot Cohort"
                  style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                />
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 950 }}>Members</div>
                <input
                  type="number"
                  value={newCohortMembers}
                  onChange={(e) => setNewCohortMembers(parseInt(e.target.value || "12", 10))}
                  style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", width: 180 }}
                />
              </div>

              <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.35 }}>
                Demo behavior: the cohort is created and assigned the currently selected lab. This helps show a training
                delivery mechanism for internal staff <i>and</i> potential partner institutions.
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowCohort(false)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    fontWeight: 950,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={createCohort}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: "1px solid #e5e7eb",
                    background: "#111827",
                    color: "white",
                    fontWeight: 950,
                    cursor: "pointer"
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
