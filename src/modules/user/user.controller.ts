import { FastifyRequest, FastifyReply } from 'fastify'
import { createUser, findUserByEmail } from './user.service';
import { CreateUserInput, LoginInput } from './user.schema';
import { comparePasswords, generateToken } from '../../utilis/auth';

export const registerUserHandler = async ( request: FastifyRequest<{
    Body: CreateUserInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    try {
        const user = await createUser(body)
        return reply.code(201).send(user)
    } catch (error) {
        console.error(error)
        reply.code(500).send(error);
    }
}


export const loginHandler = async ( request: FastifyRequest<{
    Body: LoginInput
}>, reply: FastifyReply) => {
    
    const body = request.body;

    const user = await findUserByEmail(body.email)

    if(!user) {
        return reply.code(401).send({
            message: 'Invalid email or password'
        })
    }

    const correctPassword = await comparePasswords(
        body.password,
        user.password
    )

    if(correctPassword) {
        const { email, name, id, roleId} = user

        return {accessToken: generateToken({email, name, id, roleId })}
    }

    return reply.code(401).send({
        message: 'Invalid email or password'
    })

}