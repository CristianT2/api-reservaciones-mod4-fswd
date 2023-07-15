"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBooking = exports.createBooking = exports.getBookingById = exports.getBookings = void 0;
const Booking_1 = require("../entities/Booking");
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield Booking_1.Booking.find();
        return res.json(bookings);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.getBookings = getBookings;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const booking = yield Booking_1.Booking.findOneBy({ id: parseInt(id) });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.json(booking);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.getBookingById = getBookingById;
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idEvent, idUser, precio, fechaHora, lugar, gps } = req.body;
    const newBooking = new Booking_1.Booking();
    newBooking.idEvent = idEvent;
    newBooking.idUser = idUser;
    newBooking.precio = precio;
    newBooking.fechaHora = fechaHora;
    newBooking.lugar = lugar;
    newBooking.gps = gps;
    yield newBooking.save();
    return res.sendStatus(201).json(newBooking);
});
exports.createBooking = createBooking;
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const booking = yield Booking_1.Booking.findOneBy({ id: parseInt(id) });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        yield Booking_1.Booking.update({ id: parseInt(id) }, req.body);
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.updateBooking = updateBooking;
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield Booking_1.Booking.delete({ id: parseInt(id) });
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.sendStatus(202);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.deleteBooking = deleteBooking;
