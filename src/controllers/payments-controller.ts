import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketId } from '@/protocols';
import { invalidDataError } from '@/errors';
import paymentsService from '@/services/payments-service';


export async function getPayments(req: AuthenticatedRequest, res: Response) {
    const ticketId = Number(req.query.ticketId)
    if(!ticketId) throw invalidDataError('you need to pass the ticketId in query string')
  
    const resultGetPayments = await paymentsService.getPayments(req.userId, Number(ticketId));
    res.status(httpStatus.OK).send(resultGetPayments);
}

export async function postPayments(req: AuthenticatedRequest, res: Response) {
 
}
