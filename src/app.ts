import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from "./routes/user.router";
import eventRoutes from "./routes/event.router";
import bookingRoutes from "./routes/booking.router";
import passportMiddleware from './middlewares/passport';
import passport from 'passport'
import passportLocal from "passport-local";

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
passport.use(passportMiddleware);

app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", bookingRoutes);

export default app;