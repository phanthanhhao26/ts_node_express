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
exports.ADMIN_DATA = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../lib/logger"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const password_1 = require("../utils/password");
const user = prisma_1.default.user;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN;
exports.ADMIN_DATA = {
    login: ADMIN_LOGIN,
    email: ADMIN_EMAIL,
    fullName: ADMIN_LOGIN,
    isConfirmed: true,
    role: client_1.UserRole.admin,
};
const Admin = {
    createIfNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield user.findUnique({
                where: {
                    email: ADMIN_EMAIL,
                },
            });
            if (exists) {
                return;
            }
            const password = yield (0, password_1.hashPassword)(ADMIN_PASSWORD);
            const data = Object.assign(Object.assign({}, exports.ADMIN_DATA), { password });
            yield user.create({ data });
            logger_1.default.info('An admin was created with provided credentials.');
        });
    },
};
exports.default = Admin;
