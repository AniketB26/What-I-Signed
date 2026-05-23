import Agenda from 'agenda';
import logger from '../utils/logger.js';

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'agendaJobs',
  },
  processEvery: '5 seconds',
  maxConcurrency: 2,
});

agenda.on('start', (job) => {
  logger.info(`Job ${job.attrs.name} started`, { jobId: job.attrs._id });
});

agenda.on('complete', (job) => {
  logger.info(`Job ${job.attrs.name} completed`, { jobId: job.attrs._id });
});

agenda.on('fail', (err, job) => {
  logger.error(`Job ${job.attrs.name} failed: ${err.message}`, { jobId: job.attrs._id });
});

export default agenda;
