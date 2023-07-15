import { Request, Response } from "express";
import { Event } from "../entities/Event";
import { Booking } from "../entities/Booking";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({
      relations: {
        bookings: true
      }
    });
    return res.json(events);
  } catch (error) {
    if(error instanceof Error){
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findOne({ 
      where: {
        id: parseInt(id)
      },
      relations: {
        bookings: true
      } 
    });
    if(!event){
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json(event);
  } catch (error) {
    if(error instanceof Error){
      return res.status(500).json({ message: error.message });
    }
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { nombre, descripcion, lugar, fechaHora, gps, precio, limite, tipoEvento, bookings } = req.body;
  
  const arrayBookings: Booking[] = [];

  for(let i = 0 ; i < arrayBookings.length; i++){
    const element = bookings[i];
    const bookingElement = new Booking();
    bookingElement.idEvent = element.idEvent;
    bookingElement.idUser = element.edUser;
    bookingElement.precio = element.precio;
    bookingElement.fechaHora = element.fechaHora;
    bookingElement.lugar = element.lugar;
    bookingElement.gps = element.gps;
    await bookingElement.save();
    arrayBookings.push(bookingElement);
  }
  
  const newEvent = new Event();
  newEvent.nombre = nombre;
  newEvent.descripcion = descripcion;
  newEvent.lugar = lugar;
  newEvent.fechaHora = new Date(fechaHora);
  newEvent.gps = gps;
  newEvent.precio = precio;
  newEvent.limite = limite;
  newEvent.tipoEvento = tipoEvento;
  newEvent.bookings = arrayBookings;
  await newEvent.save();
  return res.sendStatus(201);
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await Event.findOneBy({ id: parseInt(id) });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await Event.update({ id: parseInt(id) }, req.body);
    return res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Event.delete({ id: parseInt(id) });
    if(result.affected === 0){
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.sendStatus(202);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};