import { FastifyRequest, FastifyReply } from 'fastify'
import { createSeller, findSellerByEmail } from './seller.service';
import { CreateSellerInput } from './seller.schema';

export const createSellerHandler = async ( request: FastifyRequest<{
    Body: CreateSellerInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const seller = await createSeller(body)
        return reply.code(201).send(seller)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}