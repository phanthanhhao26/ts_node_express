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
exports.deleteComment = exports.updateComment = exports.createComment = exports.getCommentById = exports.getComments = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const query_options_1 = require("../utils/query-options");
const wait_1 = __importDefault(require("../utils/wait"));
const event = prisma_1.default.event;
const comment = prisma_1.default.comment;
const checkEventId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield event.findUnique({ where: { id } });
    if (!exists) {
        throw new error_1.default('This event does not exist', 404);
    }
});
function getWhereOptions(queryParams) {
    const where = { AND: [] };
    if (!queryParams) {
        return where;
    }
    const { id, userId, eventId, q } = queryParams;
    if (id) {
        let idNum = Array.isArray(id) ? id.map((item) => Number(item)) : [Number(id)];
        Array.isArray(where.AND) &&
            where.AND.push({
                id: { in: idNum },
            });
    }
    if (userId) {
        Array.isArray(where.AND) &&
            where.AND.push({
                userId: Number(userId),
            });
    }
    if (eventId) {
        Array.isArray(where.AND) &&
            where.AND.push({
                eventId: Number(eventId),
            });
    }
    if (q) {
        Array.isArray(where.AND) &&
            where.AND.push({
                content: {
                    contains: q,
                },
            });
    }
    return where;
}
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const where = getWhereOptions(req.query);
    const [count, comments] = yield prisma_1.default.$transaction([
        comment.count({ where }),
        comment.findMany(Object.assign(Object.assign({ where }, (0, query_options_1.getPageOptions)(req.query)), (0, query_options_1.getSortOptions)(req.query, 'id'))),
    ]);
    yield (0, wait_1.default)(2000);
    res.header('X-Total-Count', `${count}`).json(comments);
});
exports.getComments = getComments;
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = Number(req.params.id);
    const found = yield comment.findFirst({
        where: {
            id: commentId,
        },
    });
    if (!found) {
        throw new error_1.default('The comment is not found.', 404);
    }
    res.json(found);
});
exports.getCommentById = getCommentById;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const { eventId, content } = req.body;
    yield checkEventId(eventId);
    const newComment = yield comment.create({
        data: {
            content,
            userId,
            eventId,
        },
    });
    res.status(201).json(newComment);
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body.content;
    const commentId = Number(req.params.id);
    const updatedComment = yield comment.update({
        where: {
            id: commentId,
        },
        data: {
            content,
        },
    });
    res.status(201).json(updatedComment);
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = Number(req.params.id);
    yield comment.delete({
        where: { id: commentId },
    });
    res.status(204).send();
});
exports.deleteComment = deleteComment;
