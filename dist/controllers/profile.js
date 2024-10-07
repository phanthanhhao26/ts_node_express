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
exports.deleteUserAvatar = exports.updateUserAvatar = exports.uploadPhoto = exports.deleteProfile = exports.updateProfile = exports.getProfile = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const avatar_1 = __importDefault(require("../services/avatar"));
const company_1 = __importDefault(require("../services/company"));
const user_1 = __importDefault(require("../services/user"));
const error_1 = __importDefault(require("../types/error"));
const file_upload_1 = __importDefault(require("../utils/file-upload"));
const user = prisma_1.default.user;
const company = prisma_1.default.company;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.user, { password, isConfirmed } = _a, rest = __rest(_a, ["password", "isConfirmed"]);
    res.json(rest);
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const data = req.body;
    yield user_1.default.update(id, data);
    res.sendStatus(204);
});
exports.updateProfile = updateProfile;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    yield avatar_1.default.removeFromUserById(id);
    const companies = yield company.findMany({ where: { userId: id } });
    yield Promise.all(companies.map((c) => company_1.default.predelete(c.id)));
    yield user.delete({ where: { id } });
    res.sendStatus(204);
});
exports.deleteProfile = deleteProfile;
const uploadPhoto = file_upload_1.default.single('avatar');
exports.uploadPhoto = uploadPhoto;
const updateUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new error_1.default('Please provide a valid file.', 400);
    }
    const picturePath = req.file.filename;
    const { id } = req.user;
    yield user_1.default.updateAvatar(id, picturePath);
    res.json({ picturePath });
});
exports.updateUserAvatar = updateUserAvatar;
const deleteUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    yield user_1.default.deleteAvatar(id);
    res.sendStatus(204);
});
exports.deleteUserAvatar = deleteUserAvatar;
