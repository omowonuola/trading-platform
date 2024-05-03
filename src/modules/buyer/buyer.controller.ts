import { FastifyRequest, FastifyReply } from 'fastify'
import { createBuyer, findBuyerByEmail } from './buyer.service';
import { CreateBuyerInput } from './buyer.schema';

export const createBuyerHandler = async ( request: FastifyRequest<{
    Body: CreateBuyerInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const buyer = await createBuyer(body)
        return reply.code(201).send(buyer)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}