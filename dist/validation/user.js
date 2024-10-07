"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateSchema = exports.createSchema = exports.updateSchema = exports.resetPasswordSchema = exports.sendPasswordConfirmationSchema = exports.registerSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../consts/validation");
const loginSchema = joi_1.default.object().keys({
    login: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.loginSchema = loginSchema;
const registerSchema = joi_1.default.object().keys({
    login: joi_1.default.string().required().min(validation_1.LOGIN_LENGTH.min).max(validation_1.LOGIN_LENGTH.max),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(validation_1.PASSWORD_LENGTH.min).max(validation_1.PASSWORD_LENGTH.max),
    fullName: joi_1.default.string().required().min(validation_1.FULL_NAME_LENGTH.min).max(validation_1.FULL_NAME_LENGTH.max),
});
exports.registerSchema = registerSchema;
const sendPasswordConfirmationSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
});
exports.sendPasswordConfirmationSchema = sendPasswordConfirmationSchema;
const resetPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().required().min(validation_1.PASSWORD_LENGTH.min).max(validation_1.PASSWORD_LENGTH.max),
});
exports.resetPasswordSchema = resetPasswordSchema;
const updateSchema = joi_1.default.object().keys({
    login: joi_1.default.string().min(validation_1.LOGIN_LENGTH.min).max(validation_1.LOGIN_LENGTH.max),
    email: joi_1.default.string().email(),
    fullName: joi_1.default.string().min(validation_1.FULL_NAME_LENGTH.min).max(validation_1.FULL_NAME_LENGTH.max),
});
exports.updateSchema = updateSchema;
const role = joi_1.default.string().valid(...validation_1.ROLE_ENUM);
const createSchema = registerSchema.keys({ role });
exports.createSchema = createSchema;
const adminUpdateSchema = updateSchema.keys({ role });
exports.adminUpdateSchema = adminUpdateSchema;
