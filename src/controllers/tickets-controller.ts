import { Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';
import { CreateTicket } from '@/repositories/tickets-repository';
import { invalidDataError } from '@/errors';

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  const resultGetTicketsType = await ticketsService.getTicketsType();
  res.status(httpStatus.OK).send(resultGetTicketsType);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const resultGetTickets = await ticketsService.getTickets(req.userId);
  res.status(httpStatus.OK).send(resultGetTickets);
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as CreateTicket;

  if (!ticketTypeId) throw invalidDataError('Quando ticketTypeId não é enviada');

  const ticketTypeIdPost = await ticketsService.postTickets(req.userId, ticketTypeId);

  return res.status(httpStatus.CREATED).send(ticketTypeIdPost);
}
