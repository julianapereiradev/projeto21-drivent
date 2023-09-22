import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getPayments, postPayments } from '@/controllers/payments-controller';
import { createPaymentsSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPayments)
  .post('/process', validateBody(createPaymentsSchema), postPayments);

export { paymentsRouter };
