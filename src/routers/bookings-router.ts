import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getBookings, postBooking, updateBookingId } from '@/controllers/bookings-controller';
import { bookingsSchema } from '@/schemas/bookings-schema';

const bookingsRouter = Router();

bookingsRouter
.all('/*', authenticateToken)
.get('/', getBookings)
.post('/', validateBody(bookingsSchema), postBooking)
.put('/:bookingId', validateBody(bookingsSchema), updateBookingId)

export { bookingsRouter };
