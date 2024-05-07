import { FastifyInstance } from 'fastify'
import { createItemHandler } from './item.controller'
import { $ref } from './item.schema'
import { isAuthenticated, isSeller } from '../../utilis/auth'
import { CreateItemBody } from '../../interface/userInterface'


const itemRoutes = async (server: FastifyInstance) => {
    server.post<CreateItemBody>('/', {
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