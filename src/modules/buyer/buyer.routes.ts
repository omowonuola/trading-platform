import { FastifyInstance } from 'fastify'
import { createBuyerHandler } from './buyer.controller'
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

}

export default buyerRoutes;