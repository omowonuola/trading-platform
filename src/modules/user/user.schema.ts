import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userCore = {
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    })
    .email(),
    name: z.string(),
    roleId: z.number({
        required_error: 'Role ID is required',
        invalid_type_error: 'Role ID must be a number',
    }),
}

const createUserSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    })
    .email(),
    name: z.string(),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    }),
    roleId: z.number({
        required_error: 'Role ID is required',
        invalid_type_error: 'Role ID must be a number',
    }),
})


const createUserResponseSchema = z.object({
    id: z.number(),
    ...userCore
})


const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    })
    .email(),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    }),
})


const loginResponseSchema = z.object({
    accessToken: z.string(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
},
    {
        $id: 'UserSchemas',
    }
)