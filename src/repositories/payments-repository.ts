import { Enrollment, Payment, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export type CreatePayment = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;
export type TicketWithEnrollment = Ticket & { Enrollment: Enrollment } & { TicketType: TicketType };

async function getPayments(ticketIdNumber: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId: ticketIdNumber,
    },
  });
}

async function getTickeIdWithEnrollment(id: number) {
  return prisma.ticket.findUnique({
    where: { id },
    include: { Enrollment: true, TicketType: true },
  });
}

async function getTicketIdInDB(ticketIdNumber: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketIdNumber,
    },
  });
}

async function postPayments(data: CreatePayment) {
  return prisma.payment.create({ data });
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
  updatingTicketStatus,
  getTickeIdWithEnrollment,
};
