import { FastifyInstance } from 'fastify'
import { createItemHandler } from './item.controller'
import { $ref } from './item.schema'
import { isAuthenticated, isSeller } from '../../utilis/auth'


const itemRoutes = async (server: FastifyInstance) => {
    server.post('/', {
        preHandler: [isAuthenticated, isSeller],
        schema: {
            body: $ref('createItemSchema'),
            response: {
                201: $ref('createItemResponseSchema')
            },
        },
    }, createItemHandler)

}


export default itemRoutes