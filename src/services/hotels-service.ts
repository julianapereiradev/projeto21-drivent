import { PaymentRequired, notFoundError } from "@/errors";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { hotelsRepository } from "@/repositories/hotels-repository";


async function getHotels(userId: number,) {
    //Retorno para usuário sem cadastro/inscrição: Se não existe inscrição
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    //Retorno para usuário sem ingresso: Se não existe ticket 
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    //Retorna 402 se ticket não foi pago, é remoto ou não inclui hotel 
    if(ticket.status !== "PAID" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) throw PaymentRequired() 

    //Retorno se não existe hotel
    const hotels = await hotelsRepository.findAllHotels();
    if (!hotels || hotels.length === 0) throw notFoundError();

    return hotels
}

async function getHotelId(userId: number, hotelId: number) {
     //Retorno para usuário sem cadastro/inscrição: Se não existe inscrição
     const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
     if (!enrollment) throw notFoundError();
   
     //Retorno para usuário sem ingresso: Se não existe ticket 
     const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
     if (!ticket) throw notFoundError();
 
     //Retorna 402 se ticket não foi pago, é remoto ou não inclui hotel 
     if(ticket.status !== "PAID" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) throw PaymentRequired() 
 
     //Retorno se não existe hotel
     const hotels = await hotelsRepository.findAllHotels();
     if (!hotels || hotels.length === 0) throw notFoundError();
 
    const hotelRooms = await hotelsRepository.findHotelId(hotelId)
    return hotelRooms
}

export const hotelsService = {
    getHotels,
    getHotelId
};
