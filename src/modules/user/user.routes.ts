import { FastifyInstance } from 'fastify'
import { loginHandler, registerUserHandler } from './user.controller'
import { $ref } from './user.schema'


const userRoutes = async (server: FastifyInstance) => {
    server.post('/', {
        schema: {
            body: $ref('createUserSchema'),
            response: {
                201: $ref('createUserResponseSchema')
            },
        },
    }, registerUserHandler)

    server.post('/login', {
        schema:{
            body: $ref('loginSchema'),
            response: {
                200: $ref('loginResponseSchema')
            }
        } 
    }, loginHandler);
}




export default userRoutes