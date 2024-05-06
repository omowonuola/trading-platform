import prisma from "../../utilis/prisma"
import { CreateDealInput } from "./deal.schema"



export const createDeal = async (input: CreateDealInput) => {

      // Check if a deal with the provided name already exists
    const existingDeal = await findDealByName(input.name)
    
    if (existingDeal) {
        // deal with the provided name already exists
        throw new Error('Deal with this name already exists');
    }

    const deal = await prisma.deal.create({
        data: input
    })
    return deal
}


// export const findDealByName = async (name: string) => {
//     return prisma.deal.findUnique({
//       where: {
//         name: {
//           equals: name,
//           mode: 'insensitive',
//         },
//       },
//     });
//   };

export const findDealByName = async (name: string) => {
    return prisma.deal.findUnique({
        where: {
            name,
        }
    })

}