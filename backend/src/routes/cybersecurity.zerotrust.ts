import type { FastifyInstance } from "fastify";
import { computeZeroTrustScore } from "../lib/zerotrust.js";

export async function zeroTrustRoutes(app: FastifyInstance) {
  app.get("/cybersecurity/zerotrust", async (req) => {
    const { institutionId } = (req.query as any);
    if (!institutionId) return { error: "institutionId is required" };

    const checks = await app.prisma.zeroTrustCheck.findMany({
      where: { institutionId },
      orderBy: { createdAt: "asc" }
    });

    const score = await computeZeroTrustScore(app.prisma, institutionId);
    return { score, checks };
  });

  app.patch("/cybersecurity/zerotrust/:id", async (req) => {
    const { id } = req.params as any;
    const { passed, evidence } = (req.body as any) ?? {};

    const updated = await app.prisma.zeroTrustCheck.update({
      where: { id },
      data: { passed: !!passed, evidence: evidence ?? null }
    });

    return { check: updated };
  });
}
