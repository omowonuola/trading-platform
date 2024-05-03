import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


const createBuyerSchema = z.object({
    name: z.string(),
    email: z.string()
})

const createBuyerResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string()
})

export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;


export const { schemas: buyerSchemas, $ref } = buildJsonSchemas({
    createBuyerSchema,
    createBuyerResponseSchema
}, 
    {
        $id: 'BuyerSchemas',
  })