import { FastifyInstance } from 'fastify'
import { createSellerHandler, getAllSellerHandler } from './seller.controller'
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

    server.get('/allSellers', {
        schema: {
            response: {
                201: $ref('createSellerResponseSchema')
            },
        },
    }, getAllSellerHandler)

}

export default sellerRoutes;