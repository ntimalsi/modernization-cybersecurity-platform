                +-------------------------------+
                |   External Systems / Data     |
                |-------------------------------|
                |  • AWS / Azure / GCP APIs     |
                |  • On-prem networks (Nmap)    |
                |  • CSV uploads from IT staff  |
                +-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|            Backend & Ingestion Layer (Modernization)         |
|--------------------------------------------------------------|
|  1. Ingestion Service (Node.js scripts / cron jobs)          |
|     • Calls cloud provider APIs                              |
|     • Runs Nmap / ping scans (where allowed)                 |
|     • Parses CSV uploads                                     |
|     • Normalizes data into "Assets" & "Configs"              |
|                                                              |
|  2. Core API (Node.js + Express/Fastify)                     |
|     • REST endpoints: /assets, /scores, /drift, /alerts      |
|     • Auth (JWT or simple API key for MVP)                   |
|     • Business logic: scoring, mapping, recommendations      |
|                                                              |
|  3. Analytics / Rules Engine                                 |
|     • Modernization scoring (visibility, lifecycle, etc.)    |
|     • Zero Trust readiness checks                            |
|     • Compliance snapshot mapping (simple NIST subset)       |
|     • Drift detection (desired vs. actual config)            |
+--------------------------------------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                        Data Layer                            |
|--------------------------------------------------------------|
|        PostgreSQL (or MySQL if you prefer)                   |
|        • assets           • config_snapshots                 |
|        • drift_events     • zt_checks                        |
|        • scores           • alerts                           |
|        • users            • institutions (multi-tenant)      |
+--------------------------------------------------------------+
                               ^
                               |
+--------------------------------------------------------------+
|        Optional AI / Anomaly Microservice (Phase 1.5)        |
|--------------------------------------------------------------|
|   • Python + FastAPI (or stay in Node if you want speed)     |
|   • Basic anomaly detection on login / asset changes         |
|   • Exposed via /analyze-events endpoint                     |
+--------------------------------------------------------------+
                               ^
                               |
+--------------------------------------------------------------+
|                     Frontend Dashboard                       |
|--------------------------------------------------------------|
|  React / React Admin MVP:                                    |
|    • Modernization Overview (cards + charts)                 |
|    • Asset Inventory table                                   |
|    • Drift Timeline                                          |
|    • Zero Trust readiness scorecard                          |
|    • Compliance snapshot (NIST mini-heatmap)                 |
|    • Recommendations panel                                   |
+--------------------------------------------------------------+
