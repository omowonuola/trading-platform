import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'


export enum DealStatus {
    sold = 'sold',
    available = 'available',
}

export enum DiscountType {
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

const dealUpdateParamsSchema = z.object({
    id: z.number(),
});


const updateDealInputSchema = z.object({
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
          id: z.number().optional(),
          name: z.string().optional(),
          price: z.number().optional(),
        })
      )
      .optional(),
});

const dealUpdateJobSchema = z.object({
    dealId: z.number(),
    buyerIds: z.array(z.number()),
    updateData: updateDealInputSchema
  });


export type CreateDealInput = z.infer<typeof createDealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealInputSchema>
export type DealUpdateJobData = z.infer<typeof dealUpdateJobSchema>
export type DealUpdateParam = z.infer<typeof dealUpdateParamsSchema>


export const { schemas: dealSchemas, $ref } = buildJsonSchemas({
    createDealSchema,
    createDealResponseSchema,
    updateDealInputSchema,
    dealUpdateJobSchema,
    dealUpdateParamsSchema
}, 
    {
        $id: 'DealSchemas',
    }
)