import prisma from "../../utilis/prisma"
import { CreateItemInput } from "./item.schema"



export const createItem = async (input: CreateItemInput) => {

    const existingItem = await findItemByName(input.name, input.price)
    
    if (existingItem) {
        throw new Error('Item with this name already exists');
    }

    const item = await prisma.item.create({
        data: input
    })
    return item
}


export const findItemByName = async (name: string, price: number) => {
    return prisma.item.findFirst({
        where: {
            name,
            price,
        }
    })

}


export const getItemsByUserId = async (id: number) => {
    const items = await prisma.item.findMany({
      where: {
        id,
      },
    });
  
    return items;
};