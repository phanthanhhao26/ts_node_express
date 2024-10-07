"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManySchema = exports.createUpdateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../consts/validation");
const createUpdateSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().min(validation_1.FORMAT_THEME_LENGTH.min).max(validation_1.FORMAT_THEME_LENGTH.max)
});
exports.createUpdateSchema = createUpdateSchema;
const getManySchema = joi_1.default.object().keys({
    _start: joi_1.default.number().min(0),
    _end: joi_1.default.number().greater(joi_1.default.ref('_start')),
    _sort: joi_1.default.string(),
    _order: joi_1.default.any().valid('ASC', 'DESC'),
    id: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.array().items(joi_1.default.number())),
    q: joi_1.default.string(),
})
    .and('_start', '_end')
    .and('_sort', '_order');
exports.getManySchema = getManySchema;
