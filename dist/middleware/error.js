"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../lib/logger"));
const errorMiddleware = (error, _req, res, _next) => {
    logger_1.default.error(error);
    res.status(error.status || 500).json({
        message: error.message || 'A server-side error occurred.',
    });
};
exports.default = errorMiddleware;
