import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).send(hotels);
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
 
}
