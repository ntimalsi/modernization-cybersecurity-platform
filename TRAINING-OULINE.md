# Workforce Training Curriculum  
## Secure Modernization & DevSecOps for Public Institutions

This document defines the **public, reusable workforce training curriculum** embedded within the Modernization & Cybersecurity Platform.  
It demonstrates how institutional IT teams are educated using structured, transferable training modules that translate cybersecurity and modernization findings into actionable remediation steps.

This curriculum is intentionally published in a **public GitHub repository** and licensed for reuse to support broad dissemination across U.S. public institutions.

---

## 1. Purpose of the Training Program

The Workforce Training Program educates **institutional IT teams**—including universities, municipalities, K–12 districts, and public agencies—on how to modernize infrastructure and improve cybersecurity using **automation-first, repeatable methodologies**.

Training modules are aligned with real operational challenges such as identity security, DevSecOps pipelines, software supply chain integrity, policy enforcement, drift detection, and audit readiness.

The curriculum is designed so that **other institutions can independently adopt, reuse, and apply these methods**, without reliance on a single employer or organization.

---

## 2. Target Audience

- Network and infrastructure engineers  
- Platform / DevOps engineers  
- Security engineers and SOC analysts  
- IT managers and modernization leads  

---

## 3. Training Format & Delivery Model

- **Format:** Self-paced guided labs with optional cohort-based delivery  
- **Duration:** Approximately 6–10 labs, 40–75 minutes per lab  
- **Instructional Components:**
  - Learning objectives  
  - Prerequisites  
  - Step-by-step remediation checklists  
  - Exportable evidence artifacts (reports, logs, screenshots, completion notes)

Each lab converts **platform-detected findings** into hands-on remediation tasks that teams can apply in real institutional environments.

---

## 4. Training Modules & Curriculum Outline

### A. Zero Trust Fundamentals

**Lab: Implement MFA for Privileged Accounts**  
- Level: Beginner | ~45 minutes  
- Objectives:
  - Identify privileged roles and accounts  
  - Enforce multi-factor authentication (MFA)  
  - Validate and export MFA coverage  
- Evidence Artifacts:
  - MFA coverage report  
  - Policy configuration screenshots  
  - Completion note  

---

### B. DevSecOps (Core Workforce Training Track)

**Lab: Secure GitOps Workflow (PR Checks & Approvals)**  
- Level: Beginner | ~50 minutes  
- Objectives:
  - Enforce protected branches  
  - Require code reviews and approvals  
  - Establish auditable change control  
- Evidence Artifacts:
  - Branch protection configuration screenshots  
  - Required status checks export  

---

**Lab: Infrastructure-as-Code (IaC) Security Scanning**  
- Level: Intermediate | ~60 minutes  
- Objectives:
  - Integrate IaC scanning into CI/CD pipelines  
  - Block insecure Terraform changes  
  - Generate reusable baseline policies  
- Evidence Artifacts:
  - CI pipeline scan output  
  - Policy baseline configuration files  

---

**Lab: Secrets Hygiene and Credential Protection**  
- Level: Intermediate | ~45 minutes  
- Objectives:
  - Detect secrets committed to source control  
  - Block leaked credentials  
  - Produce incident-ready evidence  
- Evidence Artifacts:
  - Secret detection logs  
  - CI gate screenshots  

---

**Lab: SLSA-Lite — Signed Artifacts & Provenance**  
- Level: Advanced | ~75 minutes  
- Objectives:
  - Sign build artifacts  
  - Attach provenance metadata  
  - Verify integrity prior to deployment  
- Evidence Artifacts:
  - Provenance records  
  - Signature verification output  

---

### C. CI/CD Security & Software Supply Chain

**Lab: SBOM & Provenance Enforcement in CI/CD**  
- Level: Intermediate | ~60 minutes  
- Objectives:
  - Generate software bills of materials (SBOMs)  
  - Enforce artifact integrity gates  
- Evidence Artifacts:
  - SBOM files  
  - CI pipeline logs  

---

### D. Policy-as-Code Enforcement

**Lab: Enforce Required Logging with Policy-as-Code**  
- Level: Intermediate | ~50 minutes  
- Objectives:
  - Apply baseline security policies  
  - Detect violations prior to deployment  
  - Remediate non-compliant configurations  
- Evidence Artifacts:
  - Policy violation reports  
  - Remediation pull requests or tickets  

---

### E. Telemetry & SOC Operations

**Lab: Drift Detection & SOC Triage Playbook**  
- Level: Advanced | ~75 minutes  
- Objectives:
  - Detect configuration drift  
  - Classify risk severity  
  - Initiate response workflows  
- Evidence Artifacts:
  - Incident tickets  
  - Evidence snapshots  

---

### F. Modernization Roadmap & Planning

**Lab: 30 / 60 / 90-Day Modernization Plan**  
- Level: Beginner | ~40 minutes  
- Objectives:
  - Prioritize technical debt  
  - Assign ownership and milestones  
  - Produce an executive modernization roadmap  
- Evidence Artifacts:
  - Roadmap report  
  - Planning dashboard screenshots  

---

## 5. Evidence Generation & Documentation

Each training lab produces **exportable artifacts** that can be used for:

- Workforce training documentation  
- Security remediation records  
- Audit readiness and compliance reporting  

These artifacts demonstrate both **knowledge transfer** and **practical implementation**.

---

## 6. Public Dissemination & Reuse

This workforce training curriculum is intentionally published in a **public GitHub repository** to support nationwide dissemination of modernization and cybersecurity training methods.

- Publicly accessible documentation  
- Open-source licensed (see `/LICENSE`)  
- Reusable by universities, municipalities, and public agencies  

The training materials are designed for **independent adoption and transferability** and are not restricted to a single employer or organization.

---

## 7. Relationship to Platform Implementation

The modules described in this document directly correspond to the platform’s **Workforce Training & Labs** user interface, where labs are delivered, progress is tracked, and evidence artifacts are generated and exported.

---

## Links

- Repository: https://github.com/ntimalsi/modernization-cybersecurity-platform  
- License: `/LICENSE`
