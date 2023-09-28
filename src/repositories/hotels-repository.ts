import { prisma } from '@/config';

async function findAllHotels() {
  return prisma.hotel.findMany();
}
async function findHotelId() {

  }

export const hotelsRepository = {
  findAllHotels,
  findHotelId
};
