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
exports.optionalAuth = void 0;
const error_1 = __importDefault(require("../types/error"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const services_1 = require("../services");
const user = prisma_1.default.user;
const authorizeUserOrThrow = (headers) => __awaiter(void 0, void 0, void 0, function* () {
    const header = headers.authorization;
    const token = header && header.split(' ')[1];
    const data = services_1.Token.validate(token);
    if (!data || typeof data === 'string' || !data.id) {
        throw new error_1.default('The access token is invalid or has expired.', 401);
    }
    const found = yield user.findUnique({
        where: { id: data.id },
    });
    if (!found) {
        throw new error_1.default('The access token is invalid or has expired.', 401);
    }
    return found;
});
const auth = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user = yield authorizeUserOrThrow(req.headers);
        next();
    }
    catch (err) {
        return next(err);
    }
});
const optionalAuth = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user = yield authorizeUserOrThrow(req.headers);
        next();
    }
    catch (err) {
        if (err) {
            return next();
        }
        next(err);
    }
});
exports.optionalAuth = optionalAuth;
exports.default = auth;
