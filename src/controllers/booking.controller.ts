import { Request, Response } from "express";
import { Booking } from "../entities/Booking";
import { Event } from "../entities/Event";
import { User } from "../entities/User";

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({
      relations: {
        user: true,
        event: true
      }
    });
    return res.json(bookings);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      where: {
        id: parseInt(id)
      },
      relations: {
        user: true,
        event: true
      }
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.json(booking);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const { idEvent, idUser, precio, fechaHora, lugar, gps } = req.body;


  const evento = await Event.findOne({
    where: {
      id: parseInt(idEvent)
    },
    relations: {
      bookings: true,
    }
  });

  const user = await User.findOne({
    where: {
      id: parseInt(idUser)
    }
  });

  if (!evento) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const newBooking = new Booking();
  newBooking.idEvent = idEvent;
  newBooking.idUser = idUser;
  newBooking.precio = evento.precio;
  newBooking.fechaHora = evento.fechaHora;
  newBooking.lugar = evento.lugar;
  newBooking.gps = evento.gps;
  newBooking.user = idUser;
  newBooking.event = idEvent;

  if (evento.limite <= evento.bookings.length) {
    return res.status(400).json({ message: 'El evento ha alcanzado la cantidad maxima de reservaciones' })
  }

  await newBooking.save();
  return res.sendStatus(201);
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { idEvent, idUser } = req.body
    const booking = await Booking.findOne({
      where: {
        id: parseInt(id)
      },
      relations: {
        user: true,
        event: true
      }
    });

    const evento = await Event.findOne({
      where: {
        id: parseInt(idEvent)
      },
      relations: {
        bookings: true
      }
    });

    const user = await User.findOne({
      where: {
        id: parseInt(idUser)
      }
    });

    if (!evento) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    booking.idEvent = idEvent;
    booking.idUser = idUser;
    booking.precio = evento.precio;
    booking.fechaHora = evento.fechaHora;
    booking.lugar = evento.lugar;
    booking.gps = evento.gps;
    booking.user = idUser;
    booking.event = idEvent;

    if (evento.limite <= evento.bookings.length) {
      return res.status(400).json({ message: 'El evento ha alcanzado la cantidad maxima de reservaciones' })
    }

    await booking.save();
    return res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Booking.delete({ id: parseInt(id) });
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.sendStatus(202);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
