import { FastifyInstance } from 'fastify'
import { createDealHandler, getDealsFromSellerHandler, getUserDealHandler, updateDealHandler } from './deal.controller'
import { $ref, CreateDealInput } from './deal.schema'
import { isAuthenticated, isBuyer, isSeller } from '../../utilis/auth'
import { CreateDealBody, UpdateDealBody, UpdateDealParams } from '../../interface/userInterface'
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

    server.get('/getSellerDeals', {
        preHandler: [isAuthenticated, isBuyer],
        schema: {
            response: {
                201: z.array($ref('createDealResponseSchema'))
            },
        },
    }, getDealsFromSellerHandler)

    server.put<{ Body: UpdateDealBody, Params: UpdateDealParams }>(
        '/updateDeals/:id',
        {
        preHandler: [isAuthenticated, isSeller],
        schema: {
            body: $ref('updateDealInputSchema'),

            response: {
                201: z.array($ref('createDealResponseSchema')),
            },
            // params: {
            //     id: z.number(),
            // },
        },
        },
        updateDealHandler
    );

}


export default dealRoutes