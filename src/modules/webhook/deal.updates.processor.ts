import dealUpdatesQueue from './deal.updates.queue';
import { sendWebhookNotification } from './sendhook.notification';

dealUpdatesQueue.process(async (job: { data: { dealId: any; buyerIds: any; updateData: any; }; }) => {
  const { dealId, buyerIds, updateData } = job.data;

  for (const buyerId of buyerIds) {
    await sendWebhookNotification(buyerId, dealId, updateData);
  }
});