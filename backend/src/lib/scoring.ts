import type { PrismaClient } from "@prisma/client";

export async function computeModernizationScores(prisma: PrismaClient, institutionId: string) {
  const assets = await prisma.asset.findMany({ where: { institutionId } });

  if (assets.length === 0) {
    return {
      assetCount: 0,
      visibilityScore: 0,
      lifecycleScore: 0,
      standardizationScore: 0,
      loggingReadinessScore: 0
    };
  }

  // Visibility: has hostname + ip + assetType
  const visible = assets.filter(a => !!a.hostname && !!a.ip && !!a.assetType).length;
  const visibilityScore = Math.round((visible / assets.length) * 100);

  // Lifecycle: crude heuristic for demo
  const outdatedPattern = /(2008|2012|\b7\b|xp|centos\s*6|ubuntu\s*16)/i;
  const outdated = assets.filter(a => a.os && outdatedPattern.test(a.os)).length;
  const lifecycleScore = Math.max(0, 100 - Math.round((outdated / assets.length) * 100));

  // Standardization: tags exist
  const tagged = assets.filter(a => (a.tags ?? "").trim().length > 0).length;
  const standardizationScore = Math.round((tagged / assets.length) * 100);

  // Logging readiness: tags include logs:on OR siem:on
  const loggingReady = assets.filter(a => /(^|,)\s*(logs:on|siem:on)\s*(,|$)/i.test(a.tags ?? "")).length;
  const loggingReadinessScore = Math.round((loggingReady / assets.length) * 100);

  return {
    assetCount: assets.length,
    visibilityScore,
    lifecycleScore,
    standardizationScore,
    loggingReadinessScore
  };
}
