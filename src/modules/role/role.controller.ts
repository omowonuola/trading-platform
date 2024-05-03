import { FastifyRequest, FastifyReply } from 'fastify'
import { createRole, findRoleByName, getAllRoles } from './role.service';
import { CreateRoleInput } from './role.schema';

export const createRoleHandler = async ( request: FastifyRequest<{
    Body: CreateRoleInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const role = await createRole(body)
        return reply.code(201).send(role)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}


export const getAllRoleHandler = async (
    request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
    reply: FastifyReply
   ) => {
    let { page = 1, limit = 10 } = request.query;
    page = Number(page);
    limit = Number(limit);
   
    try {
      const roles = await getAllRoles(page, limit);
      return reply.code(200).send(roles);
    } catch (error) {
      console.error(error);
      reply.code(500).send(error);
    }
};