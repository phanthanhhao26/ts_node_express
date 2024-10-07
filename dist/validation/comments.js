"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsSchema = exports.updateSchema = exports.createSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../consts/validation");
const createSchema = joi_1.default.object().keys({
    eventId: joi_1.default.number().positive().required(),
    content: joi_1.default.string().required().min(validation_1.COMMENT_CONTENT_LENGTH.min).max(validation_1.COMMENT_CONTENT_LENGTH.max),
});
exports.createSchema = createSchema;
const updateSchema = joi_1.default.object().keys({
    content: joi_1.default.string().required().min(validation_1.COMMENT_CONTENT_LENGTH.min).max(validation_1.COMMENT_CONTENT_LENGTH.max),
});
exports.updateSchema = updateSchema;
const getCommentsSchema = joi_1.default.object()
    .keys({
    _start: joi_1.default.number().min(0),
    _end: joi_1.default.number().greater(joi_1.default.ref('_start')),
    _sort: joi_1.default.string(),
    _order: joi_1.default.any().valid('ASC', 'DESC'),
    id: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.array().items(joi_1.default.number())),
    userId: joi_1.default.number(),
    eventId: joi_1.default.number(),
    q: joi_1.default.string(),
})
    .and('_start', '_end')
    .and('_sort', '_order');
exports.getCommentsSchema = getCommentsSchema;
