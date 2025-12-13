import { PrismaClient } from "@prisma/client";

export async function computeModernizationScores(prisma: PrismaClient, institutionId: string) {
  const assets = await prisma.asset.findMany({ where: { institutionId } });

  if (assets.length === 0) {
    return {
      visibilityScore: 0,
      lifecycleScore: 0,
      standardizationScore: 0,
      loggingReadinessScore: 0
    };
  }

  // Visibility score: percent of assets with hostname+ip+type present
  const visible = assets.filter(a => !!a.ip && !!a.assetType && !!a.hostname).length;
  const visibilityScore = Math.round((visible / assets.length) * 100);

  // Lifecycle score: crude heuristic: outdated if OS contains "2008|2012|7|xp|centos 6|ubuntu 16"
  const outdatedPattern = /(2008|2012|\b7\b|xp|centos\s*6|ubuntu\s*16)/i;
  const outdated = assets.filter(a => a.os && outdatedPattern.test(a.os)).length;
  const lifecycleScore = Math.max(0, 100 - Math.round((outdated / assets.length) * 100));

  // Standardization: percent of assets with tags set (simple proxy for governance)
  const tagged = assets.filter(a => (a.tags ?? "").trim().length > 0).length;
  const standardizationScore = Math.round((tagged / assets.length) * 100);

  // Logging readiness: percent of assets with tag "logs:on" or "siem:on" (demo-friendly)
  const loggingReady = assets.filter(a => /(^|,)\s*(logs:on|siem:on)\s*(,|$)/i.test(a.tags ?? "")).length;
  const loggingReadinessScore = Math.round((loggingReady / assets.length) * 100);

  return { visibilityScore, lifecycleScore, standardizationScore, loggingReadinessScore };
}
