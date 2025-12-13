# Unified Modernization & Cybersecurity Platform (MVP)

This repository contains the **MVP implementation** of a unified platform that helps
**universities and public institutions** modernize their network infrastructure and
enhance cybersecurity through:

- Automated **infrastructure discovery & asset inventory**
- **Modernization readiness scoring** (visibility, lifecycle, standardization)
- **Configuration drift detection**
- **Zero Trust readiness checks**
- A simple **compliance snapshot** (NIST 800-171 / EO 14028 subset)
- A web **dashboard** for CIOs, CISOs, and IT teams

> This MVP is intentionally small and focused: it provides visibility, scoring, and
> basic security checks without making disruptive changes to production systems.

---

## 1. High-Level Architecture

- **Frontend**: React / React Admin dashboard
- **Backend API**: Node.js (Express or Fastify)
- **Database**: PostgreSQL
- **Ingestion**:
  - Cloud API collectors (AWS/Azure/GCP, optional for now)
  - Lightweight network scanner (e.g., Nmap / ping sweeps where allowed)
  - CSV import endpoint for manual inventories
- **Analytics / Rules Engine**:
  - Modernization scoring
  - Zero Trust readiness checks
  - Drift detection (baseline vs. current)
  - Simple compliance mapping (selected NIST controls)

Planned extension:
- **Optional AI / anomaly detection microservice** (Python + FastAPI)

---

## 2. Features (MVP Scope)

### Modernization Layer

- Discover and store basic information about:
  - Servers / VMs
  - Network devices (where accessible)
  - Cloud resources (optional)
- Show a **Modernization Scorecard**:
  - Asset Visibility Score
  - Lifecycle / Legacy Score
  - Configuration Consistency Score
  - Logging / Telemetry Readiness Score
- Provide an **Infrastructure Overview Dashboard**:
  - Total assets
  - Unknown / untagged assets
  - Devices with outdated OS / firmware
  - Simple charts and tables

### Cybersecurity Layer (MVP)

- **Configuration Drift Detection**:
  - Store baseline configs for selected assets
  - Compare current vs. baseline on schedule
  - Record drift events and show a drift timeline

- **Zero Trust Readiness**:
  - A small set of checks (e.g., MFA, SSO, over-privileged roles, open ports)
  - Produce a 0–100 readiness score and recommendations

- **Compliance Snapshot (NIST mini-profile)**:
  - Map selected checks to a subset of NIST 800-171 / EO 14028 controls
  - Display a simple radar/heatmap summarizing current posture

---

## 3. Tech Stack

- **Backend**
  - Node.js 20+
  - Express or Fastify
  - TypeScript (optional but recommended)
  - PostgreSQL (via Prisma or Sequelize)

- **Frontend**
  - React 18+
  - React Admin
  - Vite or CRA for dev tooling

- **DevOps / Running Locally**
  - Docker / docker-compose
  - (Optional) Kubernetes manifests for later deployments

---

## 4. Project Structure (Suggested)

```text
.
├─ backend/
│  ├─ src/
│  │  ├─ index.ts           # App entry
│  │  ├─ routes/
│  │  │  ├─ assets.ts       # /assets endpoints
│  │  │  ├─ scores.ts       # /scores, /modernization
│  │  │  ├─ drift.ts        # /drift
│  │  │  ├─ zt.ts           # /zerotrust checks
│  │  ├─ services/
│  │  │  ├─ ingestion/
│  │  │  │  ├─ nmapScanner.ts
│  │  │  │  ├─ csvImporter.ts
│  │  │  ├─ scoringService.ts
│  │  │  ├─ driftService.ts
│  │  │  ├─ ztService.ts
│  │  ├─ models/            # ORM models / Prisma schema
│  │  ├─ config/
│  │  └─ utils/
│  ├─ package.json
│  └─ ...
│
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx
│  │  ├─ dashboard/
│  │  │  ├─ ModernizationOverview.tsx
│  │  │  ├─ AssetInventoryPage.tsx
│  │  │  ├─ DriftTimeline.tsx
│  │  │  ├─ ZeroTrustScorecard.tsx
│  │  │  └─ ComplianceSnapshot.tsx
│  │  └─ ra-config/         # React Admin dataProvider, authProvider
│  ├─ package.json
│  └─ ...
│
├─ docker-compose.yml
├─ README.md
└─ LICENSE
