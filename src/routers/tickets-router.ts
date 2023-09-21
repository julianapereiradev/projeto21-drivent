import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketsSchema } from '@/schemas';
import { getTickets, getTicketsType, postTickets } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsType)
  .get('/', getTickets)
  .post('/', validateBody(createTicketsSchema), postTickets);

export { ticketsRouter };
