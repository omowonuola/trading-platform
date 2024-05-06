import prisma from "../../utilis/prisma"
import { CreateItemInput } from "./item.schema"



export const createItem = async (input: CreateItemInput) => {

      // Check if a deal with the provided name already exists
    const existingItem = await findItemByName(input.name, input.price)
    
    if (existingItem) {
        // deal with the provided name already exists
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