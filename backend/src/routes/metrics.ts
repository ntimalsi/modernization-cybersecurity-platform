import { FastifyInstance } from "fastify";
import { computeModernizationScores } from "../lib/scoring.js";
import { computeZeroTrustScore, seedDefaultZeroTrustChecks } from "../lib/zerotrust.js";
import { evaluateDrift } from "../lib/drift.js";

export async function metricsRoutes(app: FastifyInstance) {
  app.post("/institutions", async (req) => {
    const name = (req.body as any)?.name ?? "Pilot Institution";
    const inst = await app.prisma.institution.create({ data: { name } });
    await seedDefaultZeroTrustChecks(app.prisma, inst.id);
    return { institution: inst };
  });

  app.get("/dashboard", async (req) => {
    const { institutionId } = (req.query as any);
    if (!institutionId) return { error: "institutionId is required" };

    const assets = await app.prisma.asset.findMany({ where: { institutionId } });
    const byType: Record<string, number> = {};
    for (const a of assets) byType[a.assetType] = (byType[a.assetType] ?? 0) + 1;

    const modernization = await computeModernizationScores(app.prisma, institutionId);
    const ztScore = await computeZeroTrustScore(app.prisma, institutionId);

    const driftCount = await app.prisma.driftEvent.count({
      where: { asset: { institutionId } }
    });

    // Persist score snapshot (optional, useful for trendlines later)
    await app.prisma.scoreSnapshot.create({
      data: {
        institutionId,
        ...modernization,
        zeroTrustScore: ztScore
      }
    });

    return {
      totals: { assets: assets.length, driftEvents: driftCount },
      byType,
      modernization,
      zeroTrustScore: ztScore
    };
  });

  // Evaluate drift for one asset (call after posting baseline/current)
  app.post("/assets/:id/evaluate-drift", async (req) => {
    const { id } = req.params as any;
    const result = await evaluateDrift(app.prisma, id);
    return { drift: result ?? null };
  });

  app.get("/drift", async (req) => {
    const { institutionId } = (req.query as any);
    if (!institutionId) return { error: "institutionId is required" };

    const events = await app.prisma.driftEvent.findMany({
      where: { asset: { institutionId } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { asset: true }
    });

    return {
      events: events.map(e => ({
        id: e.id,
        createdAt: e.createdAt,
        summary: e.summary,
        hostname: e.asset.hostname,
        ip: e.asset.ip,
        diff: e.diff
      }))
    };
  });

  app.get("/zerotrust", async (req) => {
    const { institutionId } = (req.query as any);
    if (!institutionId) return { error: "institutionId is required" };

    const checks = await app.prisma.zeroTrustCheck.findMany({
      where: { institutionId },
      orderBy: { createdAt: "asc" }
    });
    const score = await computeZeroTrustScore(app.prisma, institutionId);
    return { score, checks };
  });

  app.patch("/zerotrust/:id", async (req) => {
    const { id } = req.params as any;
    const { passed, evidence } = (req.body as any) ?? {};
    const updated = await app.prisma.zeroTrustCheck.update({
      where: { id },
      data: { passed: !!passed, evidence: evidence ?? null }
    });
    return { check: updated };
  });
}
