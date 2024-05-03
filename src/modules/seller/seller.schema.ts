import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


const createSellerSchema = z.object({
    name: z.string(),
    email: z.string()
})

const createSellerResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string()
})

export type CreateSellerInput = z.infer<typeof createSellerSchema>;


export const { schemas: sellerSchemas, $ref } = buildJsonSchemas({
    createSellerSchema,
    createSellerResponseSchema
}, 
    {
        $id: 'SellerSchemas',
  })