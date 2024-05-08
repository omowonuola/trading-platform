import { FastifyRequest, FastifyReply } from 'fastify'
import { createDeal, getDealsByUserId, getDealsFromSeller } from './deal.services';
import { CreateDealInput } from './deal.schema';
import { RequestWithUser } from '../../interface/userInterface';
import { getUserId } from '../../utilis/auth';
import { findSellerByEmail } from '../seller/seller.service';
import { findBuyerByEmail } from '../buyer/buyer.service';




export const createDealHandler = async ( request: FastifyRequest<{
    Body: CreateDealInput
}>, reply: FastifyReply) => {
    
    const body = request.body;
    const user = await getUserId(request, reply)
    

    const getSeller = await findSellerByEmail(user.email);

    try {
        const deal = await createDeal({
            ...body,
            sellerId: getSeller.id
        })
        return reply.code(201).send(deal)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}


export const getUserDealHandler = async ( request: FastifyRequest, 
    reply: FastifyReply) => {

    
    try {
        const user = await getUserId(request, reply)

        const seller = await findSellerByEmail(user.email);

        if (!seller) {
            return reply.code(404).send({ error: 'Seller not found' });
          }
        
        const deals = await getDealsByUserId(seller.id)
        return reply.code(201).send({data: deals})
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}


export const getDealsFromSellerHandler = async ( request: FastifyRequest, 
    reply: FastifyReply) => {

    
    try {
        const user = await getUserId(request, reply)

        const buyer = await findBuyerByEmail(user.email);

        if (!buyer) {
            return reply.code(404).send({ error: 'buyer not found' });
        }

        const deals = await getDealsFromSeller(buyer.id)
        return reply.code(201).send({data: deals})
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}