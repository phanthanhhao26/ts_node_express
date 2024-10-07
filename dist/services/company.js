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
const logger_1 = __importDefault(require("../lib/logger"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const stripe_1 = __importDefault(require("../lib/stripe"));
const error_1 = __importDefault(require("../types/error"));
const avatar_1 = __importDefault(require("./avatar"));
const company = prisma_1.default.company;
const CompanyService = {
    findOneOrThrow(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield company.findFirst({
                where: { id },
            });
            if (!found) {
                throw new error_1.default('The company is not found.', 404);
            }
            return found;
        });
    },
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield company.update({
                where: { id },
                data,
            });
            return updated;
        });
    },
    predelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.findOneOrThrow(id);
            yield avatar_1.default.removeFromCompanyById(id);
            if (found.stripeId && process.env.NODE_ENV === 'development') {
                yield stripe_1.default.accounts.del(found.stripeId);
                logger_1.default.warn(`A stripe account with the ${found.stripeId} id was removed.`);
            }
        });
    },
    checkAccountOrThrow(stripeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield stripe_1.default.accounts.retrieve(stripeId);
            if (!account.details_submitted) {
                throw new error_1.default('The company has not completed their account.', 403);
            }
        });
    },
    isAccountValid(stripeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkAccountOrThrow(stripeId);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    },
    isStripeConnected(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this.findOneOrThrow(id);
            if (!company.stripeId) {
                throw new error_1.default("The company's stripe account does not exist or is not connected to our platform.", 403);
            }
            return company.stripeId;
        });
    },
};
exports.default = CompanyService;
