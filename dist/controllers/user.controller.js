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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = exports.refresh = exports.protectedEndpoint = exports.signIn = exports.signUp = void 0;
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = 'somesecrettoken';
const jwtRefreshTokenSecret = 'somesecrettokenrefresh';
let refreshTokens = [];
const createToken = (user) => {
    // Se crean el jwt y refresh token
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '10m' });
    const refreshToken = jsonwebtoken_1.default.sign({ username: user.username }, jwtRefreshTokenSecret, { expiresIn: '90d' });
    refreshTokens.push(refreshToken);
    return { token, refreshToken };
};
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ msg: "Please. Send your username and password" });
    }
    const user = yield User_1.User.findOneBy({ username: req.body.username });
    if (user) {
        return res.status(400).json({ msg: "The User already Exists" });
    }
    const newUser = new User_1.User();
    newUser.username = req.body.username;
    newUser.password = yield createHash(req.body.password);
    ;
    yield newUser.save();
    return res.status(201).json(newUser);
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ msg: "Please. Send your username and password" });
    }
    const user = yield User_1.User.findOneBy({ username: req.body.username });
    if (!user) {
        return res.status(400).json({ msg: "The User does not exists" });
    }
    const isMatch = yield comparePassword(user, req.body.password);
    if (isMatch) {
        return res.status(400).json({ credentials: createToken(user) });
    }
    return res.status(400).json({
        msg: "The username or password are incorrect"
    });
});
exports.signIn = signIn;
const protectedEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ msg: 'ok' });
});
exports.protectedEndpoint = protectedEndpoint;
const comparePassword = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, user.password);
});
const createHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return yield bcrypt_1.default.hash(password, saltRounds);
});
// Create new access token from refresh token
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = jsonwebtoken_1.default.verify(refreshToken, jwtRefreshTokenSecret);
        // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
        const { username } = user;
        const userFound = yield User_1.User.findOneBy({ username: username });
        if (!user) {
            return res.status(400).json({ msg: "The User does not exists" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: userFound.id, username: userFound.username }, jwtSecret, { expiresIn: '120s' });
        res.json({ accessToken });
    }
    catch (error) {
        res.status(403).json({
            errors: [{ msg: "Invalid token", },],
        });
    }
});
exports.refresh = refresh;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find();
        return res.json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.User.findOneBy({ id: parseInt(id) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = new User_1.User();
    user.username = username;
    user.password = password;
    yield user.save();
    return res.sendStatus(201).json(user);
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.User.findOneBy({ id: parseInt(id) });
        if (!user) {
            return res.status(404).json({ message: "Not user found" });
        }
        yield User_1.User.update({ id: parseInt(id) }, req.body);
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield User_1.User.delete({ id: parseInt(id) });
        if (result.affected === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.sendStatus(202);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.deleteUser = deleteUser;
