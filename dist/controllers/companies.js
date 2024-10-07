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
exports.deleteAvatar = exports.updateAvatar = exports.deleteCompany = exports.updateCompany = exports.createCompany = exports.getCompanyById = exports.getCompanies = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const query_options_1 = require("../utils/query-options");
const avatar_1 = __importDefault(require("../services/avatar"));
const company_1 = __importDefault(require("../services/company"));
const company = prisma_1.default.company;
const checkFor = (key, value, notId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield company.findFirst({
        where: {
            [key]: value,
            NOT: {
                id: notId,
            },
        },
    });
    if (exists) {
        throw new error_1.default(`The company with this ${key} already exists.`, 400);
    }
});
function getWhereOptions(queryParams) {
    const where = { AND: [] };
    if (!queryParams) {
        return where;
    }
    const { id, creatorId, subscriberId, q } = queryParams;
    const numToArr = (id) => Array.isArray(id) ? id.map((item) => Number(item)) : [Number(id)];
    if (id) {
        let idNum = numToArr(id);
        Array.isArray(where.AND) &&
            where.AND.push({
                id: { in: idNum },
            });
    }
    if (creatorId) {
        Array.isArray(where.AND) &&
            where.AND.push({
                userId: Number(creatorId),
            });
    }
    if (subscriberId) {
        Array.isArray(where.AND) &&
            where.AND.push({
                subscribers: {
                    some: {
                        userId: Number(subscriberId),
                    },
                },
            });
    }
    if (q) {
        Array.isArray(where.AND) &&
            where.AND.push({
                OR: [
                    {
                        name: {
                            contains: q,
                        },
                    },
                    {
                        email: {
                            contains: q,
                        },
                    },
                ],
            });
    }
    return where;
}
const getCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const where = getWhereOptions(req.query);
    const [count, companies] = yield prisma_1.default.$transaction([
        company.count({ where }),
        company.findMany(Object.assign(Object.assign({ where }, (0, query_options_1.getPageOptions)(req.query)), (0, query_options_1.getSortOptions)(req.query, 'id'))),
    ]);
    res.header('X-Total-Count', `${count}`).json(companies);
});
exports.getCompanies = getCompanies;
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = Number(req.params.id);
    const found = yield company_1.default.findOneOrThrow(companyId);
    const isAccountCompleted = !found.stripeId
        ? null
        : yield company_1.default.isAccountValid(found.stripeId);
    res.json(Object.assign(Object.assign({}, found), { isAccountCompleted }));
});
exports.getCompanyById = getCompanyById;
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id: userId } = req.user;
    yield checkFor('name', data.name);
    yield checkFor('email', data.email);
    const newCompany = yield company.create({
        data: Object.assign(Object.assign({}, data), { userId }),
    });
    res.status(201).json(newCompany);
});
exports.createCompany = createCompany;
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const companyId = Number(req.params.id);
    if (data.name) {
        yield checkFor('name', data.name, companyId);
    }
    if (data.email) {
        yield checkFor('email', data.email, companyId);
    }
    const updatedCompany = yield company_1.default.update(companyId, data);
    res.status(201).json(updatedCompany);
});
exports.updateCompany = updateCompany;
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = Number(req.params.id);
    yield company_1.default.predelete(companyId);
    yield company.delete({
        where: { id: companyId },
    });
    res.status(204).send();
});
exports.deleteCompany = deleteCompany;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new error_1.default('Please provide a valid file.', 400);
    }
    const companyId = Number(req.params.id);
    const toUpdate = yield company.findUnique({ where: { id: companyId } });
    yield avatar_1.default.removeFrom(toUpdate);
    const updatedCompany = yield company.update({
        where: {
            id: companyId,
        },
        data: {
            picturePath: req.file.filename,
        },
    });
    res.status(201).json(updatedCompany);
});
exports.updateAvatar = updateAvatar;
const deleteAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = Number(req.params.id);
    const toUpdate = yield company.findUnique({ where: { id: companyId } });
    yield avatar_1.default.removeFrom(toUpdate);
    const updatedCompany = yield company.update({
        where: {
            id: companyId,
        },
        data: {
            picturePath: null,
        },
    });
    res.status(201).json(updatedCompany);
});
exports.deleteAvatar = deleteAvatar;
