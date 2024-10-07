"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addMinutes = (date, minutes) => {
    const dateCopy = new Date(date);
    dateCopy.setMinutes(dateCopy.getMinutes() + minutes);
    return dateCopy;
};
exports.default = addMinutes;
