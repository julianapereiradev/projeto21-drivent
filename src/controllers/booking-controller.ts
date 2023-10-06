import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { InputBookingBody } from '@/protocols';
import { bookingsService } from '@/services/booking-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const bookings = await bookingsService.getBookings(userId);

  res.status(httpStatus.OK).send(bookings);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as InputBookingBody;

  const booking = await bookingsService.createBooking(userId, roomId);
  return res.status(httpStatus.OK).send(booking);
}

export async function updateBookingId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const bookingId = parseInt(req.params.bookingId);
  const { roomId } = req.body as InputBookingBody;

  const bookingUpdate = await bookingsService.updateBooking(userId, bookingId, roomId);

  res.status(httpStatus.OK).send(bookingUpdate);
}
