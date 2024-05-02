import Fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();


const server = Fastify();

server.get('/healthcheck', async () => {
    return { status: 'ok'}
})

const main = async () => {
    try {
        await server.listen.call(3000, '0.0.0.0')
        console.log(`Server ready at http://localhost:3000`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

main()