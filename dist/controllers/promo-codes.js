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
exports.deletePromoCode = exports.updatePromoCode = exports.createPromoCode = exports.getPromoCodeById = exports.getPromoCodes = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const client_1 = require("@prisma/client");
const query_options_1 = require("../utils/query-options");
const promoCode = prisma_1.default.promoCode;
const checkPromoCode = (code, eventId, notId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield promoCode.findFirst({
        where: {
            promoCode: code,
            eventId,
            NOT: {
                id: notId,
            },
        },
    });
    if (exists) {
        throw new error_1.default(`This promo code for the event already exists.`, 400);
    }
});
function getWhereOptions(queryParams, user) {
    let where = { AND: [] };
    if (!queryParams) {
        return where;
    }
    const { id, eventId, q } = queryParams;
    if (id) {
        let idNum = Array.isArray(id) ? id.map((item) => Number(item)) : [Number(id)];
        Array.isArray(where.AND) &&
            where.AND.push({
                id: { in: idNum },
            });
    }
    if (eventId) {
        Array.isArray(where.AND) &&
            where.AND.push({
                eventId: Number(eventId),
            });
    }
    if (q) {
        Array.isArray(where.AND) &&
            where.AND.push({
                promoCode: {
                    contains: q,
                },
            });
    }
    if (user.role !== client_1.UserRole.admin) {
        where = Object.assign(Object.assign({}, where), { event: {
                company: {
                    user: {
                        id: user.id,
                    },
                },
            } });
    }
    return where;
}
const getPromoCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const where = getWhereOptions(req.query, req.user);
    const [count, promoCodes] = yield prisma_1.default.$transaction([
        promoCode.count({ where }),
        promoCode.findMany(Object.assign(Object.assign({ where }, (0, query_options_1.getPageOptions)(req.query)), (0, query_options_1.getSortOptions)(req.query, 'id'))),
    ]);
    res.header('X-Total-Count', `${count}`).json(promoCodes);
});
exports.getPromoCodes = getPromoCodes;
const getPromoCodeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promoCodeId = Number(req.params.id);
    const found = yield promoCode.findFirst({
        where: {
            id: promoCodeId,
        },
    });
    if (!found) {
        throw new error_1.default('The promo code is not found.', 404);
    }
    res.json(found);
});
exports.getPromoCodeById = getPromoCodeById;
const createPromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield checkPromoCode(data.promoCode, data.eventId);
    const newPromoCode = yield promoCode.create({
        data,
    });
    res.status(201).json(newPromoCode);
});
exports.createPromoCode = createPromoCode;
const updatePromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const promoCodeId = Number(req.params.id);
    if (data.promoCode) {
        const found = yield promoCode.findFirst({
            where: {
                id: promoCodeId,
            },
        });
        if (!found) {
            throw new error_1.default('The promo code is not found.', 404);
        }
        yield checkPromoCode(data.promoCode, found.eventId, promoCodeId);
    }
    const updatedPromoCode = yield promoCode.update({
        where: {
            id: promoCodeId,
        },
        data,
    });
    res.status(201).json(updatedPromoCode);
});
exports.updatePromoCode = updatePromoCode;
const deletePromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield promoCode.delete({
        where: { id },
    });
    res.json({ id });
});
exports.deletePromoCode = deletePromoCode;
