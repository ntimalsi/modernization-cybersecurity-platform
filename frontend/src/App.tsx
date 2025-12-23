import { Routes, Route, Navigate } from "react-router-dom";
import Shell from "./layout/Shell";

// Existing pages (FIX folder name: modernization)
import InfrastructureOverviewPage from "./pages/modernizaton/InfrastructureOverviewPage";
import AssetInventoryPage from "./pages/modernizaton/AssetInventoryPage";
import ModernizationScorecardPage from "./pages/modernizaton/ModernizationScorecardPage";


import DriftDetectionPage from "./pages/cybersecurity/DriftDetectionPage";
import ZeroTrustReadinessPage from "./pages/cybersecurity/ZeroTrustReadinessPage";
import ComplianceSnapshotPage from "./pages/cybersecurity/ComplianceSnapshotPage";
import SecurityOperationsCenter from "./pages/cybersecurity/SecurityOperationsCenter";
import DependencyMapPage from "./pages/modernizaton/DependencyMapPage";
import ReferenceArchitecturesPage from "./pages/modernizaton/ReferenceArchitecturesPage";
import LifecycleTechnicalDebtPage from "./pages/modernizaton/LifecycleTechnicalDebtPage";
import TelemetryReadinessPage from "./pages/modernizaton/TelemetryReadinessPage";
import IdentityAccessPosturePage from "./pages/cybersecurity/IdentityAccessPosturePage";
import SupplyChainSecurityPage from "./pages/cybersecurity/SupplyChainSecurityPage";
import VulnerabilityExposurePage from "./pages/cybersecurity/VulnerabilityExposurePage";
import ResilienceContinuityPage from "./pages/cybersecurity/ResilienceContinuityPage";
import IncidentReadinessPage from "./pages/cybersecurity/IncidentReadinessPage";
import IaCBlueprintsPage from "./pages/automation/IaCBlueprintsPage";
import CICDBlueprintsPage from "./pages/automation/CICDBlueprintsPage";
import PolicyAsCodePage from "./pages/automation/PolicyAsCodePage";
import GitOpsDriftRemediationPage from "./pages/automation/GitOpsDriftRemediatonPage";
import SecureProvisioningPage from "./pages/automation/SecureProvisioningPage";
import ExecutiveDashboardPage from "./pages/overview/ExecutiveDashboardPage";
import ProgramRoadmapPage from "./pages/overview/ProgramRoadmapPage";
import RiskPrioritizationEnginePage from "./pages/ai/RiskPrioritizationEnginePage";
import MisconfigurationAnomaliesPage from "./pages/ai/MisconfigurationAnomaliesPage";
import DigitalTwinPage from "./pages/ai/DigitalTwinPage";
import ControlMappingStudioPage from "./pages/compliance/ControlMappingStudioPage";
import EvidencePackBuilderPage from "./pages/compliance/EvidencePackBuilderPage";
import AuditTrailsPage from "./pages/compliance/AuditTrailsPage";
import ReportsPage from "./pages/compliance/ReportsPage";
import PeerBenchmarkingPage from "./pages/collaboration/PeerBenchmarkingPage";
import TemplateExchangePage from "./pages/collaboration/TemplateExchangePage";
import WorkforceTrainingLabsPage from "./pages/collaboration/WorkforceTrainingLabsPage";
import InstitutionsPage from "./pages/admin/InstitutionsPage";
import IntegrationsPage from "./pages/admin/IntegrationsPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Simple placeholder component (frontend-only)
function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, background: "white", padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>{desc}</div>
      <div style={{ marginTop: 14, color: "#111827" }}>
        (Next) Implement UI + mockApi data wiring.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        {/* default landing */}
        <Route path="/" element={<Navigate to="/overview/executive" replace />} />

        {/* Overview */}
        <Route
          path="/overview/executive"
          element={<ExecutiveDashboardPage />}
        />
        <Route
          path="/overview/roadmap"
          element={<ProgramRoadmapPage />}
        />

        {/* Modernization */}
        <Route path="/modernization/overview" element={<InfrastructureOverviewPage />} />
        <Route path="/modernization/assets" element={<AssetInventoryPage />} />
        <Route path="/modernization/scorecard" element={<ModernizationScorecardPage />} />
        <Route
          path="/modernization/dependency-map"
          element={<DependencyMapPage />}
        />
        <Route
          path="/modernization/lifecycle"
          element={<LifecycleTechnicalDebtPage/>}
        />
        <Route
          path="/modernization/telemetry"
          element={<TelemetryReadinessPage />}
        />
        <Route
          path="/modernization/reference-architectures" element={<ReferenceArchitecturesPage />}
        />


        {/* Cybersecurity */}
        <Route path="/cybersecurity/soc" element={<SecurityOperationsCenter />} />
        <Route path="/cybersecurity/drift" element={<DriftDetectionPage />} />
        <Route path="/cybersecurity/zerotrust" element={<ZeroTrustReadinessPage />} />
        <Route
          path="/cybersecurity/identity"
          element={<IdentityAccessPosturePage />}
        />
        <Route
          path="/cybersecurity/exposure"
          element={<VulnerabilityExposurePage />}
        />
        <Route
          path="/cybersecurity/incident-readiness"
          element={<IncidentReadinessPage />}
        />
        <Route
          path="/cybersecurity/supply-chain"
          element={
            <SupplyChainSecurityPage
            />
          }
        />
        <Route
          path="/cybersecurity/resilience"
          element={
            <ResilienceContinuityPage
            />
          }
        />

        {/* Automation & IaC */}
        <Route
          path="/automation/iac-blueprints"
          element={<IaCBlueprintsPage />}
        />
        <Route
          path="/automation/cicd-blueprints"
          element={<CICDBlueprintsPage/>}
        />
        <Route
          path="/automation/policy-as-code"
          element={<PolicyAsCodePage />}
        />
        <Route
          path="/automation/gitops-remediation"
          element={<GitOpsDriftRemediationPage />}
        />
        <Route
          path="/automation/secure-provisioning"
          element={<SecureProvisioningPage />}
        />

        {/* Compliance & Evidence */}
        <Route path="/compliance/snapshot" element={<ComplianceSnapshotPage />} />
        <Route
          path="/compliance/mapping"
          element={<ControlMappingStudioPage />}
        />
        <Route
          path="/compliance/evidence"
          element={<EvidencePackBuilderPage />}
        />
        <Route
          path="/compliance/audit"
          element={<AuditTrailsPage />}
        />
        <Route
          path="/compliance/reports"
          element={<ReportsPage />}
        />

        {/* AI & Simulation */}
        <Route
          path="/ai/risk"
          element={<RiskPrioritizationEnginePage />}
        />
        <Route
          path="/ai/anomalies"
          element={<MisconfigurationAnomaliesPage />}
        />
        <Route
          path="/ai/digital-twin"
          element={<DigitalTwinPage/>}
        />

        {/* Collaboration */}
        <Route
          path="/collaboration/benchmarking"
          element={<PeerBenchmarkingPage />}
        />
        <Route
          path="/collaboration/exchange"
          element={<TemplateExchangePage />}
        />
        <Route
          path="/collaboration/training"
          element={<WorkforceTrainingLabsPage />}
        />

        {/* Admin */}
        <Route
          path="/admin/institutions"
          element={<InstitutionsPage />}
        />
        <Route
          path="/admin/integrations"
          element={<IntegrationsPage />}
        />
        <Route
          path="/admin/settings"
          element={<SettingsPage />}
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/overview/executive" replace />} />
      </Route>
    </Routes>
  );
}
