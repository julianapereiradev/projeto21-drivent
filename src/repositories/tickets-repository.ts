import { TicketType, Ticket } from '@prisma/client';
import { prisma } from '@/config';

export type CreateTicket = Omit<Ticket, "id">
export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">

async function getTicketsType(): Promise<TicketType[]> {
  const resultGetTicketsType = prisma.ticketType.findMany();
  return resultGetTicketsType;
}


async function postTickets(ticket: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      ...ticket,
    }
  });
}


async function userWithoutEnrollment (userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId
    }
  })
};

async function userHasEnrollButNotTicket (enrollmentId: number) {
  return await prisma.ticket.findUnique({
    where: {
      enrollmentId
    },
    include: {
      TicketType: true
    }
  })
}


export const ticketsRepository = {
  getTicketsType,
  postTickets,
  userWithoutEnrollment,
  userHasEnrollButNotTicket
};
