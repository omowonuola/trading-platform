import dealUpdatesQueue from './deal.updates.queue';
import { sendWebhookNotification } from './sendhook.notification';

dealUpdatesQueue.process(async (job) => {
  const { dealId, buyerIds, updateData } = job.data;

  for (const buyerId of buyerIds) {
    await sendWebhookNotification(buyerId, dealId, updateData);
  }
});