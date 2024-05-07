import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


const createItemSchema = z.object({
    name: z.string(),
    price: z.number(),
    dealId: z.number()
})

const createItemResponseSchema = z.object({
    id: z.number(),
    name: z.string()
})

export type CreateItemInput = z.infer<typeof createItemSchema>;


export const { schemas: itemSchemas, $ref } = buildJsonSchemas({
    createItemSchema,
    createItemResponseSchema
}, 
    {
        $id: 'ItemSchemas',
    }
)