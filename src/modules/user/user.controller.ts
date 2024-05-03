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
        console.log(user, 'here')
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

    // find a user by email
    const user = await findUserByEmail(body.email)

    if(!user) {
        return reply.code(401).send({
            message: 'Invalid email or password'
        })
    }

    // verfy password

    const correctPassword = await comparePasswords(
        body.password,
        user.password
    )

    if(correctPassword) {
        const { password, email, name} = user

        return {accessToken: generateToken(user)}
    }

    return reply.code(401).send({
        message: 'Invalid email or password'
    })
    // generate access token

}