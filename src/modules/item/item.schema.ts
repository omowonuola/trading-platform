import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


const createItemSchema = z.object({
    name: z.string(),
    price: z.string(),
    dealId: z.string()
})

const createItemResponseSchema = z.object({
    id: z.number(),
    name: z.string()
})

export type CreateItemInput = z.infer<typeof createItemSchema>;


export const { schemas: roleSchemas, $ref } = buildJsonSchemas({
    createItemSchema,
    createItemResponseSchema
}, 
    {
        $id: 'ItemSchemas',
    }
)