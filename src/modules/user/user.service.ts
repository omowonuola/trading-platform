import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utilis/auth";
import prisma from "../../utilis/prisma"
import { CreateUserInput } from "./user.schema"


// export default class UserService {
//     constructor(private prismaClient: PrismaClient) {}

//     public async createUser(data: )

// }
export const createUser = async (input: CreateUserInput) => {

    const { name, email, password, roleId } = input;

      // Check if a user with the provided email already exists
    const existingUser = await findUserByEmail(email)

    if (existingUser) {
        // User with the provided email already exists
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, roleId },
        include: {
            role: true,
        },
    })

    const userWithRoleName = {
        ...user,
        roleName: user.role.name,
    };

    return userWithRoleName;
}

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email,
        }
    })

}