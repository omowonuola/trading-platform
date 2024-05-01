import prisma from "../../utilis/prisma"
import { CreateUserInput } from "./user.schema"


export const createUser = async (input: CreateUserInput) => {

    const user = await prisma.user.create({
        data: input
    })
}