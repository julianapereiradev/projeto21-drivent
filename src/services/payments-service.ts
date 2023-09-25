import { prisma } from '@/config';
import { notFoundError, unauthorizedError } from '@/errors';
import { PaymentType } from '@/protocols';
import { paymentsRepository } from '@/repositories/payments-repository';

async function postPayments(userId: number, dataPaymentType: PaymentType) {
  const { ticketId, cardData } = dataPaymentType;

  const idTicketExist = await paymentsRepository.getTickeIdWithEnrollment(ticketId);
  if (!idTicketExist) throw notFoundError();

  const enrollmentId = idTicketExist.enrollmentId;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { userId: true },
  });

  if (enrollment.userId !== userId) throw unauthorizedError();

  const postingPayment = await paymentsRepository.postPayments({
    ticketId,
    value: idTicketExist.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.slice(-4),
  });

  await paymentsRepository.updatingTicketStatus(ticketId);
  return postingPayment;
}

async function getPayments(userId: number, ticketId: number) {
  const idTicketExist = await paymentsRepository.getTicketIdInDB(ticketId);
  if (!idTicketExist) throw notFoundError();

  const enrollmentId = idTicketExist.enrollmentId;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { userId: true },
  });

  if (enrollment.userId !== userId) throw unauthorizedError();

  const getPayment = await paymentsRepository.getPayments(ticketId);

  return getPayment;
}

const paymentsService = {
  postPayments,
  getPayments,
};

export default paymentsService;
