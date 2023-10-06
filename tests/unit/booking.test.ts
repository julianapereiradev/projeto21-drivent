import { bookingsRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingsService } from '@/services/booking-service';
import { createBooking } from '../factories/booking-factory';
import { Address, Booking, Enrollment, Room, Ticket, TicketStatus, TicketType } from '@prisma/client';
import faker from '@faker-js/faker';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it('should return 404 when user doesnt have a booking', async () => {
    jest.spyOn(bookingsRepository, 'findBookings').mockResolvedValueOnce(null);

    const promise = bookingsService.getBookings(4);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return getBooking data', async () => {
    const mockBooking: Booking & {
      Room: Room;
    } = {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        capacity: 2,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: faker.name.firstName(),
      },
    };

    jest.spyOn(bookingsRepository, 'findBookings').mockResolvedValueOnce(mockBooking);
    const bookData = await bookingsService.getBookings(mockBooking.userId);
    expect(bookData).toEqual({
      id: mockBooking.id,
      Room: {
        id: mockBooking.Room.id,
        capacity: mockBooking.Room.capacity,
        hotelId: mockBooking.Room.hotelId,
        name: mockBooking.Room.name,
        createdAt: mockBooking.Room.createdAt,
        updatedAt: mockBooking.Room.updatedAt,
      },
    });
  });
});

describe('POST /booking', () => {
  it('should return 403 when ticket status is not PAID', async () => {
    const mockEnrollmentId: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicketUser: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollmentId.id,
      status: TicketStatus.RESERVED,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCreateBooking = {
      userId: 1,
      roomId: 1,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollmentId);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicketUser);

    const promise = bookingsService.createBooking(mockCreateBooking.userId, mockCreateBooking.roomId);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Cannot do this action 403!',
    });
  });

  it('should return 403 when ticket type.isRemote = true', async () => {
    const mockEnrollmentId: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicketUser: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollmentId.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: true,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCreateBooking = {
      userId: 1,
      roomId: 1,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollmentId);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicketUser);

    const promise = bookingsService.createBooking(mockCreateBooking.userId, mockCreateBooking.roomId);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Cannot do this action 403!',
    });
  });

  it('should return 403 when ticket type.includesHotel = false', async () => {
    const mockEnrollmentId: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicketUser: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollmentId.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCreateBooking = {
      userId: 1,
      roomId: 1,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollmentId);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicketUser);

    const promise = bookingsService.createBooking(mockCreateBooking.userId, mockCreateBooking.roomId);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Cannot do this action 403!',
    });
  });

  it('should return 404 when roomId doesnt exist', async () => {
    const mockEnrollmentId: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicketUser: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollmentId.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCreateBooking = {
      userId: mockEnrollmentId.userId,
      roomId: 1,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollmentId);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicketUser);
    jest.spyOn(bookingsRepository, 'checkingRoomId').mockResolvedValueOnce(null);

    const promise = bookingsService.createBooking(mockCreateBooking.userId, mockCreateBooking.roomId);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return 403 when room.capacity is full', async () => {
    const mockEnrollmentId: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicketUser: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollmentId.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCreateRoom: Room & {
      Booking: Booking[];
    } = {
      id: 1,
      name: faker.commerce.productName(),
      capacity: 0,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [],
    };
    
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollmentId);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicketUser);
    jest.spyOn(bookingsRepository, 'checkingRoomId').mockResolvedValueOnce(mockCreateRoom);

    const promise = bookingsService.createBooking(mockEnrollmentId.userId, mockCreateRoom.id);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Cannot do this action 403!',
    });
  });

  it('should createBooking sucess', async () => {
    const mockEnrollmentId: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: faker.name.lastName(),
      birthday: new Date(),
      phone: faker.finance.account(),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.direction(),
          addressDetail: faker.address.streetAddress() || null,
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const mockTicketUser: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: mockEnrollmentId.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.jobTitle(),
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockCreateRoom: Room & {
      Booking: Booking[];
    } = {
      id: 1,
      name: faker.commerce.productName(),
      capacity: 2,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [],
    };

    const mockCreateBook: Booking & {
      Room: Room;
  } = {
    id: 1,
    userId: mockEnrollmentId.userId,
    roomId: mockCreateRoom.id,
    createdAt: new Date (),
    updatedAt: new Date (),
    Room: 
      {
        id: mockCreateRoom.id,
        name: mockCreateRoom.name,
        hotelId: mockCreateRoom.hotelId,
        createdAt: mockCreateRoom.createdAt,
        capacity: mockCreateRoom.capacity,
        updatedAt: mockCreateRoom.updatedAt
      }
  }
    
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollmentId);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicketUser);
    jest.spyOn(bookingsRepository, 'checkingRoomId').mockResolvedValueOnce(mockCreateRoom);
    jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(mockCreateBook);

    const promise = await bookingsService.createBooking(mockEnrollmentId.userId, mockCreateRoom.id);
    expect(promise).toEqual({
      bookingId: mockCreateBook.id,
      Room: mockCreateBook.Room
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should return 403 when user doesnt have a booking', async () => {
    jest.spyOn(bookingsRepository, 'findBookings').mockResolvedValueOnce(null);

    const mockUpdateInput = {
      userId: 4,
      bookingId: 1,
      roomId: 4
    }

    const promise = bookingsService.updateBooking(mockUpdateInput.userId, mockUpdateInput.bookingId, mockUpdateInput.roomId);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Cannot do this action 403!',
    });
  });
});