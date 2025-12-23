import type { PrismaClient } from "@prisma/client";

export async function seedDefaultZeroTrustChecks(prisma: PrismaClient, institutionId: string) {
  const defaults = [
    { key: "mfa", title: "MFA enforced for privileged access" },
    { key: "sso", title: "SSO integrated for core apps" },
    { key: "least_privilege", title: "Least privilege enforced for admin roles" },
    { key: "segmentation", title: "Network segmentation present (tiers/zones)" },
    { key: "logging", title: "Centralized logging forwarding enabled" },
    { key: "patching", title: "Patching process defined for critical systems" },
    { key: "backup", title: "Backups tested and ransomware resilient" },
    { key: "edr", title: "Endpoint protection/EDR coverage in place" }
  ];

  const existing = await prisma.zeroTrustCheck.count({ where: { institutionId } });
  if (existing > 0) return;

  await prisma.zeroTrustCheck.createMany({
    data: defaults.map(d => ({ institutionId, ...d, passed: false }))
  });
}

export async function computeZeroTrustScore(prisma: PrismaClient, institutionId: string) {
  const checks = await prisma.zeroTrustCheck.findMany({ where: { institutionId } });
  if (checks.length === 0) return 0;
  const passed = checks.filter(c => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}
