import Joi from 'joi';

export const createPaymentsSchema = Joi.object({
  ticketId: Joi.number().required(),
});
