import { FastifyRequest, FastifyReply } from 'fastify'
import { createItem } from './item.services';
import { CreateItemInput } from './item.schema';




export const createItemHandler = async ( request: FastifyRequest<{
    Body: CreateItemInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const deal = await createItem(body)
        return reply.code(201).send(deal)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}