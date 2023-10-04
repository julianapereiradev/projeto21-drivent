import { prisma } from '@/config';
import { CreateBookingParams } from '@/protocols';


async function checkingRoomId(roomId: number) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  
  return room;
}

async function createBooking(booking: CreateBookingParams) {
  const result = await prisma.booking.create({
    data: booking,
    include: { Room: true },
  });

  return result;
}

async function changingCapacityRoom(roomId: number, newCapacity: number) {
  const room = await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      capacity: newCapacity,
    },
  });
  
  return room;
}

async function findBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId
    },
    include: { Room: true}
  });
}

export const bookingsRepository = {
  checkingRoomId,
  createBooking,
  changingCapacityRoom,
  findBookings
};
