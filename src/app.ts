import Fastify from 'fastify';
import * as dotenv from 'dotenv'
import userRoutes from './modules/user/user.routes';
import roleRoutes from './modules/role/role.routes';
import { userSchemas } from './modules/user/user.schema';
import { roleSchemas } from './modules/role/role.schema';
import buyerRoutes from './modules/buyer/buyer.routes';
import { buyerSchemas } from './modules/buyer/buyer.schema';
import sellerRoutes from './modules/seller/seller.routes';
import { sellerSchemas } from './modules/seller/seller.schema';
import dealRoutes from './modules/deals/deal.routes';
import { dealSchemas } from './modules/deals/deal.schema';
import itemRoutes from './modules/item/item.routes';
import { itemSchemas } from './modules/item/item.schema';
import { connectSchemas } from './modules/buyer-seller/buyer-seller.schema';
import connectRoutes from './modules/buyer-seller/buyer-seller.routes';



dotenv.config();


const main = async () => {

    const server = Fastify();

    server.get('/healthcheck', async () => {
        return { status: 'ok'}
    })

    for (const schema of [...userSchemas, ...roleSchemas, ...buyerSchemas,
         ...sellerSchemas, ...dealSchemas, ...itemSchemas, ...connectSchemas]) {
        server.addSchema(schema);
    }

    server.register(userRoutes, { prefix: 'api/users'})
    server.register(roleRoutes, { prefix: 'api/roles'})
    server.register(buyerRoutes, { prefix: 'api/buyer'})
    server.register(sellerRoutes, { prefix: 'api/seller'})
    server.register(dealRoutes, { prefix: 'api/deal'})
    server.register(itemRoutes, { prefix: 'api/item'})
    server.register(connectRoutes, { prefix: 'api/connection'})

    server.listen({ port: 3000 }, (err, address) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
}


main()

export default main;