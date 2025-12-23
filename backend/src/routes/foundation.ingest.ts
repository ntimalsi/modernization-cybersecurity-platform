import type { FastifyInstance } from "fastify";
import Papa from "papaparse";

export async function ingestRoutes(app: FastifyInstance) {
  // CSV columns: hostname, ip, assetType, os, owner, tags
  app.post("/foundation/ingest/csv", async (req, reply) => {
    const mp = await (req as any).file();
    if (!mp) return reply.code(400).send({ error: "file is required" });

    const institutionId = (req.query as any)?.institutionId;
    if (!institutionId) return reply.code(400).send({ error: "institutionId is required" });

    const content = (await mp.toBuffer()).toString("utf-8");
    const parsed = Papa.parse<Record<string, string>>(content, { header: true, skipEmptyLines: true });

    if (parsed.errors.length) {
      return reply.code(400).send({ error: "CSV parse failed", details: parsed.errors });
    }

    const rows = parsed.data.map(r => ({
      institutionId,
      hostname: r.hostname?.trim() || undefined,
      ip: r.ip?.trim() || undefined,
      assetType: (r.assetType?.trim() || "unknown").toLowerCase(),
      os: r.os?.trim() || undefined,
      owner: r.owner?.trim() || undefined,
      tags: r.tags?.trim() || undefined
    }));

    const created = await app.prisma.asset.createMany({ data: rows });
    return { imported: created.count };
  });
}
