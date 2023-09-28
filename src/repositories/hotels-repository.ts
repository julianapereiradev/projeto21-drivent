import { prisma } from '@/config';

async function findAllHotels() {
  return prisma.hotel.findMany();
}
async function findHotelId(id: number) {
  const result = await prisma.hotel.findUnique({
    where: { id },
    include: { Rooms: true },
  });

  return result;
}

export const hotelsRepository = {
  findAllHotels,
  findHotelId,
};
