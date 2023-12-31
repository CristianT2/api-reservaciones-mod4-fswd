import { Request, Response } from "express";
import { User } from "../entities/User";
import { Event } from "../entities/Event";
import { Booking } from "../entities/Booking";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = 'somesecrettoken';
const jwtRefreshTokenSecret = 'somesecrettokenrefresh';
let refreshTokens: (string | undefined)[] = [];


const createToken = (user: User) => {
  // Se crean el jwt y refresh token
  const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '30m' });
  const refreshToken = jwt.sign({ username: user.username }, jwtRefreshTokenSecret, { expiresIn: '90d' });
  refreshTokens.push(refreshToken);
  return { token, refreshToken };
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your username and password" });
  }
  const user = await User.findOneBy({ username: req.body.username });
  if (user) {
    return res.status(400).json({ msg: "The User already Exists" });
  }
  const newUser = new User();
  newUser.username = req.body.username;
  newUser.password = await createHash(req.body.password);
  await newUser.save();
  return res.status(201).json(newUser);
};

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your username and password" });
  }
  const user = await User.findOneBy({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }
  const isMatch = await comparePassword(user, req.body.password);
  if (isMatch) {
    return res.status(400).json({ credentials: createToken(user) });
  }
  return res.status(400).json({
    msg: "The username or password are incorrect"
  });
};

export const protectedEndpoint = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({ msg: 'ok' });
};

const comparePassword = async (user: User, password: string): Promise<Boolean> => {
  return await bcrypt.compare(password, user.password);
};

const createHash = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Create new access token from refresh token
export const refresh = async (req: Request, res: Response): Promise<any> => {
  const refreshToken = req.body.refresh;
  // If token is not provided, send error message
  if (!refreshToken) {
    res.status(401).json({
      errors: [{ msg: "Token not found", },],
    });
  }
  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({
      errors: [{ msg: "Invalid refresh token", },],
    });
  }
  try {
    const user = jwt.verify(refreshToken, jwtRefreshTokenSecret);
    // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
    const { username } = <any>user;
    const userFound = <User>await User.findOneBy({ username: username });
    if (!user) {
      return res.status(400).json({ msg: "The User does not exists" });
    }
    const accessToken = jwt.sign({ id: userFound.id, username: userFound.username }, jwtSecret, { expiresIn: '120s' });
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({
      errors: [{ msg: "Invalid token", },],
    });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      relations: {
        bookings: true,
        events: true
      }
    });
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id: parseInt(id) 
      },
      relations: {
        events: true,
        bookings: true
      }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, events, bookings } = req.body;
  const arrayEvents: Event[] = [];
  const arrayBookings: Booking[] = [];

  for(let i = 0; i < arrayEvents.length; i++){
    const element = events[i];
    const eventElement = new Event;
    eventElement.nombre = element.nombre;
    eventElement.descripcion = element.descripcion;
    eventElement.lugar = element.lugar;
    eventElement.fechaHora =  element.fechaHora;
    eventElement.gps = element.gps;
    eventElement.precio = element.precio;
    eventElement.limite = element.limite;
    eventElement.tipoEvento = element.tipoEvento;
    await eventElement.save();
    arrayEvents.push(eventElement);
  }

  for(let i = 0; i < arrayBookings.length; i++){
    const element = bookings[i];
    const bookingElement = new Booking();
    bookingElement.idEvent = element.idEvent;
    bookingElement.idUser = element.idUser;
    bookingElement.precio = element.precio;
    bookingElement.fechaHora = element.fechaHora;
    bookingElement.lugar = element.lugar;
    bookingElement.gps = element.gps;
    await bookingElement.save();
    arrayBookings.push(bookingElement);
  }

  const user = new User();
  user.username = username;
  user.password = await createHash(req.body.password);
  user.events = arrayEvents;
  user.bookings = arrayBookings;
  await user.save();

  return res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOneBy({ id: parseInt(id) });
    if (!user) {
      return res.status(404).json({ message: "Not user found" });
    }
    await User.update({ id: parseInt(id) }, req.body);
    return res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await User.delete({ id: parseInt(id) });
    if (result.affected === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.sendStatus(202);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
