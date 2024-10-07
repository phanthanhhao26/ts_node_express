"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDates = void 0;
const compareDates = (a, b) => {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};
exports.compareDates = compareDates;
