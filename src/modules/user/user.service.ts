import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utilis/auth";
import prisma from "../../utilis/prisma"
import { CreateUserInput } from "./user.schema"


// export default class UserService {
//     constructor(private prismaClient: PrismaClient) {}

//     public async createUser(data: )

// }
export const createUser = async (input: CreateUserInput) => {

    const { name, email, password } = input;

    const hashedPassword = await hashPassword(password)

    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })
        return user
    } catch (error) {
        console.error('unable to create user')
    }

}