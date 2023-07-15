import { Router } from "express";
import { 
    createUser, 
    deleteUser, 
    getUser, 
    getUsers, 
    updateUser 
} from "../controllers/user.controller";
import {signIn, signUp, protectedEndpoint, refresh } from '../controllers/user.controller'
import passport from 'passport';

const router = Router();

router.get("/users", passport.authenticate('jwt', { session: false }), getUsers);
router.get("/users/:id", passport.authenticate('jwt', { session: false }), getUser);
router.post("/users", passport.authenticate('jwt', { session: false }), createUser);
router.put("/users/:id", passport.authenticate('jwt', { session: false }), updateUser);
router.delete("/users/:id", passport.authenticate('jwt', { session: false }), deleteUser);

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/token', refresh);
router.post('/protected', passport.authenticate('jwt', { session: false }), protectedEndpoint);



export default router;