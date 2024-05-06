import { FastifyRequest, FastifyReply } from 'fastify'
import { createDeal } from './deal.services';
import { CreateDealInput } from './deal.schema';




export const createDealHandler = async ( request: FastifyRequest<{
    Body: CreateDealInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const deal = await createDeal(body)
        return reply.code(201).send(deal)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}