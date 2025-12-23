import type { FastifyInstance } from "fastify";
import { computeZeroTrustScore } from "../lib/zerotrust.js";

export async function cybersecurityDashboardRoutes(app: FastifyInstance) {
  app.get("/cybersecurity/dashboard", async (req) => {
    const { institutionId } = (req.query as any);
    if (!institutionId) return { error: "institutionId is required" };

    const driftEvents = await app.prisma.driftEvent.count({ where: { asset: { institutionId } } });
    const zeroTrustScore = await computeZeroTrustScore(app.prisma, institutionId);

    await app.prisma.cybersecuritySnapshot.create({
      data: { institutionId, driftEvents, zeroTrustScore }
    });

    return { totals: { driftEvents }, zeroTrustScore };
  });
}
