import { Router } from "express";
import { createBooking, deleteBooking, getBookingById, getBookings, updateBooking } from "../controllers/booking.controller";
import passport from "passport";

const router = Router();

router.get('/bookings', passport.authenticate('jwt', { session: false }), getBookings);
router.get('/bookings/:id', passport.authenticate('jwt', { session: false }), getBookingById);
router.post('/bookings', passport.authenticate('jwt', { session: false }), createBooking);
router.put('/bookings/:id', passport.authenticate('jwt', { session: false }), updateBooking);
router.delete('/bookings/:id', passport.authenticate('jwt', { session: false }), deleteBooking);

export default router;