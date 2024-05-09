import fastify, { FastifyInstance } from "fastify";

async function buildServer(): Promise<FastifyInstance> {
  const app: FastifyInstance = fastify();

  app.get("/healthcheck", async (request, reply) => {
    reply.code(200).send({ status: "OK" });
  });

  return app;
}

export default buildServer;
