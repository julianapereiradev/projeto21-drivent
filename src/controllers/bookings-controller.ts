import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { InputBookingBody } from '@/protocols';
import { bookingsService } from '@/services/bookings-service';


export async function getBookings(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const bookings = await bookingsService.getBookings(userId);

    res.status(httpStatus.OK).send({
        "id": bookings.id,
        "Room": bookings.Room
    });
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBookingBody;
  
    const { id }= await bookingsService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send({
        "bookingId": id
    });

}


export async function updateBookingId(req: AuthenticatedRequest, res: Response) {

}
