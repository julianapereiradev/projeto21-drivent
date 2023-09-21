import Joi from 'joi';
import { CreateTicket } from '@/repositories/tickets-repository';

export const createTicketsSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().required(),
});
