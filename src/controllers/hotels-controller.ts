import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotels = await hotelsService.getHotels(userId);
  res.status(httpStatus.OK).send(hotels);
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  const hotelRooms = await hotelsService.getHotelId(userId, hotelId);
  res.status(httpStatus.OK).send(hotelRooms);
}
