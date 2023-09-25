import { PaymentType } from '@/protocols';
import Joi from 'joi';

export const createPaymentsSchema = Joi.object<PaymentType>({
  ticketId: Joi.number().integer(),
  cardData: Joi.object ({
    issuer: Joi.string(),
    number: Joi.number().integer(),
    name: Joi.string(),
    expirationDate: Joi.string(),
    cvv: Joi.string(),
  }),
});
