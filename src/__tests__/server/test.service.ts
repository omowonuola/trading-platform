import { FastifyInstance } from "fastify";
import { test, expect } from "@jest/globals";
import buildServer from "./test.server";

test("requests the `/healthcheck` route", async () => {
  const fastify: FastifyInstance = await buildServer();

  const response = await fastify.inject({
    method: "GET",
    url: "/healthcheck",
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ status: "OK" });
});
