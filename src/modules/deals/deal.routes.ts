import { FastifyInstance } from 'fastify'
import { createDealHandler } from './deal.controller'
import { $ref } from './deal.schema'
import { isAuthenticated, isSeller } from '../../utilis/auth'


const dealRoutes = async (server: FastifyInstance) => {
    server.post('/', {
        preHandler: [isAuthenticated, isSeller],
        schema: {
            body: $ref('createDealSchema'),
            response: {
                201: $ref('createDealResponseSchema')
            },
        },
    }, createDealHandler)

}


export default dealRoutes