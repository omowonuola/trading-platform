import prisma from "../../utilis/prisma"
import { CreateRoleInput } from "./role.schema"






export const createRole = async (input: CreateRoleInput) => {

    const { name } = input;

      // Check if a role with the provided name already exists
    const existingRole = await findRoleByName(name)
    
    if (existingRole) {
        // role with the provided name already exists
        throw new Error('Role with this name already exists');
    }

    const role = await prisma.role.create({
        data: { name }
    })
    return role
}


export const findRoleByName = async (name: string) => {
    return prisma.role.findUnique({
        where: {
            name,
        }
    })

}


export const getAllRoles = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const roles = await prisma.role.findMany({
      skip,
      take: limit,
    });
   
    const totalCount = await prisma.role.count();
   
    return {
      data: roles,
      totalCount,
      page,
      limit,
    };
};