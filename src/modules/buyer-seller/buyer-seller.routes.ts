import { FastifyInstance } from 'fastify'
import { connectBuyerSellerHandler } from './buyer-seller.controller'
import { $ref } from './buyer-seller.schema'
import { isAuthenticated, isBuyer, isSeller } from '../../utilis/auth';
import { CreateConnectionBody } from '../../interface/userInterface';




const connectRoutes = async (server: FastifyInstance) => {
    server.post<CreateConnectionBody>(
      '/',
      {
        preHandler: [isAuthenticated, isBuyer],
        schema: {
          body: $ref('createConnectSchema'),
          response: {
            200: $ref('connectResponseSchema'),
          },
        },
        
      },
      connectBuyerSellerHandler
    );
};
  
  export default connectRoutes;