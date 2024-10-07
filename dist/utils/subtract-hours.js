"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subtractHours = (date, hours) => {
    const dateCopy = new Date(date);
    dateCopy.setHours(dateCopy.getHours() - hours);
    return dateCopy;
};
exports.default = subtractHours;
