import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


const createDealSchema = z.object({
    name: z.string(),
    price: z.string(),
    sellerId: z.number(),
    currency: z.string(),
    totalPrice: z.number(),
    status: z.string(),
    discountType: z.string(),
    discountAmount: z.number()
})

const createDealResponseSchema = z.object({
    id: z.number(),
    name: z.string()
})

export type CreateDealInput = z.infer<typeof createDealSchema>;


export const { schemas: dealSchemas, $ref } = buildJsonSchemas({
    createDealSchema,
    createDealResponseSchema
}, 
    {
        $id: 'DealSchemas',
    }
)