import { prisma } from "@/config";
import { notFoundError, unauthorizedError } from "@/errors";
import { paymentsRepository } from "@/repositories/payments-repository";



async function postPayments() {
 
}

async function getPayments(userId: number, ticketId: number, ) {
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
