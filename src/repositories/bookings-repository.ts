import { prisma } from '@/config';

async function checkingRoomId(roomId: number) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true
    }
  });
  
  return room;
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    },
    include: {
      Room: true
    }
  });
}


async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    },
    include: {
      Room: true
    }
  });
}

async function findBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      User: {
        id: userId,
      }
    },
    include: {
      Room: true
    }
  });
}


export const bookingsRepository = {
  checkingRoomId,
  createBooking,
  findBookings,
  updateBooking
};
