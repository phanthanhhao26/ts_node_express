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
exports.deleteFormat = exports.updateFormat = exports.createFormat = exports.getFormatById = exports.getFormats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const query_options_1 = require("../utils/query-options");
const format = prisma_1.default.eventFormat;
const event = prisma_1.default.event;
const checkFormatName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield format.findFirst({
        where: {
            name
        }
    });
    if (exists) {
        throw new error_1.default(`This format name already exists.`, 400);
    }
});
function getWhereOptions(queryParams) {
    let where = { AND: [] };
    if (!queryParams) {
        return where;
    }
    const { id, q } = queryParams;
    if (id) {
        let idNum = Array.isArray(id) ? id.map((item) => Number(item)) : [Number(id)];
        Array.isArray(where.AND) && where.AND.push({
            id: { in: idNum },
        });
    }
    if (q) {
        Array.isArray(where.AND) && where.AND.push({
            name: {
                contains: q
            }
        });
    }
    return where;
}
const getFormats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const where = getWhereOptions(req.query);
    const [count, formats] = yield prisma_1.default.$transaction([
        format.count({ where }),
        format.findMany(Object.assign(Object.assign({ where }, (0, query_options_1.getPageOptions)(req.query)), (0, query_options_1.getSortOptions)(req.query, 'id'))),
    ]);
    res.header("X-Total-Count", `${count}`).json(formats);
});
exports.getFormats = getFormats;
const getFormatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formatId = Number(req.params.id);
    const found = yield format.findFirst({
        where: {
            id: formatId
        }
    });
    if (!found) {
        throw new error_1.default('The format is not found.', 404);
    }
    res.json(found);
});
exports.getFormatById = getFormatById;
const createFormat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    yield checkFormatName(name);
    const newFormat = yield format.create({
        data: {
            name
        },
    });
    res.status(201).json(newFormat);
});
exports.createFormat = createFormat;
const updateFormat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const formatId = Number(req.params.id);
    yield checkFormatName(name);
    const updatedFormat = yield format.update({
        where: {
            id: formatId
        },
        data: {
            name
        }
    });
    res.status(201).json(updatedFormat);
});
exports.updateFormat = updateFormat;
const deleteFormat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formatId = Number(req.params.id);
    const foundEvent = yield event.findFirst({
        where: {
            formatId
        },
    });
    if (foundEvent) {
        throw new error_1.default('There are events using this format, so you can not delete it.', 403);
    }
    yield format.delete({
        where: { id: formatId },
    });
    res.status(204).send();
});
exports.deleteFormat = deleteFormat;
