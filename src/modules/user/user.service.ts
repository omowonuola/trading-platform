import { hashPassword } from "../../utilis/auth";
import prisma from "../../utilis/prisma"
import { CreateUserInput } from "./user.schema"
import { createBuyerProfile, generateBuyerWebhookUrl } from "../buyer/buyer.service";
import { createSellerProfile } from "../seller/seller.service";



export const createUser = async (input: CreateUserInput) => {

    const { name, email, password, roleId } = input;

    const existingUser = await findUserByEmail(email)

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, roleId },
        include: {
            role: true,
        },
    })

    const roleName = user.role.name
    const accountInput = {email, name}
    let webhookUrl = null;
    if (roleName === 'buyer') {
      webhookUrl = generateBuyerWebhookUrl();
    }

    const userWithRoleName = {
        ...user,
        roleName,
    };

    if (roleName === 'buyer') {
        await createBuyerProfile({...accountInput, webhookUrl})
    }  else if (roleName === 'seller') {
        await createSellerProfile(accountInput);
    }


    return userWithRoleName;
}

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email,
        }
    })

}
