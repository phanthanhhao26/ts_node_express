"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("../types/error"));
const validate = (joiSchema, resource = 'body') => (req, _res, next) => {
    const data = req[resource];
    if (!data) {
        next(new error_1.default(`Please provide a request ${resource}.`, 400));
    }
    const { error } = joiSchema.validate(data);
    if (error) {
        next(new error_1.default(error.message, 400));
    }
    next();
};
exports.default = validate;
