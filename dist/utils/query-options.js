"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SORT_OPTIONS = exports.getSortOptions = exports.getPageOptions = void 0;
const client_1 = require("@prisma/client");
const DEFAULT_PAGE_OPTIONS = {
    skip: 0,
    take: 10,
};
const DEFAULT_SORT_OPTIONS = (sort) => ({
    orderBy: {
        [sort]: client_1.Prisma.SortOrder.asc,
    },
});
exports.DEFAULT_SORT_OPTIONS = DEFAULT_SORT_OPTIONS;
const getPageOptions = (params) => {
    if (!params) {
        return DEFAULT_PAGE_OPTIONS;
    }
    const { _start, _end } = params;
    if (!_start || !_end) {
        return DEFAULT_PAGE_OPTIONS;
    }
    const skip = Number(_start);
    const take = Number(_end) - skip;
    return { skip, take };
};
exports.getPageOptions = getPageOptions;
const getSortOptions = (params, defaultSort) => {
    if (!params) {
        return DEFAULT_SORT_OPTIONS(defaultSort);
    }
    const { _sort, _order } = params;
    if (!_sort || !_order) {
        return DEFAULT_SORT_OPTIONS(defaultSort);
    }
    return {
        orderBy: {
            [_sort]: _order.toLowerCase(),
        },
    };
};
exports.getSortOptions = getSortOptions;
