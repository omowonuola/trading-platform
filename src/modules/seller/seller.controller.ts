import { FastifyRequest, FastifyReply } from 'fastify'
import { createSellerProfile, getAllSellers } from './seller.service';
import { CreateSellerInput } from './seller.schema';

export const createSellerHandler = async ( request: FastifyRequest<{
    Body: CreateSellerInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const seller = await createSellerProfile(body)
        return reply.code(201).send(seller)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}


export const getAllSellerHandler = async (
    request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
    reply: FastifyReply
   ) => {
    let { page = 1, limit = 10 } = request.query;
    page = Number(page);
    limit = Number(limit);
   
    try {
      const sellers = await getAllSellers(page, limit);
      return reply.code(200).send(sellers);
    } catch (error) {
      console.error(error);
      reply.code(500).send(error);
    }
};