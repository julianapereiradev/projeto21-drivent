import Joi from 'joi';
import { PaymentType } from '@/protocols';

export const createPaymentsSchema = Joi.object<PaymentType>({
  ticketId: Joi.number().required(),
  cardData: Joi.object().required(),
});
