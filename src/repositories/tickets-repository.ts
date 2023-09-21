import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketsType(): Promise<TicketType[]> {
  const resultGetTicketsType = prisma.ticketType.findMany();
  return resultGetTicketsType;
}

export const ticketsRepository = {
  getTicketsType,
};
