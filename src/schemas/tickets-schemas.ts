import { CreateTicket } from '@/repositories/tickets-repository';
import Joi from 'joi';

export const createTicketsSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().required(),
});
