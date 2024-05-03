import prisma from "../../utilis/prisma"
import { CreateConnectInput } from "./buyer-seller.schema";



export const connectBuyerSeller = async (input: CreateConnectInput) => {
    const { buyerId, sellerId } = input
  
    try {
      // Create a new buyerSeller connection
      await prisma.buyerSeller.create({
        data: {
          buyerId,
          sellerId,
        },
      });
  
      return {
        success: true,
        message: 'Connection created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create connection',
      };
    }
  };