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
const email_1 = __importDefault(require("../consts/email"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const password_1 = require("../utils/password");
const avatar_1 = __importDefault(require("./avatar"));
const email_2 = __importDefault(require("./email"));
const event_1 = __importDefault(require("./event"));
const token_1 = __importDefault(require("./token"));
const user = prisma_1.default.user;
const UserService = {
    checkFor(key, value, id = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield user.findFirst({
                where: {
                    [key]: value,
                    NOT: { id },
                },
            });
            if (exists) {
                throw new error_1.default(`The user with this ${key} already exists.`, 400);
            }
        });
    },
    findOrThrow(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield user.findUnique({ where: { id } });
            if (!found) {
                throw new error_1.default('This user does not exist', 404);
            }
            return found;
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserService.checkFor('login', data.login);
            yield UserService.checkFor('email', data.email);
            console.log('pass hereeeee');
            const password = yield (0, password_1.hashPassword)(data.password);
            const { id } = yield user.create({
                data: Object.assign(Object.assign({}, data), { password }),
            });
            const { email, login } = data;
            const token = token_1.default.generateConfirmToken({ id });
            yield email_2.default.sendMail(email, email_1.default.EMAIL_CONFIRM, { login, token });
            return { id };
        });
    },
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.login) {
                yield UserService.checkFor('login', data.login, id);
            }
            if (data.email) {
                yield UserService.checkFor('email', data.email, id);
            }
            yield user.update({ where: { id }, data });
        });
    },
    updateAvatar(id, picturePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const toUpdate = yield this.findOrThrow(id);
            yield avatar_1.default.removeFrom(toUpdate);
            yield user.update({ data: { picturePath }, where: { id } });
        });
    },
    deleteAvatar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const toUpdate = yield this.findOrThrow(id);
            yield avatar_1.default.removeFrom(toUpdate);
            yield user.update({ data: { picturePath: null }, where: { id } });
        });
    },
    getWhereOptions(params, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { AND: [] };
            let isViewAllowed = true;
            if (!params) {
                return { where, isViewAllowed };
            }
            const { q, companyId, eventId } = params;
            if (q) {
                const { q } = params;
                Array.isArray(where.AND) &&
                    where.AND.push({
                        OR: [
                            {
                                login: { contains: q },
                            },
                            {
                                email: { contains: q },
                            },
                        ],
                    });
            }
            if (companyId) {
                Array.isArray(where.AND) &&
                    where.AND.push({
                        subscriptions: {
                            some: {
                                companyId: Number(companyId),
                            },
                        },
                    });
            }
            if (eventId) {
                isViewAllowed = yield event_1.default.isUsersQueryAllowed(Number(eventId), userId);
                isViewAllowed &&
                    Array.isArray(where.AND) &&
                    where.AND.push({
                        events: {
                            some: {
                                eventId: Number(eventId),
                                isVisible: true,
                            },
                        },
                    });
            }
            return { where, isViewAllowed };
        });
    },
};
exports.default = UserService;
