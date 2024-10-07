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
exports.getEventDate = void 0;
const default_1 = require("../consts/default");
const logger_1 = __importDefault(require("../lib/logger"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const query_options_1 = require("../utils/query-options");
const event = prisma_1.default.event;
const eventFormat = prisma_1.default.eventFormat;
const eventTheme = prisma_1.default.eventTheme;
const convertQueryParamToNumArr = (param) => {
    return Array.isArray(param) ? param.map((item) => Number(item)) : [Number(param)];
};
const getEventDate = (initialDate) => {
    const date = new Date(initialDate);
    return new Intl.DateTimeFormat('en-US', default_1.DateFormatOptions).format(date);
};
exports.getEventDate = getEventDate;
const EventService = {
    findEventIfExists(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield event.findUniqueOrThrow({
                    where: { id: eventId },
                    include: { format: true, theme: true },
                });
            }
            catch (_e) {
                throw new error_1.default("The event doesn't exist!", 404);
            }
        });
    },
    isUsersQueryAllowed(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = yield event.findFirst({
                where: {
                    id: eventId,
                    OR: [
                        {
                            visitors: {
                                some: {
                                    userId: userId || -1,
                                },
                            },
                        },
                        { isPublic: true },
                    ],
                },
            });
            const isAllowed = e !== null;
            !isAllowed && logger_1.default.warn("You are not allowed to view the event's visitors");
            return isAllowed;
        });
    },
    checkUniqueEventName(name, notId = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield event.findFirst({
                where: {
                    name,
                    NOT: {
                        id: notId,
                    },
                },
            });
            if (exists) {
                throw new error_1.default('The event with this name already exists.', 400);
            }
        });
    },
    checkEventFormatExists(formatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield eventFormat.findUniqueOrThrow({ where: { id: formatId } });
            }
            catch (_e) {
                throw new error_1.default("The event format doesn't exist!", 400);
            }
        });
    },
    checkEventThemeExists(themeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield eventTheme.findUniqueOrThrow({ where: { id: themeId } });
            }
            catch (_e) {
                throw new error_1.default("The event theme doesn't exist!", 400);
            }
        });
    },
    getEventsSortOptions(params, defaultSort) {
        const { _sort, _order } = params;
        const relationProperties = ['theme', 'format'];
        if (!_sort || !_order) {
            return (0, query_options_1.DEFAULT_SORT_OPTIONS)(defaultSort);
        }
        if (relationProperties.includes(_sort)) {
            return {
                orderBy: {
                    [_sort]: {
                        name: _order.toLowerCase(),
                    },
                },
            };
        }
        return (0, query_options_1.getSortOptions)(params, defaultSort);
    },
    getEventsWhereOptions(queryParams) {
        const where = {};
        const { userId, id, companyId, themeId, formatId, q, upcoming, dateFrom, dateTo, notPublished, } = queryParams;
        if (id) {
            where.id = { in: convertQueryParamToNumArr(id) };
        }
        if (companyId) {
            where.companyId = Number(companyId);
        }
        if (formatId) {
            where.formatId = Number(formatId);
        }
        if (themeId) {
            where.themeId = Number(themeId);
        }
        if (userId) {
            where.visitors = {
                some: { userId: Number(userId) },
            };
        }
        if (q) {
            where.name = { contains: q };
        }
        if ((dateFrom && dateTo) || upcoming) {
            where.publishDate = {
                lte: new Date().toISOString(),
            };
        }
        if (dateFrom && dateTo) {
            where.date = {
                gte: new Date(dateFrom).toISOString(),
                lte: new Date(dateTo).toISOString(),
            };
        }
        else if (upcoming) {
            where.date = { gte: new Date().toISOString() };
        }
        if (notPublished) {
            where.publishDate = {
                gte: new Date().toISOString(),
            };
        }
        return where;
    },
};
exports.default = EventService;
