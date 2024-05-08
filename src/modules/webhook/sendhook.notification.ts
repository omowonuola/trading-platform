import axios from 'axios';
import { UpdateDealInput } from '../deals/deal.schema';
import prisma from '../../utilis/prisma';

export const sendWebhookNotification = async (
  buyerId: number,
  dealId: number,
  updateData: UpdateDealInput
) => {
  // Fetch the buyer's webhook URL from the database
  const buyer = await prisma.buyer.findUnique({
    where: { id: buyerId },
    select: { webhookUrl: true },
  });

  if (!buyer || !buyer.webhookUrl) {
    console.error(`No webhook URL found for buyer ${buyerId}`);
    return;
  }

  // Construct the webhook payload
  const payload = {
    dealId,
    updateData,
  };

  try {
    // Send the webhook notification
    await axios.post(buyer.webhookUrl, payload, {
        headers: {
            'Content-Type': 'application/json',
          },
    })
  } catch (error) {
    console.error(`Failed to send webhook notification to buyer ${buyerId}`, error);
  }
};