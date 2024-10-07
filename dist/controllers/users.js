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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAvatar = exports.updateUserAvatar = exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.getMany = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const user_1 = __importDefault(require("../services/user"));
const error_1 = __importDefault(require("../types/error"));
const query_options_1 = require("../utils/query-options");
const avatar_1 = __importDefault(require("../services/avatar"));
const wait_1 = __importDefault(require("../utils/wait"));
const company_1 = __importDefault(require("../services/company"));
const user = prisma_1.default.user;
const company = prisma_1.default.company;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = yield user_1.default.create(data);
    res.status(201).json({ id });
});
exports.createUser = createUser;
const getMany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pagination = (0, query_options_1.getPageOptions)(req.query);
    const sort = (0, query_options_1.getSortOptions)(req.query, 'login');
    const { where, isViewAllowed } = yield user_1.default.getWhereOptions(req.query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (!isViewAllowed) {
        return res.header('X-Total-Count', '-1').json(null);
    }
    const [users, count] = yield prisma_1.default.$transaction([
        user.findMany(Object.assign(Object.assign(Object.assign({}, pagination), sort), { where })),
        user.count({ where }),
    ]);
    const result = users.map((_a) => {
        var { password } = _a, obj = __rest(_a, ["password"]);
        return obj;
    });
    res.setHeader('X-Total-Count', count);
    res.json(result);
});
exports.getMany = getMany;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const found = yield user.findUnique({ where: { id } });
    if (!found) {
        throw new error_1.default('This user does not exist', 404);
    }
    const { password } = found, toSend = __rest(found, ["password"]);
    yield (0, wait_1.default)(2000);
    res.json(toSend);
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const id = Number(req.params.id);
    yield user_1.default.findOrThrow(id);
    yield user_1.default.update(id, data);
    res.json({ id });
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield user_1.default.findOrThrow(id);
    yield avatar_1.default.removeFromUserById(id);
    const companies = yield company.findMany({ where: { userId: id } });
    yield Promise.all(companies.map((c) => company_1.default.predelete(c.id)));
    yield user.delete({ where: { id } });
    res.json({ id });
});
exports.deleteUser = deleteUser;
const updateUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new error_1.default('Please provide a valid file.', 400);
    }
    const picturePath = req.file.filename;
    const id = Number(req.params.id);
    yield user_1.default.updateAvatar(id, picturePath);
    res.sendStatus(204);
});
exports.updateUserAvatar = updateUserAvatar;
const deleteUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield user_1.default.deleteAvatar(id);
    res.sendStatus(204);
});
exports.deleteUserAvatar = deleteUserAvatar;
