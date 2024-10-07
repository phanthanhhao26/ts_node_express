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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendPasswordConfirmation = exports.logout = exports.refresh = exports.login = exports.confirmEmail = exports.register = void 0;
const default_1 = require("../consts/default");
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const password_1 = require("../utils/password");
const services_1 = require("../services");
const email_1 = __importDefault(require("../consts/email"));
const user_1 = __importDefault(require("../services/user"));
const user = prisma_1.default.user;
const generateUserTokens = ({ id, email, login }) => {
    const accessToken = services_1.Token.generate({ id, email, login });
    const refreshToken = services_1.Token.generate({ id }, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = yield user_1.default.create(data);
    res.json({ id });
});
exports.register = register;
const confirmEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const data = services_1.Token.validate(token);
    if (!data || typeof data === 'string' || !data.id) {
        throw new error_1.default('The confirm token is invalid or has expired.', 403);
    }
    const found = yield user.findUnique({ where: { id: data.id } });
    if (!found) {
        throw new error_1.default('The confirm token is invalid or has expired.', 403);
    }
    yield user.update({
        where: { id: Number(data.id) },
        data: { isConfirmed: true },
    });
    res.status(200).send();
});
exports.confirmEmail = confirmEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password } = req.body;
    const found = yield user.findUnique({ where: { login } });
    console.log(found);
    if (!found) {
        throw new error_1.default('Wrong login and/or password.', 400);
    }
    const isAuthorized = yield (0, password_1.comparePasswords)(password, found.password);
    if (!isAuthorized) {
        throw new error_1.default('Wrong login and/or password.', 400);
    }
    if (!found.isConfirmed) {
        throw new error_1.default('Please confirm your email.', 403);
    }
    const { accessToken, refreshToken } = generateUserTokens(found);
    res.cookie('refreshToken', refreshToken, default_1.COOKIE_OPTIONS);
    const { password: p } = found, toSend = __rest(found, ["password"]);
    res.json(Object.assign({ accessToken }, toSend));
});
exports.login = login;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken: token } = req.cookies;
    const data = services_1.Token.validate(token);
    if (!data || typeof data === 'string' || !data.id) {
        throw new error_1.default('The refresh token is invalid.', 403);
    }
    const found = yield user.findUnique({ where: { id: data.id } });
    if (!found) {
        throw new error_1.default('No user found', 404);
    }
    const { accessToken, refreshToken } = generateUserTokens(found);
    res.cookie('refreshToken', refreshToken, default_1.COOKIE_OPTIONS);
    res.json({ accessToken });
});
exports.refresh = refresh;
const logout = (_req, res) => {
    res.clearCookie('refreshToken');
    res.sendStatus(204);
};
exports.logout = logout;
const sendPasswordConfirmation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const found = yield user.findUnique({ where: { email } });
    if (!found) {
        throw new error_1.default('No user with this email found', 404);
    }
    const { id, login } = found;
    const token = services_1.Token.generateConfirmToken({ id });
    yield services_1.Email.sendMail(email, email_1.default.PASSWORD_CONFIRM, { login, token });
    res.status(200).send();
});
exports.sendPasswordConfirmation = sendPasswordConfirmation;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    let { password } = req.body;
    const data = services_1.Token.validate(token);
    if (!data || typeof data === 'string' || !data.id) {
        throw new error_1.default('The confirm token is invalid or has expired.', 403);
    }
    const found = yield user.findUnique({ where: { id: data.id } });
    if (!found) {
        throw new error_1.default('The confirm token is invalid or has expired.', 403);
    }
    password = yield (0, password_1.hashPassword)(password);
    yield user.update({
        where: { id: Number(data.id) },
        data: { password },
    });
    res.status(200).send();
});
exports.resetPassword = resetPassword;
