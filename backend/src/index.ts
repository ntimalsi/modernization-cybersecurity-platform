import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

import { institutionsRoutes } from "./routes/foundation.institutions.js";
import { assetsRoutes } from "./routes/foundation.assets.js";
import { ingestRoutes } from "./routes/foundation.ingest.js";
import { modernizationRoutes } from "./routes/modernization.dashboard.js";
import { cybersecurityDashboardRoutes } from "./routes/cybersecurity.dashboard.js";
import { driftRoutes } from "./routes/cybersecurity.drift.js";
import { zeroTrustRoutes } from "./routes/cybersecurity.zerotrust.js";

const prisma = new PrismaClient();

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin = fp(async (app) => {
  app.decorate("prisma", prisma);
});

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? true
});
await app.register(multipart);
await app.register(prismaPlugin);

app.get("/health", async () => ({ ok: true }));

app.register(institutionsRoutes, { prefix: "/api" });
app.register(assetsRoutes, { prefix: "/api" });
app.register(ingestRoutes, { prefix: "/api" });
app.register(modernizationRoutes, { prefix: "/api" });
app.register(cybersecurityDashboardRoutes, { prefix: "/api" });
app.register(driftRoutes, { prefix: "/api" });
app.register(zeroTrustRoutes, { prefix: "/api" });

const port = Number(process.env.PORT || 8080);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
