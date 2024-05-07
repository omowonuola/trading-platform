import prisma from "../../utilis/prisma"
import { CreateDealInput } from "./deal.schema"



export const createDeal = async (input: CreateDealInput & { sellerId: number }) => {
    
      // Check if a deal with the provided name already exists
    const existingDeal = await findDealByName(input.name)
    
    
    if (existingDeal) {
        // deal with the provided name already exists
        throw new Error('Deal with this name already exists');
    }
    const deal = await prisma.deal.create({
        data: {
            ...input,
            items: {
                create: input.items?.map((item) => ({
                  name: item.name,
                  price: item.price,
                })),
              },
        }    
    })
    return deal
}


export const getDealsByUserId = async (id: number) => {
    const deals = await prisma.deal.findMany({
      where: {
        sellerId: id,
      },
      include: {
        items: true,
      },
    });
  
    return deals;
};

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


