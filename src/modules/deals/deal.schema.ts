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


const updateDealInputSchema = z.object({
    id: z.number().int().positive(), 
    name: z.string().optional(),
    currency: z.string().optional(),
    totalPrice: z.number().optional(),
    status: z.nativeEnum(DealStatus).optional(),
    discount: z
      .object({
        type: z.nativeEnum(DiscountType).optional(),
        amount: z.number().optional(),
      })
      .optional()
      .nullable(),
    items: z
      .array(
        z.object({
          id: z.number().int().positive().optional(),
          name: z.string().optional(),
          price: z.number().optional(),
        })
      )
      .optional(),
});


export type CreateDealInput = z.infer<typeof createDealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealInputSchema>


export const { schemas: dealSchemas, $ref } = buildJsonSchemas({
    createDealSchema,
    createDealResponseSchema,
    updateDealInputSchema
}, 
    {
        $id: 'DealSchemas',
    }
)