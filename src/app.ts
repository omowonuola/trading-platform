import Fastify from 'fastify';
import dotenv from 'dotenv';
import userRoutes from './modules/user/user.routes';
import roleRoutes from './modules/role/role.routes';
import { userSchemas } from './modules/user/user.schema';
import { roleSchemas } from './modules/role/role.schema';



dotenv.config();


const server = Fastify();

server.get('/healthcheck', async () => {
    return { status: 'ok'}
})

const main = async () => {

    for (const schema of [...userSchemas, ...roleSchemas]) {
        server.addSchema(schema);
    }

    server.register(userRoutes, { prefix: 'api/users'})
    server.register(roleRoutes, { prefix: 'api/roles'})

    server.listen({ port: 3000 }, (err, address) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
}


main()