import { prisma } from '@/config';


async function getPayments(ticketIdNumber: number) {
return prisma.payment.findFirst({
  where: {
    ticketId: ticketIdNumber
  }
})
}

async function getTicketIdInDB(ticketIdNumber: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketIdNumber
    }
  })
  }

async function postPayments() {
  
}

export const paymentsRepository = {
  getPayments,
  postPayments,
  getTicketIdInDB,
};
