import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelId, getHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelId);

export { hotelsRouter };
