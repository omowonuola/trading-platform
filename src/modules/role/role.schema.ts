import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


const createRoleSchema = z.object({
    name: z.string()

})

const createRoleResponseSchema = z.object({
    id: z.number(),
    name: z.string()
})

export type CreateRoleInput = z.infer<typeof createRoleSchema>;


export const { schemas: roleSchemas, $ref } = buildJsonSchemas({
    createRoleSchema,
    createRoleResponseSchema
}, 
    {
        $id: 'RoleSchemas',
  })