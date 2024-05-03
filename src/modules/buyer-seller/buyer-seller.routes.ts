import { FastifyInstance } from 'fastify'
import { connectBuyerSellerHandler } from './buyer-seller.controller'
import { $ref } from './buyer-seller.schema'




const connectRoutes = async (fastify: FastifyInstance) => {
    fastify.post(
      '/connect',
      {
        schema: {
          body: $ref('connectSchema'),
          response: {
            200: $ref('connectResponseSchema'),
          },
        },
        preHandler: [/* Add authentication middleware here */],
      },
      connectBuyerSellerHandler
    );
  };
  
  export default connectRoutes;