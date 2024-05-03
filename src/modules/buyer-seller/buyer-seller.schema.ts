
import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'



// Define the schema for the request body
const connectSchema = z.object({
    buyerId: z.number(),
    sellerId: z.number(),
  });
  
  // Define the schema for the response
  const connectResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
  });
  
  export type CreateConnectInput = z.infer<typeof connectSchema>;
  export type ConnectResponse = z.infer<typeof connectResponseSchema>;
  
  // Register the schemas
 export const { schemas: connectSchemas, $ref } = buildJsonSchemas({
    connectSchema,
    connectResponseSchema,
  }, {
    $id: 'ConnectSchemas',
  });