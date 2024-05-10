import { FastifyInstance } from 'fastify'
import { createBuyerHandler, getAllBuyerHandler } from './buyer.controller'
import { $ref } from './buyer.schema'



const buyerRoutes = async (server: FastifyInstance) => {
    server.post('/', {
        schema: {
            body: $ref('createBuyerSchema'),
            response: {
                201: $ref('createBuyerResponseSchema')
            },
        },
    }, createBuyerHandler)


    server.get('/allBuyers', {
        schema: {
            response: {
                201: $ref('createBuyerResponseSchema')
            },
        },
    }, getAllBuyerHandler)

}

export default buyerRoutes;