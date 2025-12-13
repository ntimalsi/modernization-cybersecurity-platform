import { PrismaClient } from "@prisma/client";

function jsonDiff(baseline: any, current: any) {
  // Minimal diff: list changed top-level keys
  const changes: Record<string, { baseline: any; current: any }> = {};
  const keys = new Set([...Object.keys(baseline ?? {}), ...Object.keys(current ?? {})]);

  for (const k of keys) {
    const b = baseline?.[k];
    const c = current?.[k];
    if (JSON.stringify(b) !== JSON.stringify(c)) {
      changes[k] = { baseline: b, current: c };
    }
  }
  return changes;
}

export async function evaluateDrift(prisma: PrismaClient, assetId: string) {
  const baseline = await prisma.configSnapshot.findFirst({
    where: { assetId, kind: "baseline" },
    orderBy: { createdAt: "desc" }
  });

  const current = await prisma.configSnapshot.findFirst({
    where: { assetId, kind: "current" },
    orderBy: { createdAt: "desc" }
  });

  if (!baseline || !current) return null;

  const diff = jsonDiff(baseline.data, current.data);
  const changedKeys = Object.keys(diff);

  if (changedKeys.length === 0) return null;

  const summary = `Drift detected: ${changedKeys.slice(0, 5).join(", ")}${changedKeys.length > 5 ? "…" : ""}`;

  await prisma.driftEvent.create({
    data: {
      assetId,
      summary,
      diff
    }
  });

  return { summary, diff };
}
