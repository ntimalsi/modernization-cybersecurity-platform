import type { FastifyInstance } from "fastify";
import { computeModernizationScores } from "../lib/scoring.js";

export async function modernizationRoutes(app: FastifyInstance) {
  app.get("/modernization/dashboard", async (req) => {
    const { institutionId } = (req.query as any);
    if (!institutionId) return { error: "institutionId is required" };

    const assets = await app.prisma.asset.findMany({ where: { institutionId } });
    const byType: Record<string, number> = {};
    for (const a of assets) byType[a.assetType] = (byType[a.assetType] ?? 0) + 1;

    const modernization = await computeModernizationScores(app.prisma, institutionId);

    await app.prisma.modernizationSnapshot.create({
      data: { institutionId, ...modernization }
    });

    return {
      totals: { assets: assets.length },
      byType,
      modernization
    };
  });
}
