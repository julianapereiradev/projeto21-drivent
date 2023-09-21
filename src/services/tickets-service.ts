import { TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function getTicketsType() {
  const tickets = await ticketsRepository.getTicketsType();
  return tickets;
}

async function postTickets(userId: number, ticketTypeId: number) {
  const enrollment = await ticketsRepository.userWithoutEnrollment(userId);
  if (!enrollment) throw notFoundError();

  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketsRepository.postTickets(ticketData);

  const ticket = await ticketsRepository.userHasEnrollButNotTicket(enrollment.id);
  return ticket;
}

async function getTickets(userId: number) {
  const resultFindEnrollmentUser = await ticketsRepository.userWithoutEnrollment(userId);
  if (!resultFindEnrollmentUser) throw notFoundError();

  const resultFindTicketUser = await ticketsRepository.userHasEnrollButNotTicket(resultFindEnrollmentUser.id);
  if (!resultFindTicketUser) throw notFoundError();

  return resultFindTicketUser;
}

const ticketsService = {
  getTicketsType,
  postTickets,
  getTickets,
};

export default ticketsService;
