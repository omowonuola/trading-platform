import { FastifyInstance } from 'fastify'
import { createRoleHandler, getAllRoleHandler } from './role.controller'
import { $ref } from './role.schema'


const roleRoutes = async (server: FastifyInstance) => {
    server.post('/', {
        schema: {
            body: $ref('createRoleSchema'),
            response: {
                201: $ref('createRoleResponseSchema')
            },
        },
    }, createRoleHandler)

    server.get('/allRoles', {
        schema: {
            response: {
                201: $ref('createRoleResponseSchema')
            },
        },
    }, getAllRoleHandler)

}


export default roleRoutes
