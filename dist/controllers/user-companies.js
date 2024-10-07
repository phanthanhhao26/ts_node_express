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
exports.unsubscribeFromCompany = exports.subscribeToCompany = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const company = prisma_1.default.company;
const userCompanies = prisma_1.default.subscriptionToCompany;
const findCompanyOrThrow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield company.findUnique({ where: { id } });
    if (!exists) {
        throw new error_1.default('This company does not exist', 404);
    }
});
const isCompanyConnected = (companyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const found = yield userCompanies.findUnique({
        where: {
            userId_companyId: { companyId, userId },
        },
    });
    return found !== null;
});
const subscribeToCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const companyId = Number(req.params.id);
    yield findCompanyOrThrow(companyId);
    if (yield isCompanyConnected(companyId, userId)) {
        throw new error_1.default('You are already subscribed to this company', 400);
    }
    yield company.update({
        where: { id: companyId },
        data: {
            subscribers: {
                create: { userId },
            },
        },
    });
    res.json({ companyId });
});
exports.subscribeToCompany = subscribeToCompany;
const unsubscribeFromCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const companyId = Number(req.params.id);
    yield findCompanyOrThrow(companyId);
    if (!(yield isCompanyConnected(companyId, userId))) {
        throw new error_1.default('You are not subscribed to this company', 400);
    }
    yield userCompanies.delete({
        where: { userId_companyId: { userId, companyId } },
    });
    res.sendStatus(204);
});
exports.unsubscribeFromCompany = unsubscribeFromCompany;
