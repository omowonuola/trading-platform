import Bull from 'bull';
import { DealUpdateJobData } from '../deals/deal.schema';

const dealUpdatesQueue = new Bull<DealUpdateJobData>('deal-updates', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

export default dealUpdatesQueue;