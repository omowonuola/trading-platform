import { FastifyInstance } from 'fastify'
import { createSellerHandler } from './seller.controller'
import { $ref } from './seller.schema'


const sellerRoutes = async (server: FastifyInstance) => {
    server.post('/', {
        schema: {
            body: $ref('createSellerSchema'),
            response: {
                201: $ref('createSellerResponseSchema')
            },
        },
    }, createSellerHandler)

}

export default sellerRoutes;