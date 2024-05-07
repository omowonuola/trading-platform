import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


enum DealStatus {
    sold = 'sold',
    available = 'available',
}

enum DiscountType {
    flat = 'flat',
    percentage = 'percentage',
}

const dealCore = {
    name: z.string(),
    currency: z.string(),
    totalPrice: z.number(),
    status: z.nativeEnum(DealStatus),
    discount: z
    .object({
      type: z.nativeEnum(DiscountType),
      amount: z.number(),
    })
    .optional()
    .nullable(),
    items: z.array(z.any()).optional(),
 
}

const createDealSchema = z.object({
    ...dealCore,

})

const createDealResponseSchema = z.object({
    id: z.number(),
    sellerId: z.number(),
    ...dealCore
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