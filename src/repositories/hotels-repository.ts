import { prisma } from '@/config';

async function findHotels() {
  const result = await prisma;
  return result;
}

async function findHotelId() {

  }

export const ticketsRepository = {
  findHotels,
  findHotelId
};
