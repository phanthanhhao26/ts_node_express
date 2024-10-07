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
const client_1 = require("@prisma/client");
const error_1 = __importDefault(require("../types/error"));
// Admin auth middleware (note: should be called only after auth middleware,
// otherwise, an exception will be thrown)
const adminAuth = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new error_1.default('You need to authenticate as a user first.', 403));
    }
    const savedUser = req.user;
    if (savedUser.role !== client_1.UserRole.admin) {
        return next(new error_1.default('This action is only available for admins.', 403));
    }
    next();
});
exports.default = adminAuth;
