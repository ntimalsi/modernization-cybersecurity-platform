import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { seedDefaultZeroTrustChecks } from "../lib/zerotrust.js";

export async function institutionsRoutes(app: FastifyInstance) {
  const CreateInstitution = z.object({ name: z.string().min(1).default("Pilot Institution") });

  app.post("/foundation/institutions", async (req) => {
    const body = CreateInstitution.parse(req.body ?? {});
    const inst = await app.prisma.institution.create({ data: { name: body.name } });
    await seedDefaultZeroTrustChecks(app.prisma, inst.id);
    return { institution: inst };
  });

  app.get("/foundation/institutions", async () => {
    const institutions = await app.prisma.institution.findMany({ orderBy: { createdAt: "desc" } });
    return { institutions };
  });
}
