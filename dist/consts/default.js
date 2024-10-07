"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIR_UPLOADS_NAME = exports.DateFormatOptions = exports.COOKIE_OPTIONS = exports.HOURS_BEFORE_EVENT = void 0;
const SEVEN_DAYS = 604800000;
exports.HOURS_BEFORE_EVENT = 2;
exports.COOKIE_OPTIONS = {
    maxAge: SEVEN_DAYS,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: 'localhost',
};
exports.DateFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
};
exports.DIR_UPLOADS_NAME = 'uploads';
