import { FastifyRequest, FastifyReply } from 'fastify'
import { createUser } from './user.service';
import { CreateUserInput } from './user.schema';

export const registerUserHandler = async ( request: FastifyRequest<{
    Body: CreateUserInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const user = await createUser(body)
        return reply.code(201).send(user)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}