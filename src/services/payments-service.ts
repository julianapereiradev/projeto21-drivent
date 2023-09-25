import { prisma } from "@/config";
import { notFoundError, unauthorizedError } from "@/errors";
import { InCardData } from "@/protocols";
import { paymentsRepository } from "@/repositories/payments-repository";



async function postPayments(cardData: InCardData, ticketId: number, userId: number) {
  const idTicketExist = await paymentsRepository.getTicketIdInDB(ticketId)
  if(!idTicketExist) throw notFoundError()

  const enrollmentId = idTicketExist.enrollmentId;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { userId: true },
  })

  if (enrollment.userId !== userId) throw unauthorizedError()

  const ticketIdPrice = await paymentsRepository.getTicketIdPrice(idTicketExist.ticketTypeId);


  const Payment = {
    ticketId: idTicketExist.id,
    value: ticketIdPrice.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  await paymentsRepository.postPayments(Payment)

  await paymentsRepository.updatingTicketStatus(ticketId);

  const getPayment = await paymentsRepository.getPayments(ticketId);

  return getPayment;
}

async function getPayments(userId: number, ticketId: number) {
  const idTicketExist = await paymentsRepository.getTicketIdInDB(ticketId)
  if(!idTicketExist) throw notFoundError()

  const enrollmentId = idTicketExist.enrollmentId;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { userId: true },
  })

  if (enrollment.userId !== userId) throw unauthorizedError()

  const getPayment = await paymentsRepository.getPayments(ticketId)

  return getPayment
}

const paymentsService = {
postPayments,
getPayments
};

export default paymentsService;
