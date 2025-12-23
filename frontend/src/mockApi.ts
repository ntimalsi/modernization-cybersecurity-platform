export type Institution = { id: string; name: string };

export type Asset = {
  id: string;
  institutionId: string;
  hostname?: string;
  ip?: string;
  assetType: "server" | "network" | "cloud" | "iot" | "app" | "unknown";
  os?: string;
  owner?: string;
  tags?: string; // "logs:on,siem:on"
  createdAt: string;
};

export type DriftEvent = {
  id: string;
  institutionId: string;
  createdAt: string;
  hostname?: string;
  ip?: string;
  summary: string;
  diff: Record<string, any>;
};

export type ZeroTrustCheck = {
  id: string;
  institutionId: string;
  key: string;
  title: string;
  passed: boolean;
  evidence?: string;
};

export type ModernizationDashboard = {
  totals: { assets: number; unknownAssets: number; outdated: number; untagged: number };
  byType: Record<string, number>;
  scores: {
    visibility: number;
    lifecycle: number;
    standardization: number;
    loggingReadiness: number;
  };
};

export type CybersecurityDashboard = {
  totals: { driftEvents: number };
  zeroTrustScore: number;
};

function cuidLike() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function nowIso() {
  return new Date().toISOString();
}

const defaultZeroTrust = [
  { key: "mfa", title: "MFA enforced for privileged access" },
  { key: "sso", title: "SSO integrated for core apps" },
  { key: "least_privilege", title: "Least privilege enforced for admin roles" },
  { key: "segmentation", title: "Network segmentation present (tiers/zones)" },
  { key: "logging", title: "Centralized logging forwarding enabled" },
  { key: "patching", title: "Patching process defined for critical systems" },
  { key: "backup", title: "Backups tested and ransomware resilient" },
  { key: "edr", title: "Endpoint protection/EDR coverage in place" }
] as const;

type DB = {
  institutions: Institution[];
  assets: Asset[];
  drift: DriftEvent[];
  zt: ZeroTrustCheck[];
};

function loadDb(): DB {
  const raw = localStorage.getItem("mvp_db_v1");
  if (raw) return JSON.parse(raw) as DB;

  const inst1: Institution = { id: "inst_demo_1", name: "Demo University" };

  const seedAssets: Asset[] = [
    {
      id: "a1",
      institutionId: inst1.id,
      hostname: "core-sw-01",
      ip: "10.1.0.10",
      assetType: "network",
      os: "NX-OS 9.3",
      owner: "NetOps",
      tags: "logs:on,siem:on",
      createdAt: nowIso()
    },
    {
      id: "a2",
      institutionId: inst1.id,
      hostname: "ad-01",
      ip: "10.1.1.5",
      assetType: "server",
      os: "Windows Server 2012",
      owner: "IT Systems",
      tags: "",
      createdAt: nowIso()
    },
    {
      id: "a3",
      institutionId: inst1.id,
      hostname: "app-portal-01",
      ip: "10.1.2.20",
      assetType: "app",
      os: "Ubuntu 22.04",
      owner: "App Team",
      tags: "logs:on",
      createdAt: nowIso()
    },
    {
      id: "a4",
      institutionId: inst1.id,
      hostname: "",
      ip: "10.1.3.99",
      assetType: "unknown",
      os: "",
      owner: "",
      tags: "",
      createdAt: nowIso()
    }
  ];

  const seedZt: ZeroTrustCheck[] = defaultZeroTrust.map((d) => ({
    id: cuidLike(),
    institutionId: inst1.id,
    key: d.key,
    title: d.title,
    passed: d.key === "mfa" || d.key === "logging",
    evidence: d.key === "mfa" ? "DUO enforced for admin group" : d.key === "logging" ? "Syslog to SIEM" : ""
  }));

  const seedDrift: DriftEvent[] = [
    {
      id: cuidLike(),
      institutionId: inst1.id,
      createdAt: nowIso(),
      hostname: "core-sw-01",
      ip: "10.1.0.10",
      summary: "Drift detected: acl, snmp, ntp",
      diff: { acl: { baseline: "v1", current: "v2" }, snmp: { baseline: "on", current: "off" } }
    }
  ];

  const db: DB = { institutions: [inst1], assets: seedAssets, drift: seedDrift, zt: seedZt };
  localStorage.setItem("mvp_db_v1", JSON.stringify(db));
  return db;
}

function saveDb(db: DB) {
  localStorage.setItem("mvp_db_v1", JSON.stringify(db));
}

function computeModernization(assets: Asset[]): ModernizationDashboard {
  const totals = {
    assets: assets.length,
    unknownAssets: assets.filter((a) => a.assetType === "unknown").length,
    outdated: assets.filter((a) => /(2008|2012|\b7\b|xp|centos\s*6|ubuntu\s*16)/i.test(a.os ?? "")).length,
    untagged: assets.filter((a) => !(a.tags ?? "").trim()).length
  };

  const byType: Record<string, number> = {};
  for (const a of assets) byType[a.assetType] = (byType[a.assetType] ?? 0) + 1;

  const visible = assets.filter((a) => (a.hostname ?? "").trim() && (a.ip ?? "").trim() && (a.assetType ?? "").trim()).length;
  const visibility = assets.length ? Math.round((visible / assets.length) * 100) : 0;

  const outdated = totals.outdated;
  const lifecycle = assets.length ? Math.max(0, 100 - Math.round((outdated / assets.length) * 100)) : 0;

  const tagged = assets.filter((a) => (a.tags ?? "").trim().length > 0).length;
  const standardization = assets.length ? Math.round((tagged / assets.length) * 100) : 0;

  const loggingReady = assets.filter((a) => /(^|,)\s*(logs:on|siem:on)\s*(,|$)/i.test(a.tags ?? "")).length;
  const loggingReadiness = assets.length ? Math.round((loggingReady / assets.length) * 100) : 0;

  return {
    totals,
    byType,
    scores: { visibility, lifecycle, standardization, loggingReadiness }
  };
}

function computeZeroTrustScore(checks: ZeroTrustCheck[]) {
  if (!checks.length) return 0;
  const passed = checks.filter((c) => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}

export const mockApi = {
  async listInstitutions() {
    const db = loadDb();
    return db.institutions;
  },

  async createInstitution(name: string) {
    const db = loadDb();
    const inst: Institution = { id: "inst_" + cuidLike(), name };
    db.institutions.unshift(inst);

    db.zt.push(
      ...defaultZeroTrust.map((d) => ({
        id: cuidLike(),
        institutionId: inst.id,
        key: d.key,
        title: d.title,
        passed: false,
        evidence: ""
      }))
    );

    saveDb(db);
    return inst;
  },

  async getModernizationDashboard(institutionId: string) {
    const db = loadDb();
    const assets = db.assets.filter((a) => a.institutionId === institutionId);
    return computeModernization(assets);
  },

  async getCybersecurityDashboard(institutionId: string) {
    const db = loadDb();
    const driftEvents = db.drift.filter((d) => d.institutionId === institutionId).length;
    const checks = db.zt.filter((c) => c.institutionId === institutionId);
    return { totals: { driftEvents }, zeroTrustScore: computeZeroTrustScore(checks) } as CybersecurityDashboard;
  },

  async listAssets(institutionId: string) {
    const db = loadDb();
    return db.assets.filter((a) => a.institutionId === institutionId);
  },

  async listDrift(institutionId: string) {
    const db = loadDb();
    return db.drift
      .filter((d) => d.institutionId === institutionId)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 50);
  },

  async listZeroTrust(institutionId: string) {
    const db = loadDb();
    const checks = db.zt.filter((c) => c.institutionId === institutionId);
    return { score: computeZeroTrustScore(checks), checks };
  },

  async toggleZeroTrust(checkId: string, passed: boolean) {
    const db = loadDb();
    const idx = db.zt.findIndex((c) => c.id === checkId);
    if (idx >= 0) {
      db.zt[idx] = { ...db.zt[idx], passed, evidence: passed ? "Verified in pilot review" : "" };
      saveDb(db);
    }
    return db.zt[idx];
  },

  async mockImportCsv(institutionId: string) {
    const db = loadDb();
    const added: Asset[] = [
      {
        id: cuidLike(),
        institutionId,
        hostname: "edge-fw-01",
        ip: "10.9.0.1",
        assetType: "network",
        os: "PAN-OS 11",
        owner: "Security",
        tags: "logs:on,siem:on",
        createdAt: nowIso()
      },
      {
        id: cuidLike(),
        institutionId,
        hostname: "legacy-db-01",
        ip: "10.9.1.33",
        assetType: "server",
        os: "Windows Server 2008",
        owner: "DBA",
        tags: "",
        createdAt: nowIso()
      }
    ];
    db.assets.unshift(...added);
    saveDb(db);
    return { imported: added.length };
  },

  async generateDrift(institutionId: string) {
    const db = loadDb();
    const assets = db.assets.filter((a) => a.institutionId === institutionId);
    const pick = assets[Math.floor(Math.random() * Math.max(1, assets.length))];

    const ev: DriftEvent = {
      id: cuidLike(),
      institutionId,
      createdAt: nowIso(),
      hostname: pick?.hostname || "(unknown)",
      ip: pick?.ip || "",
      summary: "Drift detected: firewall_rules, dns, logging",
      diff: {
        firewall_rules: { baseline: "allow-campus", current: "allow-any" },
        dns: { baseline: "resolver-a", current: "resolver-b" }
      }
    };

    db.drift.unshift(ev);
    saveDb(db);
    return ev;
  },

  async resetDemo() {
    localStorage.removeItem("mvp_db_v1");
    loadDb();
  }
};
