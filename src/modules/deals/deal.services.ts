import prisma from "../../utilis/prisma"
import dealUpdatesQueue from "../webhook/deal.updates.queue";
import { CreateDealInput, UpdateDealInput } from "./deal.schema"



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

export const getDealsFromSeller = async (buyerId: number) => {
  // Fetch the seller IDs that the buyer is connected to
  const connectedSellers = await prisma.buyerSeller.findMany({
    where: { buyerId },
    select: { sellerId: true },
  });

  const connectedSellerIds = connectedSellers.map((seller:any) => seller.sellerId);

  // Fetch the deals where the sellerId matches the connected sellers
  const deals = await prisma.deal.findMany({
    where: {
      sellerId: {
        in: connectedSellerIds,
      },
    },
    include: {
      items: true,
    },
  });

  return deals;
};

export const findDealByName = async (name: string) => {
    return prisma.deal.findUnique({
        where: {
            name,
        }
    })

}

export const updateDeal = async (id:number, input: UpdateDealInput & { sellerId: number }) => {
  const {name, currency, totalPrice, status, discount, items, sellerId } = input;

    // Check if the deal exists and is owned by the authenticated seller
    const existingDeal = await prisma.deal.findUnique({
        where: { id },
        select: { sellerId: true },
    });
    
    if (!existingDeal || existingDeal.sellerId !== sellerId) {
        throw new Error('You are not authorized to update this deal');
    }
  const deal = await prisma.deal.update({
    where: { id },
    data: {
      name,
      currency,
      totalPrice,
      status,
      discount,
      items: {
        updateMany: items?.map((item) => ({
          where: { id: item.id },
          data: { name: item.name, price: item.price },
        })),
      },
    },
  });
  console.log(deal, 'deals')

    // Find the connected buyers for this deal
    const connectedBuyers = await prisma.buyerSeller.findMany({
        where: { sellerId: deal.sellerId },
        select: { buyerId: true },
    });
    console.log(connectedBuyers, 'buyers')
    
      const buyerIds = connectedBuyers.map((buyer:any) => buyer.buyerId);
      console.log(buyerIds, 'buyers')
      // Add a job to the queue to notify the connected buyers
    const success = await dealUpdatesQueue.add({ dealId:deal.id, buyerIds, updateData: input });
    console.log(success, 'here')
  return deal;
};
