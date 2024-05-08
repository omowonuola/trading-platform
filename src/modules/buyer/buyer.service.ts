import prisma from "../../utilis/prisma"
import { CreateBuyerInput } from "./buyer.schema"






export const createBuyerProfile = async (input: CreateBuyerInput) => {

    const { email, name } = input;

      // Check if a Buyer with the provided name already exists
    const existingBuyer = await findBuyerByEmail(email)
    
    if (existingBuyer) {
        // Buyer with the provided name already exists
        throw new Error('Buyer with this email already exists');
    }

    const buyer = await prisma.buyer.create({
        data: { email, name }
    })
    return buyer
}


export const findBuyerByEmail = async (email: string) => {
    return prisma.buyer.findUnique({
        where: {
            email,
        },
        select: { id: true }
    })

}

export const getAllBuyers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const buyers = await prisma.buyer.findMany({
      skip,
      take: limit,
    });
   
    const totalCount = await prisma.buyer.count();
   
    return {
      data: buyers,
      totalCount,
      page,
      limit,
    };
};