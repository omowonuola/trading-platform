import prisma from "../../utilis/prisma"
import { CreateSellerInput } from "./seller.schema"






export const createSeller = async (input: CreateSellerInput) => {

    const { email, name } = input;

      // Check if a seller with the provided name already exists
    const existingSeller = await findSellerByEmail(email)
    
    if (existingSeller) {
        // Seller with the provided name already exists
        throw new Error('Seller with this email already exists');
    }

    const seller = await prisma.seller.create({
        data: { email, name }
    })
    return seller
}


export const findSellerByEmail = async (email: string) => {
    return prisma.seller.findUnique({
        where: {
            email,
        }
    })

}