import { TicketStatus } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import { bookingsRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

async function createBooking(userId: number, roomId: number) {
  
  await businessRules(userId) //fora da regra de negócio
  await checkCapacityRoom(roomId) //roomId não existe //roomId sem vaga

    const bookings = await bookingsRepository.createBooking(userId, roomId)
  
    const createBooking = {
      bookingId: bookings.id,
      Room: bookings.Room
    }

    return createBooking;
}

async function getBookings(userId: number) {
  
    const bookings = await bookingsRepository.findBookings(userId);
    if (!bookings) throw notFoundError(); //usuário não tem reserva
  
    const getBooking = {
      "id": bookings.id,
      "Room": bookings.Room
    };

    return getBooking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  const userBooking = await bookingsRepository.findBookings(userId);
  if(!userBooking) throw forbiddenError(); //usuário não tem reserva
  await checkCapacityRoom(roomId);  //roomId não existe //roomId sem vaga

  const booking = await bookingsRepository.updateBooking(bookingId, roomId);

  const putBooking = {
    "bookingId": booking.id,
    "Room": booking.Room
  };

  return putBooking;
}

//Funções Secundárias

async function businessRules(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw notFoundError();
  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
      throw forbiddenError();
  }
}

async function checkCapacityRoom(roomId: number) {
  const room = await bookingsRepository.checkingRoomId(roomId);
  if(!room) throw notFoundError();
  if(!room || room.capacity === room.Booking.length) throw forbiddenError();
}

export const bookingsService = {
  createBooking,
  getBookings,
  updateBooking
};
