import { Router } from "express";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from "../controllers/event.controller";
import passport from "passport";


const router = Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', passport.authenticate('jwt', { session: false }), createEvent);
router.put('/events/:id', passport.authenticate('jwt', { session: false }), updateEvent);
router.delete('/events/:id', passport.authenticate('jwt', { session: false }), deleteEvent);

export default router;