import { invalidDataError, notFoundError } from "@/errors";
import { CreateTicket, ticketsRepository } from "@/repositories/tickets-repository";

async function getTicketsType() {
  const tickets = await ticketsRepository.getTicketsType();
  return tickets;
}


async function postTickets(post: CreateTicket) {
 const resultPost = await ticketsRepository.postTickets(post);

 //if(resultPost.enrollmentId === 0) throw notFoundError()
//if (!resultPost.ticketTypeId) throw invalidDataError('ticketTypeId não foi enviado')

 return resultPost

//PULEI A DE POST
} 

async function getTickets(userId: number) {
  const resultFindEnrollmentUser = await ticketsRepository.userWithoutEnrollment(userId);
  if(!resultFindEnrollmentUser) throw notFoundError()
  
  const resultFindTicketUser = await ticketsRepository.userHasEnrollButNotTicket(resultFindEnrollmentUser.id);
  if(!resultFindTicketUser) throw notFoundError()


  return resultFindTicketUser
} 

const ticketsService = {
  getTicketsType,
  postTickets,
  getTickets
}

export default ticketsService;