export type ModernizationDashboardResponse = {
  totals: { assets: number };
  byType: Record<string, number>;
  modernization: {
    assetCount: number;
    visibilityScore: number;
    lifecycleScore: number;
    standardizationScore: number;
    loggingReadinessScore: number;
  };
};

export type CybersecurityDashboardResponse = {
  totals: { driftEvents: number };
  zeroTrustScore: number;
};

export type DriftResponse = {
  events: Array<{
    id: string;
    createdAt: string;
    summary: string;
    hostname?: string | null;
    ip?: string | null;
    diff: any;
  }>;
};

export type ZeroTrustResponse = {
  score: number;
  checks: Array<{
    id: string;
    key: string;
    title: string;
    passed: boolean;
    evidence?: string | null;
  }>;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const api = {
  createInstitution: async (name: string) => {
    const res = await fetch("/api/foundation/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error(`Create institution failed: ${res.status}`);
    return res.json() as Promise<{ institution: { id: string; name: string } }>;
  },

  modernizationDashboard: (institutionId: string) =>
    getJson<ModernizationDashboardResponse>(
      `/api/modernization/dashboard?institutionId=${encodeURIComponent(institutionId)}`
    ),

  cybersecurityDashboard: (institutionId: string) =>
    getJson<CybersecurityDashboardResponse>(
      `/api/cybersecurity/dashboard?institutionId=${encodeURIComponent(institutionId)}`
    ),

  drift: (institutionId: string) =>
    getJson<DriftResponse>(`/api/cybersecurity/drift?institutionId=${encodeURIComponent(institutionId)}`),

  zerotrust: (institutionId: string) =>
    getJson<ZeroTrustResponse>(`/api/cybersecurity/zerotrust?institutionId=${encodeURIComponent(institutionId)}`),

  updateZeroTrust: async (checkId: string, passed: boolean, evidence?: string) => {
    const res = await fetch(`/api/cybersecurity/zerotrust/${checkId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passed, evidence })
    });
    if (!res.ok) throw new Error(`Update check failed: ${res.status}`);
    return res.json();
  }
};
