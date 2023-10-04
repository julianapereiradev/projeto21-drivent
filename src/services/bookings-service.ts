import { TicketStatus } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import { CreateBookingParams } from '@/protocols';
import { bookingsRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

async function createBooking(userId: number, roomId: number) {
  
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    const type = ticket.TicketType;
  
    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
        throw forbiddenError();
    }

    const room = await bookingsRepository.checkingRoomId(roomId)
    if(!room) throw notFoundError()

    if(room.capacity <= 0) throw forbiddenError()

    const newCapacity = room.capacity - 1;

    const bookingData: CreateBookingParams = {
        roomId,
        userId
    };

    const createBookings = await bookingsRepository.createBooking(bookingData);
  
    await bookingsRepository.changingCapacityRoom(roomId, newCapacity)

    return createBookings;
}

async function getBookings(userId: number) {
  
    const bookingIdRoom = await bookingsRepository.findBookings(userId);
    if (!bookingIdRoom) throw notFoundError();
  
    return bookingIdRoom;
  }

export const bookingsService = {
  createBooking,
  getBookings
};
