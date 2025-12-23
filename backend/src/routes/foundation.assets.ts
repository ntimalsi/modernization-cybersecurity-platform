import type { FastifyInstance } from "fastify";
import { z } from "zod";

export async function assetsRoutes(app: FastifyInstance) {
  const AssetSchema = z.object({
    institutionId: z.string(),
    hostname: z.string().optional(),
    ip: z.string().optional(),
    assetType: z.string().default("unknown"),
    os: z.string().optional(),
    owner: z.string().optional(),
    tags: z.string().optional()
  });

  app.get("/foundation/assets", async (req) => {
    const { institutionId } = (req.query as any);
    if (!institutionId) return { error: "institutionId is required" };
    const assets = await app.prisma.asset.findMany({
      where: { institutionId },
      orderBy: { createdAt: "desc" }
    });
    return { assets };
  });

  app.post("/foundation/assets", async (req) => {
    const body = AssetSchema.parse(req.body);
    const asset = await app.prisma.asset.create({ data: body });
    return { asset };
  });

  app.post("/foundation/assets/:id/baseline", async (req) => {
    const { id } = req.params as any;
    const data = (req.body as any) ?? {};
    const snap = await app.prisma.configSnapshot.create({
      data: { assetId: id, kind: "baseline", data }
    });
    return { baseline: snap };
  });

  app.post("/foundation/assets/:id/current", async (req) => {
    const { id } = req.params as any;
    const data = (req.body as any) ?? {};
    const snap = await app.prisma.configSnapshot.create({
      data: { assetId: id, kind: "current", data }
    });
    return { current: snap };
  });
}
