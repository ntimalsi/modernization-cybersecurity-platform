# Roadmap

This roadmap outlines the short-term (MVP), mid-term, and long-term goals
for the Secure Automation-as-Code Platform.

---

## ✅ v0.1 – MVP (Current Release)
**Goal: Establish core foundation and prove methodology.**

- Terraform baseline infrastructure (VPC + EKS/AKS/GKE)
- FluxCD GitOps integration
- Minimal Helm control-plane chart
- Policy-as-Code starter set (Kyverno + OPA)
- NIST 800-171 mapping prototype
- Drift-checker (baseline vs cluster state)
- Slack/webhook alert support
- Basic dashboard skeleton
- Documentation + architecture diagrams

---

## 🚧 v0.2 – Compliance & Zero Trust Expansion
**Goal: Expand security posture automation.**

- More Kyverno/OPA control policies (10–30)
- Zero Trust identity enforcement templates
- Network micro-segmentation profiles
- Compliance scorecard (CI/CD job)
- Automated evidence collector (S3/Blob)
- Policy testing framework

---

## 🚀 v0.3 – AI & Resilience Modules
**Goal: Introduce advanced capabilities for public institutions.**

- ML-based anomaly detection (cluster behavior baseline)
- Drift prediction engine (~Rumi-GAN integration future)
- Federated ML prototype for EDU/Gov
- Digital Twin simulation mode
- E911 / emergency services integration API
- Expanded operations portal

---

## 🌐 v1.0 – Pilot Edition for EDU/Gov
**Goal: Production-ready version for real institutions.**

- Full compliance pack (NIST 800-53, 800-171, CMMC)
- Grant-ready deployment bundles (SLCGP, ESSER)
- Multi-cluster/multi-campus management
- Workforce training modules + micro-certifications
- Resilience testing automation
- Interop with REN-ISAC / OmniSOC feeds

---

This roadmap is intentionally flexible to encourage contributions,
experimentation, and cross-sector collaboration.
