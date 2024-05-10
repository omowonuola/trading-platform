import { FastifyRequest, FastifyReply } from 'fastify'
import { createBuyerProfile, getAllBuyers } from './buyer.service';
import { CreateBuyerInput } from './buyer.schema';
import { UpdateDealParams } from '../../interface/userInterface';
import crypto from 'crypto';


export const createBuyerHandler = async ( request: FastifyRequest<{
    Body: CreateBuyerInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const buyer = await createBuyerProfile(body)
        return reply.code(201).send(buyer)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}

export const getAllBuyerHandler = async (
    request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
    reply: FastifyReply
   ) => {
    let { page = 1, limit = 10 } = request.query;
    page = Number(page);
    limit = Number(limit);
   
    try {
      const sellers = await getAllBuyers(page, limit);
      return reply.code(200).send(sellers);
    } catch (error) {
      console.error(error);
      reply.code(500).send(error);
    }
};




// export const generateBuyerWebhookUrl = async () => {

//     try {
//         const token = crypto.randomBytes(16).toString('hex');
//         const webhookUrl = `https://${request.headers.host}/webhooks/${token}`;  
        
//         return reply.code(201).send(webhookUrl)
//     } catch (error) {
//         console.error(error);
//         reply.code(500).send(error);
//     }

// };