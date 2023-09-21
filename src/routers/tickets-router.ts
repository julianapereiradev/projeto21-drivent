import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createOrUpdateEnrollmentSchema } from '@/schemas';
import { getTickets, getTicketsType, postTickets } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
.all('/*', authenticateToken)
.get('/types', getTicketsType)
  .get('/', getTickets)
  .post('/', postTickets);
  // .post('/', validateBody(createOrUpdateEnrollmentSchema), postCreateOrUpdateEnrollment);

export { ticketsRouter };
