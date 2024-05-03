import { User } from "@prisma/client";
import prisma from "../../utilis/prisma"
import { CreateSellerInput } from "./seller.schema"






export const createSellerProfile = async (input: CreateSellerInput) => {


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


export const getAllSellers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const sellers = await prisma.seller.findMany({
      skip,
      take: limit,
    });
   
    const totalCount = await prisma.seller.count();
   
    return {
      data: sellers,
      totalCount,
      page,
      limit,
    };
};