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
const default_1 = require("../consts/default");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const user = prisma_1.default.user;
const company = prisma_1.default.company;
const Avatar = {
    _removeFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileName) {
                return;
            }
            const fileToRemove = path_1.default.resolve(default_1.DIR_UPLOADS_NAME, fileName);
            if (fs_1.default.existsSync(fileToRemove)) {
                yield fs_1.default.promises.unlink(fileToRemove);
            }
        });
    },
    removeFrom(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj || !obj.picturePath) {
                return;
            }
            yield this._removeFile(obj.picturePath);
        });
    },
    removeFromUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield user.findUnique({
                where: { id: userId },
                select: {
                    picturePath: true,
                    companies: {
                        select: {
                            picturePath: true,
                            events: {
                                select: {
                                    picturePath: true
                                }
                            }
                        }
                    }
                }
            });
            if (!found) {
                return;
            }
            yield this._removeFile(found.picturePath);
            yield Promise.all(found.companies.map((curCompany) => __awaiter(this, void 0, void 0, function* () {
                yield this._removeFromCompany(curCompany);
            })));
        });
    },
    removeFromCompanyById(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield company.findUnique({
                where: { id: companyId },
                select: {
                    picturePath: true,
                    events: {
                        select: {
                            picturePath: true
                        }
                    }
                }
            });
            if (!found) {
                return;
            }
            yield this._removeFromCompany(found);
        });
    },
    _removeFromCompany(curCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._removeFile(curCompany.picturePath);
            yield Promise.all(curCompany.events.map((curEvent) => __awaiter(this, void 0, void 0, function* () {
                yield this._removeFile(curEvent.picturePath);
            })));
        });
    }
};
exports.default = Avatar;
