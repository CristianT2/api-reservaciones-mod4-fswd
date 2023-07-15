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
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const Event_1 = require("../entities/Event");
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.Event.find();
        return res.json(events);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.getEvents = getEvents;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield Event_1.Event.findOneBy({ id: parseInt(id) });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        return res.json(event);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.getEventById = getEventById;
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, descripcion, lugar, fechaHora, gps, precio, limite, tipoEvento } = req.body;
    const newEvent = new Event_1.Event();
    newEvent.nombre = nombre;
    newEvent.descripcion = descripcion;
    newEvent.lugar = lugar;
    newEvent.fechaHora = fechaHora;
    newEvent.gps = gps;
    newEvent.precio = precio;
    newEvent.limite = limite;
    newEvent.tipoEvento = tipoEvento;
    yield newEvent.save();
    return res.sendStatus(201).json(newEvent);
});
exports.createEvent = createEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield Event_1.Event.findOneBy({ id: parseInt(id) });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        yield Event_1.Event.update({ id: parseInt(id) }, req.body);
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield Event_1.Event.delete({ id: parseInt(id) });
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        return res.sendStatus(202);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.deleteEvent = deleteEvent;
