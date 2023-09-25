import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { invalidDataError } from '@/errors';
import paymentsService from '@/services/payments-service';
import { CreatePayment } from '@/repositories/payments-repository';
import { PaymentType } from '@/protocols';



export async function getPayments(req: AuthenticatedRequest, res: Response) {
    const ticketId = Number(req.query.ticketId)
    if(!ticketId) throw invalidDataError('you need to pass the ticketId in query string')
  
    const resultGetPayments = await paymentsService.getPayments(req.userId, Number(ticketId));
    res.status(httpStatus.OK).send(resultGetPayments);
}

export async function postPayments(req: AuthenticatedRequest, res: Response) {
    const { cardData, ticketId } = req.body;

    const { userId } = req;
  
    if (!cardData || !ticketId) throw invalidDataError('cardData or ticketId not passed');

 const postPayment = await paymentsService.postPayments(cardData, ticketId, userId);
 
 res.status(httpStatus.OK).send(postPayment);


}
