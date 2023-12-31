"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const user_controller_2 = require("../controllers/user.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get("users", user_controller_1.getUsers);
router.get("users/:id", user_controller_1.getUser);
router.post("users", user_controller_1.createUser);
router.put("users/:id", user_controller_1.updateUser);
router.delete("users/:id", user_controller_1.deleteUser);
router.post('/signup', user_controller_2.signUp);
router.post('/signin', user_controller_2.signIn);
router.post('/token', user_controller_2.refresh);
router.post('/protected', passport_1.default.authenticate('jwt', { session: false }), user_controller_2.protectedEndpoint);
exports.default = router;
