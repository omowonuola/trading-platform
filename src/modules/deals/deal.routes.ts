import { FastifyInstance } from 'fastify'
import { createDealHandler, getUserDealHandler } from './deal.controller'
import { $ref, CreateDealInput } from './deal.schema'
import { isAuthenticated, isSeller } from '../../utilis/auth'
import { CreateDealBody } from '../../interface/userInterface'
import z from 'zod';






const dealRoutes = async (server: FastifyInstance) => {
    server.post<CreateDealBody>('/', {
        preHandler: [isAuthenticated, isSeller],
        schema: {
            body: $ref('createDealSchema'),
            response: {
                201: $ref('createDealResponseSchema')
            },
        },
    }, createDealHandler)


    server.get('/getDeal', {
        preHandler: [isAuthenticated, isSeller],
        schema: {
            response: {
                201: z.array($ref('createDealResponseSchema'))
            },
        },
    }, getUserDealHandler)
}


export default dealRoutes