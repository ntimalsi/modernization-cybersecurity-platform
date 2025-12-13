import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

import { assetsRoutes } from "./routes/assets.js";
import { ingestRoutes } from "./routes/ingest.js";
import { metricsRoutes } from "./routes/metrics.js";

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
app.register(multipart);
app.register(prismaPlugin);

app.get("/", async (_req, reply) => {
  reply.type("text/html").send(await import("fs").then(fs => fs.readFileSync(new URL("./dashboard.html", import.meta.url), "utf-8")));
});

app.get("/health", async () => ({ ok: true }));

app.register(assetsRoutes);
app.register(ingestRoutes);
app.register(metricsRoutes);

const port = Number(process.env.PORT || 8080);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
