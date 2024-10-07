"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketSchema = exports.updateSchema = exports.createSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../consts/validation");
const createSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().min(validation_1.EVENT_NAME_LENGTH.min).max(validation_1.EVENT_NAME_LENGTH.max),
    description: joi_1.default.string()
        .required()
        .min(validation_1.EVENT_DESCRIPTION_LENGTH.min)
        .max(validation_1.EVENT_DESCRIPTION_LENGTH.max),
    price: joi_1.default.number().min(0).required(),
    ticketsAvailable: joi_1.default.number().positive().required(),
    isNotificationsOn: joi_1.default.boolean().required(),
    isPublic: joi_1.default.boolean().required(),
    date: joi_1.default.date().iso().min('now').required(),
    publishDate: joi_1.default.date().iso().less(joi_1.default.ref('date')).required(),
    latitude: joi_1.default.number().required().min(validation_1.LATITUDE.min).max(validation_1.LATITUDE.max),
    longitude: joi_1.default.number().required().min(validation_1.LONGITUDE.min).max(validation_1.LONGITUDE.max),
    companyId: joi_1.default.number().positive().required(),
    formatId: joi_1.default.number().positive().required(),
    themeId: joi_1.default.number().positive().required(),
});
exports.createSchema = createSchema;
const updateSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().min(validation_1.EVENT_NAME_LENGTH.min).max(validation_1.EVENT_NAME_LENGTH.max),
    description: joi_1.default.string()
        .required()
        .min(validation_1.EVENT_DESCRIPTION_LENGTH.min)
        .max(validation_1.EVENT_DESCRIPTION_LENGTH.max),
    price: joi_1.default.number().min(0).required(),
    ticketsAvailable: joi_1.default.number().min(0).required(),
    isNotificationsOn: joi_1.default.boolean().required(),
    isPublic: joi_1.default.boolean().required(),
    date: joi_1.default.date().iso().min('now').required(),
    publishDate: joi_1.default.date().iso().less(joi_1.default.ref('date')).required(),
    latitude: joi_1.default.number().required().min(validation_1.LATITUDE.min).max(validation_1.LATITUDE.max),
    longitude: joi_1.default.number().required().min(validation_1.LONGITUDE.min).max(validation_1.LONGITUDE.max),
    formatId: joi_1.default.number().positive().required(),
    themeId: joi_1.default.number().positive().required(),
});
exports.updateSchema = updateSchema;
const ticketSchema = joi_1.default.object().keys({
    isVisible: joi_1.default.boolean().required(),
    promoCode: joi_1.default.string().optional().allow(''),
});
exports.ticketSchema = ticketSchema;
