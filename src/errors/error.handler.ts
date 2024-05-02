import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BaseHttpError } from "./http-errors";

export default async function (
  this: FastifyInstance,
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.error(error);

  if (error instanceof BaseHttpError) {
    reply.statusCode = error.statusCode;

    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  reply.statusCode = 500;

  return {
    statusCode: 500,
    error: "Internal Server Error",
    message: error.message,
  };
}