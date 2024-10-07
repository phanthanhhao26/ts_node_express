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
exports.deleteTheme = exports.updateTheme = exports.createTheme = exports.getThemeById = exports.getThemes = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const query_options_1 = require("../utils/query-options");
const theme = prisma_1.default.eventTheme;
const event = prisma_1.default.event;
const checkThemeName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield theme.findFirst({
        where: {
            name
        }
    });
    if (exists) {
        throw new error_1.default(`This theme name already exists.`, 400);
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
const getThemes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const where = getWhereOptions(req.query);
    const [count, themes] = yield prisma_1.default.$transaction([
        theme.count({ where }),
        theme.findMany(Object.assign(Object.assign({ where }, (0, query_options_1.getPageOptions)(req.query)), (0, query_options_1.getSortOptions)(req.query, 'id'))),
    ]);
    res.header("X-Total-Count", `${count}`).json(themes);
});
exports.getThemes = getThemes;
const getThemeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const themeId = Number(req.params.id);
    const found = yield theme.findFirst({
        where: {
            id: themeId
        }
    });
    if (!found) {
        throw new error_1.default('The theme is not found.', 404);
    }
    res.json(found);
});
exports.getThemeById = getThemeById;
const createTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    yield checkThemeName(name);
    const newTheme = yield theme.create({
        data: {
            name
        },
    });
    res.status(201).json(newTheme);
});
exports.createTheme = createTheme;
const updateTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const themeId = Number(req.params.id);
    yield checkThemeName(name);
    const updatedTheme = yield theme.update({
        where: {
            id: themeId
        },
        data: {
            name
        }
    });
    res.status(201).json(updatedTheme);
});
exports.updateTheme = updateTheme;
const deleteTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const themeId = Number(req.params.id);
    const foundEvent = yield event.findFirst({
        where: {
            themeId
        },
    });
    if (foundEvent) {
        throw new error_1.default('There are events using this theme, so you can not delete it.', 403);
    }
    yield theme.delete({
        where: { id: themeId },
    });
    res.status(204).send();
});
exports.deleteTheme = deleteTheme;
