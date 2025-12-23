import * as React from "react";

type WizardState = {
  serviceName: string;
  serviceType: "web" | "api" | "job" | "data";
  environment: "dev" | "pilot" | "prod";
  owner: string;
  dataSensitivity: "public" | "internal" | "restricted";
  auth: "none" | "oidc" | "sso_rbac";
  logging: "basic" | "siem_forwarding";
  secrets: "env" | "vault";
  network: "open" | "segmented";
};

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      {subtitle && <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>}
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 900 }}>{label}</div>
      {children}
    </label>
  );
}

function Guardrail({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", borderRadius: 14, border: "1px solid #e5e7eb", background: ok ? "#f0fdf4" : "#fff7ed" }}>
      <div style={{ fontWeight: 900 }}>{ok ? "✅" : "⚠️"}</div>
      <div>
        <div style={{ fontWeight: 900 }}>{text}</div>
        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
          {ok ? "Meets baseline." : "Would require exception or additional controls."}
        </div>
      </div>
    </div>
  );
}

export default function SecureProvisioningPage() {
  const [s, setS] = React.useState<WizardState>({
    serviceName: "new-service",
    serviceType: "api",
    environment: "pilot",
    owner: "Platform Team",
    dataSensitivity: "internal",
    auth: "sso_rbac",
    logging: "siem_forwarding",
    secrets: "vault",
    network: "segmented"
  });

  // Demo guardrails
  const guardrails = React.useMemo(() => {
    const mustAuth = s.dataSensitivity !== "public";
    const authOk = !mustAuth || s.auth !== "none";
    const loggingOk = s.environment !== "prod" ? true : s.logging === "siem_forwarding";
    const secretsOk = s.environment !== "prod" ? true : s.secrets === "vault";
    const netOk = s.environment !== "prod" ? true : s.network === "segmented";

    return [
      { ok: authOk, text: "Authentication required for non-public data" },
      { ok: loggingOk, text: "SIEM forwarding required in prod" },
      { ok: secretsOk, text: "Secrets must use Vault pattern in prod" },
      { ok: netOk, text: "Prod workloads must be segmented (no open exposure)" }
    ];
  }, [s]);

  const allOk = guardrails.every((g) => g.ok);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        title="Secure Provisioning"
        subtitle="A service wizard that applies guardrails by default: RBAC/auth, logging, secrets, and network segmentation. Output can become IaC + CI/CD + policy bundles."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Service Definition</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>Choose common public-sector defaults.</div>

            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <Field label="Service name">
                <input
                  value={s.serviceName}
                  onChange={(e) => setS((p) => ({ ...p, serviceName: e.target.value }))}
                  style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Service type">
                  <select
                    value={s.serviceType}
                    onChange={(e) => setS((p) => ({ ...p, serviceType: e.target.value as any }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="web">Web</option>
                    <option value="api">API</option>
                    <option value="job">Job/Worker</option>
                    <option value="data">Data Service</option>
                  </select>
                </Field>

                <Field label="Environment">
                  <select
                    value={s.environment}
                    onChange={(e) => setS((p) => ({ ...p, environment: e.target.value as any }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="dev">dev</option>
                    <option value="pilot">pilot</option>
                    <option value="prod">prod</option>
                  </select>
                </Field>
              </div>

              <Field label="Owner">
                <input
                  value={s.owner}
                  onChange={(e) => setS((p) => ({ ...p, owner: e.target.value }))}
                  style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Data sensitivity">
                  <select
                    value={s.dataSensitivity}
                    onChange={(e) => setS((p) => ({ ...p, dataSensitivity: e.target.value as any }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </Field>

                <Field label="Auth baseline">
                  <select
                    value={s.auth}
                    onChange={(e) => setS((p) => ({ ...p, auth: e.target.value as any }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="none">None</option>
                    <option value="oidc">OIDC</option>
                    <option value="sso_rbac">SSO + RBAC</option>
                  </select>
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Logging">
                  <select
                    value={s.logging}
                    onChange={(e) => setS((p) => ({ ...p, logging: e.target.value as any }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="basic">Basic</option>
                    <option value="siem_forwarding">SIEM forwarding</option>
                  </select>
                </Field>

                <Field label="Secrets pattern">
                  <select
                    value={s.secrets}
                    onChange={(e) => setS((p) => ({ ...p, secrets: e.target.value as any }))}
                    style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                  >
                    <option value="env">Env vars</option>
                    <option value="vault">Vault</option>
                  </select>
                </Field>
              </div>

              <Field label="Network exposure">
                <select
                  value={s.network}
                  onChange={(e) => setS((p) => ({ ...p, network: e.target.value as any }))}
                  style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
                >
                  <option value="open">Open</option>
                  <option value="segmented">Segmented</option>
                </select>
              </Field>
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Guardrails Preview</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>Instant feedback on policy/security baseline for the chosen settings.</div>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {guardrails.map((g) => (
                <Guardrail key={g.text} ok={g.ok} text={g.text} />
              ))}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontWeight: 900 }}>
                Ready to generate bundle:{" "}
                <span style={{ color: allOk ? "#16a34a" : "#d97706" }}>{allOk ? "YES" : "NEEDS EXCEPTION"}</span>
              </span>

              <button
                disabled={!allOk}
                style={{
                  marginLeft: "auto",
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  background: allOk ? "#111827" : "#e5e7eb",
                  color: allOk ? "white" : "#6b7280",
                  fontWeight: 900,
                  cursor: allOk ? "pointer" : "not-allowed"
                }}
                onClick={() => alert("Demo: export bundle -> IaC module + CI/CD pipeline + policy pack + README")}
              >
                Generate Bundle (Demo)
              </button>

              <button
                style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
                onClick={() => alert("Demo: create exception request + approver + expiration (coming next).")}
              >
                Request Exception (Demo)
              </button>
            </div>

            <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 16, padding: 12, background: "#fafafa" }}>
              <div style={{ fontWeight: 900 }}>Bundle contents (preview)</div>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>IaC: Terraform module + variables</li>
                <li>CI/CD: pipeline YAML with scans + policy gates</li>
                <li>Policies: enforcement pack for this service type</li>
                <li>Ops: logging/alerts baseline and runbook stub</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
