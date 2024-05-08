import { FastifyRequest, FastifyReply } from 'fastify'
import { connectBuyerSeller } from './buyer-seller.service';
import { CreateConnectInput } from './buyer-seller.schema';

export const connectBuyerSellerHandler = async ( request: FastifyRequest<{
    Body: CreateConnectInput
}>, reply: FastifyReply) => {
    
    const body = request.body;
console.log(body, 'body')
    try {
        const seller = await connectBuyerSeller(body)
        console.log(seller, 'seller')
        return reply.code(201).send(seller)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}