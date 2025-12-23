import type { FastifyInstance } from "fastify";
import { evaluateDrift } from "../lib/drift.js";

export async function driftRoutes(app: FastifyInstance) {
  // Evaluate drift for one asset after baseline/current snapshots exist
  app.post("/cybersecurity/assets/:id/evaluate-drift", async (req) => {
    const { id } = req.params as any;
    const result = await evaluateDrift(app.prisma, id);
    return { drift: result ?? null };
  });

  app.get("/cybersecurity/drift", async (req) => {
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
        createdAt: e.createdAt.toISOString(),
        summary: e.summary,
        hostname: e.asset.hostname,
        ip: e.asset.ip,
        diff: e.diff
      }))
    };
  });
}
