"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../lib/logger"));
const envSchema = joi_1.default.object()
    .keys({
    DATABASE_URL: joi_1.default.string().required(),
    CLIENT_URL: joi_1.default.string().required(),
    ADMIN_URL: joi_1.default.string().required(),
    SERVER_URL: joi_1.default.string().required(),
    SERVER_PORT: joi_1.default.number().required(),
    TOKEN_SECRET: joi_1.default.string().required(),
    TOKEN_EXPIRES_IN: joi_1.default.string().required(),
    EMAIL_HOST: joi_1.default.string().required(),
    EMAIL_PORT: joi_1.default.number().required(),
    EMAIL_USERNAME: joi_1.default.string().required(),
    EMAIL_PASSWORD: joi_1.default.string().required(),
    ADMIN_EMAIL: joi_1.default.string().email().required(),
    ADMIN_LOGIN: joi_1.default.string().required(),
    ADMIN_PASSWORD: joi_1.default.string().required(),
    STRIPE_API_SECRET_KEY: joi_1.default.string().required(),
    STRIPE_WEBHOOK_KEY: joi_1.default.string().required(),
})
    .options({ allowUnknown: true });
const validateEnv = () => {
    const { error } = envSchema.validate(process.env);
    if (error) {
        logger_1.default.error(`Env validation error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = validateEnv;
