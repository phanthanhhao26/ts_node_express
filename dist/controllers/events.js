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
exports.deletePoster = exports.updatePoster = exports.deleteEvent = exports.updateEvent = exports.getManyEvents = exports.getOneEventById = exports.createEvent = void 0;
const company_subscribers_notification_1 = require("../jobs/company-subscribers-notification");
const prisma_1 = __importDefault(require("../lib/prisma"));
const event_1 = __importDefault(require("../services/event"));
const compare_dates_1 = require("../utils/compare-dates");
const query_options_1 = require("../utils/query-options");
const avatar_1 = __importDefault(require("../services/avatar"));
const event_reminder_1 = require("../jobs/event-reminder");
const subtract_hours_1 = __importDefault(require("../utils/subtract-hours"));
const default_1 = require("../consts/default");
const wait_1 = __importDefault(require("../utils/wait"));
const error_1 = __importDefault(require("../types/error"));
const company_1 = __importDefault(require("../services/company"));
const event = prisma_1.default.event;
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { publishDate, date } = data;
    if (data.price !== 0) {
        const stripeId = yield company_1.default.isStripeConnected(Number(data.companyId));
        yield company_1.default.checkAccountOrThrow(stripeId);
    }
    yield Promise.all([
        event_1.default.checkUniqueEventName(data.name),
        event_1.default.checkEventFormatExists(data.formatId),
        event_1.default.checkEventThemeExists(data.themeId),
    ]);
    const newEvent = yield event.create({
        data,
        include: { format: true, theme: true },
    });
    (0, company_subscribers_notification_1.scheduleCompanySubscribersNotification)(new Date(publishDate), newEvent.id);
    (0, event_reminder_1.scheduleEventReminder)((0, subtract_hours_1.default)(date, default_1.HOURS_BEFORE_EVENT), newEvent.id);
    res.status(201).json(newEvent);
});
exports.createEvent = createEvent;
const getOneEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = Number(req.params.id);
    const event = yield event_1.default.findEventIfExists(eventId);
    res.status(200).json(event);
});
exports.getOneEventById = getOneEventById;
const getManyEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.query.userId && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== Number(req.query.userId)) {
        throw new error_1.default('You cannot view these events', 403);
    }
    const where = event_1.default.getEventsWhereOptions(req.query);
    const sort = event_1.default.getEventsSortOptions(req.query, 'id');
    const pagination = (0, query_options_1.getPageOptions)(req.query);
    const [events, count] = yield prisma_1.default.$transaction([
        event.findMany(Object.assign(Object.assign(Object.assign({ where }, pagination), sort), { include: { format: true, theme: true } })),
        event.count({ where }),
    ]);
    yield (0, wait_1.default)(2000);
    res.setHeader('X-Total-Count', count);
    res.status(200).json(events);
});
exports.getManyEvents = getManyEvents;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { publishDate, date } = data;
    const eventId = Number(req.params.id);
    const [oldEvent] = yield Promise.all([
        event_1.default.findEventIfExists(eventId),
        event_1.default.checkUniqueEventName(data.name, eventId),
        event_1.default.checkEventFormatExists(data.formatId),
        event_1.default.checkEventThemeExists(data.themeId),
    ]);
    const updatedEvent = yield event.update({
        where: { id: eventId },
        data,
        include: { format: true, theme: true },
    });
    if ((0, compare_dates_1.compareDates)(new Date(publishDate), oldEvent.publishDate)) {
        (0, company_subscribers_notification_1.scheduleCompanySubscribersNotification)(new Date(publishDate), eventId);
    }
    if ((0, compare_dates_1.compareDates)(new Date(date), oldEvent.date)) {
        (0, event_reminder_1.scheduleEventReminder)((0, subtract_hours_1.default)(date, default_1.HOURS_BEFORE_EVENT), eventId);
    }
    res.json(updatedEvent);
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = Number(req.params.id);
    const toUpdate = yield event.findUnique({ where: { id: eventId } });
    yield avatar_1.default.removeFrom(toUpdate);
    const deletedEvent = yield event.delete({
        where: { id: eventId },
        include: { format: true, theme: true },
    });
    res.json(deletedEvent);
});
exports.deleteEvent = deleteEvent;
const updatePoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = Number(req.params.id);
    const picturePath = req.file.filename;
    const toUpdate = yield event.findUnique({ where: { id: eventId } });
    yield avatar_1.default.removeFrom(toUpdate);
    const updatedEvent = yield event.update({
        where: {
            id: eventId,
        },
        data: {
            picturePath,
        },
        include: { format: true, theme: true },
    });
    res.json(updatedEvent);
});
exports.updatePoster = updatePoster;
const deletePoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = Number(req.params.id);
    const toUpdate = yield event.findUnique({ where: { id: eventId } });
    yield avatar_1.default.removeFrom(toUpdate);
    const updatedEvent = yield event.update({
        where: {
            id: eventId,
        },
        data: {
            picturePath: null,
        },
        include: { format: true, theme: true },
    });
    res.json(updatedEvent);
});
exports.deletePoster = deletePoster;
