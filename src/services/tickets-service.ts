import { ticketsRepository } from "@/repositories/tickets-repository";

async function getTicketsType() {
  const tickets = await ticketsRepository.getTicketsType();
  return tickets;
}


const ticketsService = {
  getTicketsType
}

export default ticketsService;