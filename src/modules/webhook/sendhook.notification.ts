import axios from 'axios';
import { UpdateDealInput } from '../deals/deal.schema';
import prisma from '../../utilis/prisma';

export const sendWebhookNotification = async (
  buyerId: number,
  dealId: number,
  updateData: UpdateDealInput
) => {
  const buyer = await prisma.buyer.findUnique({
    where: { id: buyerId },
    select: { webhookUrl: true },
  });

  if (!buyer || !buyer.webhookUrl) {
    console.error(`No webhook URL found for buyer ${buyerId}`);
    return;
  }

  const payload = {
    dealId,
    updateData,
  };

  try {
    await axios.post(buyer.webhookUrl, payload, {
        headers: {
            'Content-Type': 'application/json',
          },
    })
  } catch (error) {
    console.error(`Failed to send webhook notification to buyer ${buyerId}`, error);
  }
};