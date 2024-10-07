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
exports.checkUserPromoCodeRights = exports.checkUserCommentRights = exports.checkUserEventRights = exports.checkUserCompanyRights = void 0;
const error_1 = __importDefault(require("../types/error"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const company = prisma_1.default.company;
const event = prisma_1.default.event;
const comment = prisma_1.default.comment;
const promoCode = prisma_1.default.promoCode;
const checkUserCompanyRights = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.body.companyId || Number(req.params.id);
    const { id: userId, role } = req.user;
    const found = yield company.findUnique({
        where: { id: companyId },
    });
    if (!found) {
        return next(new error_1.default('The company is not found.', 404));
    }
    if (found.userId !== userId && role !== client_1.UserRole.admin) {
        return next(new error_1.default('Forbidden action', 403));
    }
    next();
});
exports.checkUserCompanyRights = checkUserCompanyRights;
const checkUserEventRights = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.body.eventId || Number(req.params.id);
    const { id: userId, role } = req.user;
    let found = yield event.findUnique({
        where: { id: eventId },
    });
    if (!found) {
        return next(new error_1.default('The event is not found.', 404));
    }
    if (role !== client_1.UserRole.admin) {
        found = yield event.findFirst({
            where: {
                id: eventId,
                company: {
                    user: {
                        id: userId,
                    },
                },
            },
        });
        if (!found) {
            return next(new error_1.default('Forbidden action', 403));
        }
    }
    next();
});
exports.checkUserEventRights = checkUserEventRights;
const checkUserCommentRights = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = Number(req.params.id);
    const { id: userId, role } = req.user;
    const found = yield comment.findUnique({
        where: { id: commentId },
    });
    if (!found) {
        return next(new error_1.default('The comment is not found.', 404));
    }
    if (found.userId !== userId && role !== client_1.UserRole.admin) {
        return next(new error_1.default('Forbidden action', 403));
    }
    next();
});
exports.checkUserCommentRights = checkUserCommentRights;
const checkUserPromoCodeRights = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const promoCodeId = Number(req.params.id);
    const { id: userId, role } = req.user;
    let found = yield promoCode.findUnique({
        where: { id: promoCodeId },
    });
    if (!found) {
        return next(new error_1.default('The promo code is not found.', 404));
    }
    if (role !== client_1.UserRole.admin) {
        found = yield promoCode.findFirst({
            where: {
                id: promoCodeId,
                event: {
                    company: {
                        user: {
                            id: userId,
                        },
                    },
                },
            },
        });
        if (!found) {
            return next(new error_1.default('Forbidden action', 403));
        }
    }
    next();
});
exports.checkUserPromoCodeRights = checkUserPromoCodeRights;
