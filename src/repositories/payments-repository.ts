import { prisma } from '@/config';
import { Payment } from '@prisma/client';

export type CreatePayment = Omit<Payment,  'id' | 'createdAt' | 'updatedAt'>;

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

  async function getTicketIdPrice(ticketTypeId: number) {
    return prisma.ticketType.findUnique({
      where: {
        id: ticketTypeId,
      },
    });
  }

async function postPayments(postInfo: CreatePayment) {
  return prisma.payment.create({
    data: postInfo
  })
}

async function updatingTicketStatus(ticketId: number) {
  const updatestatus = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });

  return updatestatus;
}

export const paymentsRepository = {
  getPayments,
  postPayments,
  getTicketIdInDB,
  getTicketIdPrice,
  updatingTicketStatus
};
